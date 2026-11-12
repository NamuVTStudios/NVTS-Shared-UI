import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function collectExportTargets(value, exportName, targets = []) {
  if (typeof value === 'string') {
    if (value.startsWith('./')) targets.push({ exportName, target: value });
    return targets;
  }
  if (!value || typeof value !== 'object') return targets;
  for (const entry of Object.values(value)) collectExportTargets(entry, exportName, targets);
  return targets;
}

function assertExportTarget(packageDirectory, exportName, target) {
  const wildcardIndex = target.indexOf('*');
  const targetBase = wildcardIndex >= 0 ? target.slice(0, wildcardIndex) : target;
  const resolved = path.resolve(packageDirectory, targetBase);
  assert.ok(fs.existsSync(resolved), `${exportName} points to a missing target: ${resolved}`);

  if (wildcardIndex >= 0) {
    assert.ok(fs.statSync(resolved).isDirectory(), `${exportName} wildcard target must be a directory: ${resolved}`);
    const entries = fs.readdirSync(resolved);
    assert.ok(entries.length > 0, `${exportName} wildcard target must contain at least one asset: ${resolved}`);
  }
}

test('Shared UI package exports resolve to case-correct files and asset directories', () => {
  const packageDirectories = [
    packageRoot,
    path.join(packageRoot, 'packages/icons'),
  ];

  for (const packageDirectory of packageDirectories) {
    const manifestPath = path.join(packageDirectory, 'package.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const targets = collectExportTargets(manifest.exports, manifest.name);

    assert.ok(targets.length > 0, `${manifest.name} must declare package exports`);
    for (const { exportName, target } of targets) {
      assertExportTarget(packageDirectory, exportName, target);
    }
  }
});
