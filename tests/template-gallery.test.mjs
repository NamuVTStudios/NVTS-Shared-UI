import assert from 'node:assert/strict';
import test from 'node:test';
import { createTemplateGallery } from '../packages/ui-core/src/templates/createTemplateGallery.mjs';

class FakeElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.children = [];
        this.attributes = {};
        this.listeners = new Map();
        this.dataset = {};
        this.style = {};
        this.value = '';
        this.hidden = false;
        this.textContent = '';
    }

    append(...nodes) {
        this.children.push(...nodes);
    }

    appendChild(node) {
        this.children.push(node);
        return node;
    }

    replaceChildren(...nodes) {
        this.children = [...nodes];
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    addEventListener(name, callback) {
        const callbacks = this.listeners.get(name) ?? [];
        callbacks.push(callback);
        this.listeners.set(name, callbacks);
    }

    dispatch(name) {
        for (const callback of this.listeners.get(name) ?? []) callback({ target: this });
    }

    remove() {
        this.removed = true;
    }
}

const fakeDocument = {
    createElement: (tagName) => new FakeElement(tagName),
};

const templates = [
    { id: 'square', title: 'Square Post', category: 'Social', width: 1080, height: 1080, preview: 'square' },
    { id: 'story', title: 'Story', category: 'Social', width: 1080, height: 1920, preview: 'portrait' },
    { id: 'a4', title: 'A4', category: 'Print', width: 2480, height: 3508, preview: 'portrait' },
];

test('template gallery renders reusable cards and emits selected templates', () => {
    let selected = null;
    const gallery = createTemplateGallery({
        documentRef: fakeDocument,
        templates,
        selectedId: 'square',
        onSelect: (template) => { selected = template; },
    });

    const [toolbar, grid] = gallery.element.children;
    assert.equal(grid.children.length, 3);
    grid.children[1].dispatch('click');
    assert.equal(selected.id, 'story');
    assert.equal(gallery.getSelectedTemplate().id, 'story');

    gallery.destroy();
    assert.equal(gallery.element.removed, true);
});

test('template gallery filters categories and updates its catalogue', () => {
    const gallery = createTemplateGallery({ documentRef: fakeDocument, templates });
    const [toolbar, grid] = gallery.element.children;
    const filterLabel = toolbar.children[0];
    const filter = filterLabel.children[1];

    assert.equal(grid.children.length, 3);
    filter.value = 'Print';
    filter.dispatch('change');
    assert.equal(grid.children.length, 1);
    assert.equal(grid.children[0].dataset.templateId, 'a4');

    gallery.setTemplates([templates[0]]);
    assert.equal(grid.children.length, 1);
    assert.equal(filter.children.length, 2);
});


test('mountTemplateGallery mounts and disposes a shared catalogue in a product stage', async () => {
    const { mountTemplateGallery } = await import('../packages/ui-core/src/templates/mountTemplateGallery.mjs');
    const stage = new FakeElement('section');
    const root = { querySelector: () => stage, ownerDocument: fakeDocument };
    const mounted = mountTemplateGallery(root, [
        { id: 'a4', title: 'A4', category: 'Print', width: 2480, height: 3508, preview: 'portrait' },
    ]);
    assert.ok(mounted);
    assert.equal(stage.children.length, 1);
    mounted.destroy();
    assert.equal(mounted.element.removed, true);
});
