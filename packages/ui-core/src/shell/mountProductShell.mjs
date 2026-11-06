import { ThemeController } from '../theme/ThemeController.mjs';
import { createToolbar } from '../components/primitives.mjs';

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function createThemeControl(controller) {
    const wrapper = createElement('label', 'nvts-ui-theme-control');
    const caption = createElement('span', '', 'Theme');
    const select = document.createElement('select');
    select.setAttribute('aria-label', 'Color theme');
    const options = [
        ['system', 'Automatic'],
        ['light', 'Light'],
        ['dark', 'Dark'],
    ];
    options.forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        select.append(option);
    });
    select.value = controller.getPreference();
    select.addEventListener('change', () => controller.setPreference(select.value));
    wrapper.append(caption, select);
    return wrapper;
}

export function mountProductShell(root, options) {
    if (!root) throw new TypeError('A product shell root element is required.');
    const productName = options.productName ?? 'NVTS Application';
    const controller = new ThemeController({
        storageKey: options.themeStorageKey ?? `nvts-theme:${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        defaultPreference: options.initialTheme ?? 'system',
    });

    const shell = createElement('div', 'nvts-product-shell');
    const header = createElement('header', 'nvts-product-header');
    const brand = createElement('div', 'nvts-product-brand');
    if (options.iconUrl) {
        const icon = document.createElement('img');
        icon.src = options.iconUrl;
        icon.alt = '';
        icon.width = 36;
        icon.height = 36;
        brand.append(icon);
    }
    const identity = createElement('div', 'nvts-product-identity');
    identity.append(createElement('strong', '', productName), createElement('span', '', 'NamuVT Studios'));
    brand.append(identity);
    header.append(brand, createThemeControl(controller));

    const toolbar = createToolbar({ label: `${productName} workspace toolbar`, className: 'nvts-product-toolbar' });
    toolbar.append(createElement('span', 'nvts-product-toolbar__label', 'Workspace'));

    const workspace = createElement('main', 'nvts-product-workspace');
    const sidebar = createElement('aside', 'nvts-product-sidebar');
    sidebar.setAttribute('aria-label', 'Workspace navigation');
    sidebar.append(createElement('strong', '', 'Workspace'), createElement('p', '', 'Product modules are added here as their domain features are implemented.'));
    const stage = createElement('section', 'nvts-product-stage');
    stage.setAttribute('aria-labelledby', 'nvts-product-title');
    const title = createElement('h1', '', 'Workspace ready');
    title.id = 'nvts-product-title';
    stage.append(title, createElement('p', 'nvts-product-description', options.description ?? 'NVTS application workspace.'));
    const status = createElement('footer', 'nvts-product-status', 'Application shell · Shared UI connected');
    workspace.append(sidebar, stage);
    shell.append(header, toolbar, workspace, status);
    root.replaceChildren(shell);

    return {
        themeController: controller,
        destroy() {
            controller.destroy();
            root.replaceChildren();
        },
    };
}
