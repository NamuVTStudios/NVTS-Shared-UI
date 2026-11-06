import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createDockWorkspace,
    createHistoryList,
    createMenu,
    createTimelineView,
    createToolPalette,
    TimelineModel,
} from '../packages/ui-core/src/index.mjs';

class FakeElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.children = [];
        this.attributes = new Map();
        this.listeners = new Map();
        this.dataset = {};
        this.style = { setProperty: () => {} };
        this.className = '';
        this.textContent = '';
        this.open = false;
        this.classList = {
            toggle: (name, force) => {
                const classes = new Set(this.className.split(/\s+/).filter(Boolean));
                if (force ?? !classes.has(name)) classes.add(name);
                else classes.delete(name);
                this.className = [...classes].join(' ');
            },
        };
    }

    append(...nodes) {
        this.children.push(...nodes);
    }

    prepend(node) {
        this.children.unshift(node);
    }

    replaceChildren(...nodes) {
        this.children = [...nodes];
    }

    setAttribute(name, value) {
        this.attributes.set(name, value);
    }

    addEventListener(name, listener) {
        const entries = this.listeners.get(name) ?? [];
        entries.push(listener);
        this.listeners.set(name, entries);
    }

    dispatch(name, event = {}) {
        for (const listener of this.listeners.get(name) ?? []) listener(event);
    }

    focus() {
        this.focused = true;
    }

    remove() {
        this.removed = true;
    }
}

function installFakeDocument() {
    const previous = globalThis.document;
    globalThis.document = { createElement: (tagName) => new FakeElement(tagName) };
    return () => {
        if (previous === undefined) delete globalThis.document;
        else globalThis.document = previous;
    };
}

test('shared menu invokes its action and closes after selection', () => {
    const restore = installFakeDocument();
    try {
        let selected = 0;
        const menu = createMenu({ label: 'File', items: [{ label: 'Save', onSelect: () => selected++ }] });
        menu.element.open = true;
        menu.items.children[0].dispatch('click');
        assert.equal(selected, 1);
        assert.equal(menu.element.open, false);
        assert.equal(menu.trigger.focused, true);
    } finally {
        restore();
    }
});

test('tool palette exposes a selected tool and notifies consumers', () => {
    const restore = installFakeDocument();
    try {
        let selected = null;
        const palette = createToolPalette({ tools: [{ id: 'brush', label: 'Brush' }, { id: 'eraser' }], onSelect: (id) => selected = id });
        palette.selectTool('brush');
        assert.equal(palette.getSelectedTool(), 'brush');
        assert.equal(selected, 'brush');
        assert.equal(palette.element.children[0].attributes.get('aria-pressed'), 'true');
        palette.destroy();
        assert.equal(palette.element.children.length, 0);
    } finally {
        restore();
    }
});

test('dock workspace registers panels and persists a safe order', () => {
    const restore = installFakeDocument();
    try {
        const dock = createDockWorkspace({ panelIds: ['tools', 'layers'] });
        dock.registerPanel('tools', new FakeElement('div'), { title: 'Tools' });
        dock.registerPanel('layers', new FakeElement('div'), { title: 'Layers' });
        dock.movePanel('layers', 0);
        assert.deepEqual(dock.serialize(), ['layers', 'tools']);
        assert.deepEqual(dock.restore(['tools', 'unknown']), ['tools', 'layers']);
        assert.equal(dock.element.children[0].dataset.panelId, 'tools');
    } finally {
        restore();
    }
});

test('history list calls the selected entry handler', () => {
    const restore = installFakeDocument();
    try {
        let selectedId = null;
        const history = createHistoryList({
            entries: [{ id: 'create', label: 'Create' }, { id: 'paint', label: 'Paint' }],
            activeIndex: 0,
            onSelect: (entry) => selectedId = entry.id,
        });
        history.element.children[1].children[0].dispatch('click');
        assert.equal(selectedId, 'paint');
        assert.equal(history.getActiveIndex(), 1);
    } finally {
        restore();
    }
});

test('timeline view follows model changes and releases its subscription', () => {
    const restore = installFakeDocument();
    try {
        const model = new TimelineModel([{ id: 'clip-1', label: 'Clip 1', start: 10, duration: 40 }]);
        const view = createTimelineView(model);
        assert.equal(view.element.children[1].children.length, 1);
        model.add({ id: 'clip-2', label: 'Clip 2', start: 60, duration: 20 });
        assert.equal(view.element.children[1].children.length, 2);
        view.destroy();
        model.add({ id: 'clip-3', label: 'Clip 3' });
        assert.equal(view.element.children[1].children.length, 0);
    } finally {
        restore();
    }
});
