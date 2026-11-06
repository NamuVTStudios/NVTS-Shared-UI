const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function createButton(options = {}) {
    const button = document.createElement('button');
    button.type = options.type ?? 'button';
    button.className = `nvts-ui-button nvts-ui-button--${options.variant ?? 'secondary'}`;
    button.textContent = options.label ?? '';
    button.disabled = options.disabled === true;
    if (options.ariaLabel) button.setAttribute('aria-label', options.ariaLabel);
    if (typeof options.onClick === 'function') button.addEventListener('click', options.onClick);
    return button;
}

export function createPanel(options = {}) {
    const element = document.createElement('section');
    element.className = `nvts-ui-panel ${options.className ?? ''}`.trim();
    if (options.labelledBy) element.setAttribute('aria-labelledby', options.labelledBy);
    const header = document.createElement('header');
    header.className = 'nvts-ui-panel__header';
    const title = document.createElement('h2');
    title.textContent = options.title ?? '';
    header.append(title);
    const body = document.createElement('div');
    body.className = 'nvts-ui-panel__body';
    element.append(header, body);
    return { element, header, body };
}

export function createToolbar(options = {}) {
    const toolbar = document.createElement('div');
    toolbar.className = `nvts-ui-toolbar ${options.className ?? ''}`.trim();
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', options.label ?? 'Application toolbar');
    return toolbar;
}

export function trapFocus(container) {
    const focusable = () => Array.from(container.querySelectorAll(FOCUSABLE)).filter((item) => item.offsetParent !== null);
    const handler = (event) => {
        if (event.key !== 'Tab') return;
        const items = focusable();
        if (items.length === 0) {
            event.preventDefault();
            container.focus();
            return;
        }
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
            return;
        }
        if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };
    container.addEventListener('keydown', handler);
    return () => container.removeEventListener('keydown', handler);
}

export function createDialog(options = {}) {
    const element = document.createElement('dialog');
    element.className = `nvts-ui-dialog ${options.className ?? ''}`.trim();
    element.setAttribute('aria-modal', 'true');
    const title = document.createElement('h2');
    title.textContent = options.title ?? '';
    if (options.labelledBy) title.id = options.labelledBy;
    else title.id = `nvts-dialog-title-${Math.random().toString(36).slice(2)}`;
    element.setAttribute('aria-labelledby', title.id);
    const body = document.createElement('div');
    body.className = 'nvts-ui-dialog__body';
    element.append(title, body);
    document.body.append(element);
    return {
        element,
        title,
        body,
        open: () => {
            if (!element.open) element.showModal();
            title.focus?.();
        },
        close: () => {
            if (element.open) element.close();
        },
    };
}

export function announce(message, options = {}) {
    const container = options.container ?? document.body;
    let region = container.querySelector(`[data-nvts-live="${options.priority ?? 'polite'}"]`);
    if (!region) {
        region = document.createElement('div');
        region.dataset.nvtsLive = options.priority ?? 'polite';
        region.className = 'nvts-ui-visually-hidden';
        region.setAttribute('aria-live', options.priority ?? 'polite');
        region.setAttribute('aria-atomic', 'true');
        container.append(region);
    }
    region.textContent = message;
    return region;
}
