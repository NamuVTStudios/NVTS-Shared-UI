function normalizeShortcut(event) {
    const modifiers = [];
    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.metaKey) modifiers.push('meta');
    if (event.altKey) modifiers.push('alt');
    if (event.shiftKey) modifiers.push('shift');
    return [...modifiers, event.key.toLowerCase()].join('+');
}

export class CommandRegistry {
    constructor() {
        this.handlers = new Map();
    }

    register(id, handler) {
        if (!id || typeof handler !== 'function') throw new TypeError('A command id and handler are required.');
        this.handlers.set(id, handler);
        return () => this.handlers.delete(id);
    }

    execute(id, ...args) {
        const handler = this.handlers.get(id);
        if (!handler) throw new Error(`Unknown command: ${id}`);
        return handler(...args);
    }

    has(id) {
        return this.handlers.has(id);
    }
}

export class KeyboardShortcutManager {
    constructor(commands, target = globalThis.document) {
        this.commands = commands;
        this.target = target;
        this.shortcuts = new Map();
        this.onKeyDown = (event) => this.handleKeyDown(event);
        this.target?.addEventListener?.('keydown', this.onKeyDown);
    }

    register(id, shortcut) {
        const key = [shortcut.ctrlKey ? 'ctrl' : null, shortcut.metaKey ? 'meta' : null, shortcut.altKey ? 'alt' : null, shortcut.shiftKey ? 'shift' : null, shortcut.key.toLowerCase()].filter(Boolean).join('+');
        this.shortcuts.set(key, id);
        return () => this.shortcuts.delete(key);
    }

    handleKeyDown(event) {
        const id = this.shortcuts.get(normalizeShortcut(event));
        if (!id || !this.commands.has(id)) return;
        event.preventDefault();
        this.commands.execute(id, event);
    }

    destroy() {
        this.target?.removeEventListener?.('keydown', this.onKeyDown);
        this.shortcuts.clear();
    }
}
