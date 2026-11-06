const THEME_PREFERENCES = new Set(['light', 'dark', 'system']);

export function isThemePreference(value) {
    return THEME_PREFERENCES.has(value);
}

function safeStorage(storage) {
    if (storage !== undefined) return storage;
    try {
        return globalThis.localStorage ?? null;
    } catch {
        return null;
    }
}

function safeMatchMedia(mediaQuery) {
    if (mediaQuery !== undefined) return mediaQuery;
    if (typeof globalThis.matchMedia !== 'function') return null;
    return globalThis.matchMedia('(prefers-color-scheme: dark)');
}

export class ThemeController {
    constructor(options = {}) {
        this.root = options.root ?? globalThis.document?.documentElement ?? null;
        this.storage = safeStorage(options.storage);
        this.storageKey = options.storageKey ?? 'nvts-ui-theme';
        this.mediaQuery = safeMatchMedia(options.mediaQuery);
        this.preference = this.readInitialPreference(options);
        this.onSystemThemeChange = () => {
            if (this.preference === 'system') this.apply();
        };
        this.attachSystemListener();
        this.apply();
    }

    readInitialPreference(options) {
        if (isThemePreference(options.preference)) return options.preference;
        try {
            const stored = this.storage?.getItem(this.storageKey);
            if (isThemePreference(stored)) return stored;
        } catch {
            // The default remains usable when browser storage is unavailable.
        }
        return isThemePreference(options.defaultPreference) ? options.defaultPreference : 'system';
    }

    getPreference() {
        return this.preference;
    }

    getResolvedTheme() {
        if (this.preference !== 'system') return this.preference;
        return this.mediaQuery?.matches ? 'dark' : 'light';
    }

    setPreference(preference, options = {}) {
        if (!isThemePreference(preference)) {
            throw new TypeError(`Unsupported theme preference: ${String(preference)}`);
        }
        this.preference = preference;
        if (options.persist !== false) this.persistPreference();
        return this.apply();
    }

    persistPreference() {
        try {
            this.storage?.setItem(this.storageKey, this.preference);
        } catch {
            // Theme changes still apply when storage is blocked or full.
        }
    }

    apply() {
        const resolved = this.getResolvedTheme();
        if (!this.root) return resolved;
        this.root.dataset.theme = resolved;
        this.root.dataset.themePreference = this.preference;
        if (this.root.style) this.root.style.colorScheme = resolved;
        return resolved;
    }

    attachSystemListener() {
        if (!this.mediaQuery) return;
        if (typeof this.mediaQuery.addEventListener === 'function') {
            this.mediaQuery.addEventListener('change', this.onSystemThemeChange);
            return;
        }
        this.mediaQuery.addListener?.(this.onSystemThemeChange);
    }

    destroy() {
        if (!this.mediaQuery) return;
        if (typeof this.mediaQuery.removeEventListener === 'function') {
            this.mediaQuery.removeEventListener('change', this.onSystemThemeChange);
            return;
        }
        this.mediaQuery.removeListener?.(this.onSystemThemeChange);
    }
}
