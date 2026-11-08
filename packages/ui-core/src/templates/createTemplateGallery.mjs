function createNode(documentRef, tagName, className) {
    const element = documentRef.createElement(tagName);
    if (className) element.className = className;
    return element;
}

function getTemplateLabel(template) {
    return template.title ?? template.name ?? template.id;
}

function createTemplateCard(documentRef, template, selectedId, onSelect) {
    const button = createNode(documentRef, 'button', 'nvts-template-card');
    const preview = createNode(documentRef, 'span', `nvts-template-card__preview nvts-template-card__preview--${template.preview ?? 'landscape'}`);
    const paper = createNode(documentRef, 'span', 'nvts-template-card__paper');
    const icon = createNode(documentRef, 'span', 'nvts-template-card__icon');
    const title = createNode(documentRef, 'strong', 'nvts-template-card__title');
    const dimensions = createNode(documentRef, 'small', 'nvts-template-card__dimensions');

    button.type = 'button';
    button.dataset.templateId = template.id;
    button.setAttribute('aria-pressed', String(template.id === selectedId));
    preview.appendChild(paper);
    icon.textContent = template.icon ?? '';
    title.textContent = getTemplateLabel(template);
    dimensions.textContent = `${template.width} × ${template.height} ${template.unit ?? 'px'}`;
    button.append(preview, icon, title, dimensions);
    button.addEventListener('click', () => onSelect(template));
    return button;
}

/**
 * Reusable, framework-free template selector. It accepts plain definitions or
 * immutable Template instances and delegates document creation to its consumer.
 */
export function createTemplateGallery(options = {}) {
    const documentRef = options.documentRef ?? globalThis.document;
    if (!documentRef?.createElement) {
        throw new Error('Template gallery requires a browser document.');
    }

    let templates = [...(options.templates ?? [])];
    let selectedId = options.selectedId ?? null;
    let selectedTemplate = templates.find((template) => template.id === selectedId) ?? null;
    let activeCategory = '';

    const element = createNode(documentRef, 'section', `nvts-template-gallery ${options.className ?? ''}`.trim());
    element.setAttribute('aria-label', options.label ?? 'Template gallery');
    const toolbar = createNode(documentRef, 'div', 'nvts-template-gallery__toolbar');
    const filterLabel = createNode(documentRef, 'label', 'nvts-template-gallery__filter-label');
    const filter = createNode(documentRef, 'select', 'nvts-template-gallery__filter');
    const grid = createNode(documentRef, 'div', 'nvts-template-gallery__grid');
    const emptyState = createNode(documentRef, 'p', 'nvts-template-gallery__empty');

    const filterText = createNode(documentRef, 'span', 'nvts-template-gallery__filter-text');
    filterText.textContent = options.filterLabel ?? 'Categoría';
    filterLabel.append(filterText, filter);
    filter.setAttribute('aria-label', options.filterLabel ?? 'Filter templates by category');
    emptyState.textContent = options.emptyMessage ?? 'No hay plantillas en esta categoría.';
    toolbar.appendChild(filterLabel);
    element.append(toolbar, grid, emptyState);

    function renderFilter() {
        const categories = [...new Set(templates.map((template) => template.category))]
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));
        const allOption = createNode(documentRef, 'option');
        allOption.value = '';
        allOption.textContent = options.allCategoriesLabel ?? 'Todas';
        filter.replaceChildren(allOption);

        for (const category of categories) {
            const option = createNode(documentRef, 'option');
            option.value = category;
            option.textContent = category;
            filter.appendChild(option);
        }

        if (categories.includes(activeCategory)) filter.value = activeCategory;
        else activeCategory = '';
    }

    function renderGrid() {
        const visible = templates.filter((template) => !activeCategory || template.category === activeCategory);
        grid.replaceChildren(...visible.map((template) => createTemplateCard(
            documentRef,
            template,
            selectedId,
            selectTemplate,
        )));
        emptyState.hidden = visible.length > 0;
    }

    function selectTemplate(template, notify = true) {
        selectedTemplate = template;
        selectedId = template?.id ?? null;
        renderGrid();
        if (notify && selectedTemplate) options.onSelect?.(selectedTemplate);
        return selectedTemplate;
    }

    function setTemplates(nextTemplates) {
        templates = [...(nextTemplates ?? [])];
        selectedTemplate = templates.find((template) => template.id === selectedId) ?? null;
        if (!selectedTemplate) selectedId = null;
        renderFilter();
        renderGrid();
    }

    filter.addEventListener('change', () => {
        activeCategory = filter.value;
        renderGrid();
    });

    renderFilter();
    renderGrid();

    return {
        element,
        getSelectedTemplate: () => selectedTemplate,
        selectTemplate: (id, notify = true) => {
            const template = templates.find((item) => item.id === id);
            return template ? selectTemplate(template, notify) : null;
        },
        setTemplates,
        destroy: () => element.remove(),
    };
}
