import { createTemplateGallery } from './createTemplateGallery.mjs';

function createNode(documentRef, tagName, className, text) {
    const element = documentRef.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

/** Mounts a generic catalogue in a product shell without coupling Shared UI to Shared Core. */
export function mountTemplateGallery(root, templates, options = {}) {
    if (!root?.querySelector) throw new TypeError('A product root element is required.');
    if (!Array.isArray(templates) || templates.length === 0) return null;

    const documentRef = options.documentRef ?? root.ownerDocument ?? globalThis.document;
    const target = options.target ?? root.querySelector(options.targetSelector ?? '.nvts-product-stage');
    if (!documentRef?.createElement || !target?.appendChild) return null;

    const section = createNode(documentRef, 'section', 'nvts-shared-template-section');
    const heading = createNode(documentRef, 'h2', 'nvts-shared-template-section__title', options.title ?? 'Shared templates');
    const description = createNode(
        documentRef,
        'p',
        'nvts-shared-template-section__description',
        options.description ?? 'Reusable templates provided by NVTS-Shared-Core.',
    );
    const selection = createNode(
        documentRef,
        'p',
        'nvts-shared-template-section__selection',
        options.initialSelectionMessage ?? 'Select a template to view its dimensions.',
    );
    selection.setAttribute('aria-live', 'polite');

    const gallery = createTemplateGallery({
        templates,
        documentRef,
        label: options.label ?? 'Shared template gallery',
        filterLabel: options.filterLabel ?? 'Category',
        allCategoriesLabel: options.allCategoriesLabel ?? 'All categories',
        onSelect(template) {
            selection.textContent = `${template.title ?? template.name} · ${template.width} × ${template.height} ${template.unit ?? 'px'}`;
            options.onSelect?.(template);
        },
    });

    section.append(heading, description, selection, gallery.element);
    target.appendChild(section);

    return {
        element: section,
        gallery,
        destroy() {
            gallery.destroy();
            section.remove();
        },
    };
}
