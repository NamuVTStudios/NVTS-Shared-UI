export function createTimelineView(model, options = {}) {
    if (!model || typeof model.subscribe !== 'function' || typeof model.getItems !== 'function') {
        throw new TypeError('A compatible timeline model is required.');
    }

    const element = document.createElement('section');
    element.className = `nvts-ui-timeline ${options.className ?? ''}`.trim();
    element.setAttribute('aria-label', options.label ?? 'Timeline');
    const heading = document.createElement('h2');
    heading.textContent = options.title ?? 'Timeline';
    const track = document.createElement('ol');
    track.className = 'nvts-ui-timeline__track';
    element.append(heading, track);

    function render(items) {
        const nodes = items.map((item) => {
            const node = document.createElement('li');
            node.className = 'nvts-ui-timeline__item';
            node.dataset.itemId = item.id;
            node.textContent = options.getLabel?.(item) ?? item.label ?? item.name ?? item.id;
            const start = Number(item.start ?? 0);
            const duration = Number(item.duration ?? 80);
            node.style.setProperty('--timeline-start', `${Math.max(0, start)}px`);
            node.style.setProperty('--timeline-duration', `${Math.max(1, duration)}px`);
            return node;
        });
        track.replaceChildren(...nodes);
    }

    render(model.getItems());
    const unsubscribe = model.subscribe(render);

    return {
        element,
        refresh: () => render(model.getItems()),
        destroy() {
            unsubscribe();
            track.replaceChildren();
            element.remove();
        },
    };
}
