import { createToolbar } from './primitives.mjs';

export function createToolPalette(options = {}) {
    const element = createToolbar({
        label: options.label ?? 'Tool palette',
        className: `nvts-ui-tool-palette ${options.className ?? ''}`.trim(),
    });
    const buttons = new Map();
    let selectedToolId = null;

    function selectTool(toolId, notify = true) {
        if (!buttons.has(toolId)) return selectedToolId;
        selectedToolId = toolId;
        buttons.forEach((button, id) => {
            const selected = id === selectedToolId;
            button.classList.toggle('is-selected', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
        if (notify) options.onSelect?.(toolId);
        return selectedToolId;
    }

    for (const tool of options.tools ?? []) {
        if (!tool?.id || buttons.has(tool.id)) continue;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'nvts-ui-tool-palette__tool';
        button.textContent = tool.label ?? tool.id;
        button.setAttribute('aria-label', tool.label ?? tool.id);
        button.setAttribute('aria-pressed', 'false');
        if (tool.icon && typeof tool.icon.cloneNode === 'function') {
            button.prepend(tool.icon.cloneNode(true));
        }
        button.addEventListener('click', () => selectTool(tool.id));
        buttons.set(tool.id, button);
        element.append(button);
    }

    if (options.selectedToolId) selectTool(options.selectedToolId, false);

    return {
        element,
        getSelectedTool: () => selectedToolId,
        selectTool,
        destroy: () => {
            buttons.clear();
            element.replaceChildren();
        },
    };
}
