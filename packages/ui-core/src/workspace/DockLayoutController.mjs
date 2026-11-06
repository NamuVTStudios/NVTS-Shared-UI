export class DockLayoutController {
    constructor(panelIds = []) {
        this.panelOrder = [...new Set(panelIds.filter(Boolean))];
    }

    getPanelOrder() {
        return [...this.panelOrder];
    }

    register(panelId) {
        if (!panelId || this.panelOrder.includes(panelId)) return this.getPanelOrder();
        this.panelOrder.push(panelId);
        return this.getPanelOrder();
    }

    move(panelId, targetIndex) {
        const currentIndex = this.panelOrder.indexOf(panelId);
        if (currentIndex < 0) return this.getPanelOrder();
        const [panel] = this.panelOrder.splice(currentIndex, 1);
        const safeIndex = Math.max(0, Math.min(this.panelOrder.length, Math.trunc(targetIndex)));
        this.panelOrder.splice(safeIndex, 0, panel);
        return this.getPanelOrder();
    }

    restore(panelIds) {
        const known = new Set(this.panelOrder);
        const restored = panelIds.filter((id) => known.has(id));
        const missing = this.panelOrder.filter((id) => !restored.includes(id));
        this.panelOrder = [...restored, ...missing];
        return this.getPanelOrder();
    }

    serialize() {
        return this.getPanelOrder();
    }
}
