import test from 'node:test';
import assert from 'node:assert/strict';
import { CommandRegistry } from '../packages/ui-core/src/commands/CommandRegistry.mjs';
import { DockLayoutController } from '../packages/ui-core/src/workspace/DockLayoutController.mjs';
import { TimelineModel } from '../packages/ui-core/src/timeline/TimelineModel.mjs';

test('command registry registers, executes and unregisters commands', () => {
    const commands = new CommandRegistry();
    let calls = 0;
    const unregister = commands.register('document.save', () => ++calls);
    assert.equal(commands.execute('document.save'), 1);
    unregister();
    assert.equal(commands.has('document.save'), false);
    assert.throws(() => commands.execute('document.save'), /Unknown command/);
});

test('dock layout keeps known panels and restores a deterministic order', () => {
    const dock = new DockLayoutController(['layers', 'history', 'tools']);
    dock.move('history', 0);
    assert.deepEqual(dock.serialize(), ['history', 'layers', 'tools']);
    dock.restore(['tools', 'unknown']);
    assert.deepEqual(dock.getPanelOrder(), ['tools', 'history', 'layers']);
});

test('timeline model publishes immutable snapshots for edits', () => {
    const timeline = new TimelineModel();
    let updates = 0;
    const unsubscribe = timeline.subscribe(() => updates++);
    timeline.add({ id: 'clip-1', start: 0, duration: 10 });
    timeline.update('clip-1', { duration: 12 });
    timeline.remove('clip-1');
    unsubscribe();
    assert.equal(updates, 3);
    assert.deepEqual(timeline.getItems(), []);
});
