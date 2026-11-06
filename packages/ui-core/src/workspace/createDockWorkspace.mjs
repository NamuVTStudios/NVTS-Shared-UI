import { DockLayoutController } from './DockLayoutController.mjs';

export function createDockWorkspace(options = {}) {
    const element = document.createElement('div');
    element.className = `nvts-ui-dock-workspace ${options.className ?? ''}`.trim();
    element.setAttribute('role', 'group');
    element.setAttribute('aria-label', options.label ?? 'Workspace panels');

    const controller = new DockLayoutController(options.panelIds ?? []);
    const panels = new Map();

    function renderOrder() {
        const orderedPanels = controller.getPanelOrder()
            .map((panelId) => panels.get(panelId))
            .filter(Boolean)
            .map((panel) => panel.element);
        element.replaceChildren(...orderedPanels);
    }

    function movePanel(panelId, targetIndex) {
        const nextOrder = controller.move(panelId, targetIndex);
        renderOrder();
        return nextOrder;
    }

    function registerPanel(panelId, content, panelOptions = {}) {
        if (!panelId || panels.has(panelId)) throw new Error(`Panel already registered or invalid: ${panelId}`);
        controller.register(panelId);

        const panel = document.createElement('section');
        panel.className = 'nvts-ui-dock-panel';
        panel.dataset.panelId = panelId;

        const header = document.createElement('header');
        header.className = 'nvts-ui-dock-panel__header';
        const title = document.createElement('h2');
        title.textContent = panelOptions.title ?? panelId;
        header.append(title);

        const controls = document.createElement('div');
        controls.className = 'nvts-ui-dock-panel__controls';
        const up = document.createElement('button');
        up.type = 'button';
        up.textContent = '↑';
        up.setAttribute('aria-label', `Move ${title.textContent} earlier`);
        up.addEventListener('click', () => movePanel(panelId, controller.getPanelOrder().indexOf(panelId) - 1));
        const down = document.createElement('button');
        down.type = 'button';
        down.textContent = '↓';
        down.setAttribute('aria-label', `Move ${title.textContent} later`);
        down.addEventListener('click', () => movePanel(panelId, controller.getPanelOrder().indexOf(panelId) + 1));
        controls.append(up, down);
        header.append(controls);

        const body = document.createElement('div');
        body.className = 'nvts-ui-dock-panel__body';
        if (content) body.append(content);
        panel.append(header, body);
        panels.set(panelId, { element: panel, body });
        renderOrder();
        return { element: panel, header, body };
    }

    return {
        element,
        registerPanel,
        movePanel,
        restore(panelIds) {
            const order = controller.restore(panelIds);
            renderOrder();
            return order;
        },
        serialize: () => controller.serialize(),
        destroy() {
            panels.clear();
            element.replaceChildren();
        },
    };
}
