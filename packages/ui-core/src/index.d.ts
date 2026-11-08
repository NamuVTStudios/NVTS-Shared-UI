export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
export declare function isThemePreference(value: unknown): value is ThemePreference;
export declare class ThemeController {
    constructor(options?: { root?: HTMLElement | null; preference?: ThemePreference; defaultPreference?: ThemePreference; storage?: Storage | null; storageKey?: string; mediaQuery?: MediaQueryList | null });
    getPreference(): ThemePreference;
    getResolvedTheme(): ResolvedTheme;
    setPreference(preference: ThemePreference, options?: { persist?: boolean }): ResolvedTheme;
    apply(): ResolvedTheme;
    destroy(): void;
}
export declare function createButton(options?: { label?: string; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; type?: 'button' | 'submit' | 'reset'; disabled?: boolean; ariaLabel?: string; onClick?: (event: MouseEvent) => void }): HTMLButtonElement;
export declare function createPanel(options?: { title?: string; className?: string; labelledBy?: string }): { element: HTMLElement; header: HTMLElement; body: HTMLElement };
export declare function createToolbar(options?: { label?: string; className?: string }): HTMLElement;
export declare function createDialog(options?: { title?: string; labelledBy?: string; className?: string }): { element: HTMLDialogElement; title: HTMLElement; body: HTMLElement; open: () => void; close: () => void };
export declare function trapFocus(container: HTMLElement): () => void;
export declare function announce(message: string, options?: { priority?: 'polite' | 'assertive'; container?: HTMLElement }): HTMLElement;
export declare function mountProductShell(root: HTMLElement, options: { productName: string; description: string; iconUrl?: string; themeStorageKey?: string; initialTheme?: ThemePreference }): { themeController: ThemeController; destroy: () => void };
export declare class CommandRegistry { register(id: string, handler: (...args: unknown[]) => unknown): () => void; execute(id: string, ...args: unknown[]): unknown; has(id: string): boolean; }
export declare class KeyboardShortcutManager { constructor(commands: CommandRegistry, target?: EventTarget); register(id: string, shortcut: { key: string; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean; shiftKey?: boolean }): () => void; destroy(): void; }
export declare class DockLayoutController { constructor(panelIds?: string[]); getPanelOrder(): string[]; register(panelId: string): void; move(panelId: string, targetIndex: number): string[]; restore(panelIds: string[]): string[]; serialize(): string[]; }
export declare class TimelineModel { getItems(): unknown[]; add(item: unknown): unknown[]; update(id: string, patch: Record<string, unknown>): unknown[]; remove(id: string): unknown[]; subscribe(listener: (items: unknown[]) => void): () => void; }

export declare function createMenu(options?: { label?: string; className?: string; items?: Array<{ label?: string; shortcut?: string; disabled?: boolean; onSelect?: () => void }> }): { element: HTMLDetailsElement; trigger: HTMLElement; items: HTMLElement };
export declare function createToolPalette(options?: { label?: string; className?: string; selectedToolId?: string; tools?: Array<{ id: string; label?: string; icon?: Node }>; onSelect?: (toolId: string) => void }): { element: HTMLElement; getSelectedTool: () => string | null; selectTool: (toolId: string, notify?: boolean) => string | null; destroy: () => void };
export declare function createDockWorkspace(options?: { className?: string; label?: string; panelIds?: string[] }): { element: HTMLElement; registerPanel: (panelId: string, content?: Node, options?: { title?: string }) => { element: HTMLElement; header: HTMLElement; body: HTMLElement }; movePanel: (panelId: string, targetIndex: number) => string[]; restore: (panelIds: string[]) => string[]; serialize: () => string[]; destroy: () => void };
export declare function createTimelineView(model: TimelineModel, options?: { className?: string; label?: string; title?: string; getLabel?: (item: any) => string }): { element: HTMLElement; refresh: () => void; destroy: () => void };
export declare function createHistoryList(options?: { className?: string; label?: string; entries?: Array<{ id?: string; label?: string; name?: string }>; activeIndex?: number; onSelect?: (entry: any, index: number) => void }): { element: HTMLOListElement; update: (entries: Array<{ id?: string; label?: string; name?: string }>, activeIndex?: number) => void; getActiveIndex: () => number };


export interface TemplateGalleryItem {
    id: string;
    title?: string;
    name?: string;
    category: string;
    width: number;
    height: number;
    unit?: string;
    icon?: string;
    preview?: 'square' | 'portrait' | 'landscape';
}

export interface TemplateGalleryOptions {
    templates?: readonly TemplateGalleryItem[];
    selectedId?: string | null;
    className?: string;
    label?: string;
    filterLabel?: string;
    allCategoriesLabel?: string;
    emptyMessage?: string;
    documentRef?: Document;
    onSelect?: (template: TemplateGalleryItem) => void;
}

export declare function createTemplateGallery(options?: TemplateGalleryOptions): {
    element: HTMLElement;
    getSelectedTemplate: () => TemplateGalleryItem | null;
    selectTemplate: (id: string, notify?: boolean) => TemplateGalleryItem | null;
    setTemplates: (templates: readonly TemplateGalleryItem[]) => void;
    destroy: () => void;
};

export interface MountTemplateGalleryOptions {
    title?: string;
    description?: string;
    label?: string;
    filterLabel?: string;
    allCategoriesLabel?: string;
    initialSelectionMessage?: string;
    target?: HTMLElement;
    targetSelector?: string;
    documentRef?: Document;
    onSelect?: (template: TemplateGalleryItem) => void;
}
export declare function mountTemplateGallery(
    root: HTMLElement,
    templates: readonly TemplateGalleryItem[],
    options?: MountTemplateGalleryOptions,
): { element: HTMLElement; gallery: ReturnType<typeof createTemplateGallery>; destroy: () => void } | null;
