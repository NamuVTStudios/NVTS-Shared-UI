export function createHistoryList(options = {}) {
    const element = document.createElement('ol');
    element.className = `nvts-ui-history ${options.className ?? ''}`.trim();
    element.setAttribute('aria-label', options.label ?? 'History');
    let entries = [];
    let activeIndex = -1;

    function render() {
        const nodes = entries.map((entry, index) => {
            const item = document.createElement('li');
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = entry.label ?? entry.name ?? `History ${index + 1}`;
            button.setAttribute('aria-current', index === activeIndex ? 'step' : 'false');
            button.classList.toggle('is-active', index === activeIndex);
            button.addEventListener('click', () => {
                activeIndex = index;
                render();
                options.onSelect?.(entry, index);
            });
            item.append(button);
            return item;
        });
        element.replaceChildren(...nodes);
    }

    function update(nextEntries, nextActiveIndex = activeIndex) {
        entries = Array.isArray(nextEntries) ? [...nextEntries] : [];
        activeIndex = Math.max(-1, Math.min(entries.length - 1, Math.trunc(nextActiveIndex)));
        render();
    }

    update(options.entries ?? [], options.activeIndex ?? -1);
    return { element, update, getActiveIndex: () => activeIndex };
}
