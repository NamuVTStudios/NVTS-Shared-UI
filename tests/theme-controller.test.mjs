import test from 'node:test';
import assert from 'node:assert/strict';
import { ThemeController } from '../packages/ui-core/src/theme/ThemeController.mjs';

function createRoot() {
    return { dataset: {}, style: {} };
}

function createStorage() {
    const values = new Map();
    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
    };
}

function createMedia(matches = false) {
    const listeners = new Set();
    return {
        matches,
        addEventListener: (_name, handler) => listeners.add(handler),
        removeEventListener: (_name, handler) => listeners.delete(handler),
        setMatches(value) {
            this.matches = value;
            listeners.forEach((handler) => handler({ matches: value }));
        },
        listenerCount: () => listeners.size,
    };
}

test('automatic theme follows system preference changes', () => {
    const root = createRoot();
    const media = createMedia(false);
    const controller = new ThemeController({ root, mediaQuery: media, storage: createStorage(), preference: 'system' });
    assert.equal(root.dataset.theme, 'light');
    media.setMatches(true);
    assert.equal(root.dataset.theme, 'dark');
    controller.destroy();
    assert.equal(media.listenerCount(), 0);
});

test('explicit theme remains selected when system preference changes', () => {
    const root = createRoot();
    const media = createMedia(true);
    const controller = new ThemeController({ root, mediaQuery: media, storage: createStorage(), preference: 'light' });
    assert.equal(root.dataset.theme, 'light');
    media.setMatches(false);
    assert.equal(root.dataset.theme, 'light');
    controller.setPreference('dark', { persist: false });
    assert.equal(root.dataset.theme, 'dark');
    assert.equal(root.dataset.themePreference, 'dark');
    controller.destroy();
});

test('theme preference persists and falls back safely when storage is unavailable', () => {
    const root = createRoot();
    const storage = createStorage();
    const controller = new ThemeController({ root, mediaQuery: createMedia(false), storage, storageKey: 'app-theme' });
    controller.setPreference('dark');
    assert.equal(storage.getItem('app-theme'), 'dark');
    assert.throws(() => controller.setPreference('sepia'), /Unsupported theme preference/);
    controller.destroy();
});
