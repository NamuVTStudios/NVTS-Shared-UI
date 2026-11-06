export class TimelineModel {
    constructor(items = []) {
        this.items = [...items];
        this.listeners = new Set();
    }

    getItems() {
        return this.items.map((item) => ({ ...item }));
    }

    publish() {
        const snapshot = this.getItems();
        this.listeners.forEach((listener) => listener(snapshot));
        return snapshot;
    }

    add(item) {
        if (!item || typeof item.id !== 'string' || !item.id) throw new TypeError('Timeline items require a stable string id.');
        if (this.items.some((current) => current.id === item.id)) throw new Error(`Timeline item already exists: ${item.id}`);
        this.items.push({ ...item });
        return this.publish();
    }

    update(id, patch) {
        this.items = this.items.map((item) => item.id === id ? { ...item, ...patch, id } : item);
        return this.publish();
    }

    remove(id) {
        this.items = this.items.filter((item) => item.id !== id);
        return this.publish();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
}
