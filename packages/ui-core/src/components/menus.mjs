export function createMenu(options = {}) {
    const container = document.createElement('details');
    container.className = `nvts-ui-menu ${options.className ?? ''}`.trim();

    const trigger = document.createElement('summary');
    trigger.textContent = options.label ?? 'Menu';
    container.append(trigger);

    const items = document.createElement('div');
    items.className = 'nvts-ui-menu__items';
    items.setAttribute('aria-label', options.label ?? 'Menu items');

    for (const item of options.items ?? []) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'nvts-ui-menu__item';
        button.textContent = item.label ?? '';
        button.disabled = item.disabled === true;
        if (item.shortcut) button.setAttribute('aria-keyshortcuts', item.shortcut);
        button.addEventListener('click', () => {
            item.onSelect?.();
            container.open = false;
            trigger.focus();
        });
        items.append(button);
    }

    container.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        container.open = false;
        trigger.focus();
    });
    container.append(items);

    return { element: container, trigger, items };
}
