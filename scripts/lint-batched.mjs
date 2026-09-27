import { spawnSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const eslintCli = resolve(projectRoot, 'node_modules', 'eslint', 'bin', 'eslint.js');
const batchSize = 8;
const ignoredDirectories = new Set(['.git', '.next', 'dist', 'node_modules']);

async function collectLintTargets(directory, targets = []) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) await collectLintTargets(absolutePath, targets);
      continue;
    }
    if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
      targets.push(relative(projectRoot, absolutePath).split(sep).join('/'));
    }
  }
  return targets;
}

const targets = (await collectLintTargets(projectRoot)).sort();
if (targets.length === 0) {
  console.error('No TypeScript lint targets were found.');
  process.exit(1);
}

const batchCount = Math.ceil(targets.length / batchSize);
console.log(`Linting ${targets.length} TypeScript files in ${batchCount} batches of up to ${batchSize}.`);

for (let start = 0, batchNumber = 1; start < targets.length; start += batchSize, batchNumber += 1) {
  const batch = targets.slice(start, start + batchSize);
  const result = spawnSync(process.execPath, [eslintCli, ...batch], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  if (result.error) {
    console.error(`ESLint batch ${batchNumber}/${batchCount} could not start:`, result.error);
    process.exit(result.status ?? 1);
  }
  if (result.status !== 0) {
    console.error(`ESLint batch ${batchNumber}/${batchCount} failed (files ${start + 1}-${start + batch.length} of ${targets.length}).`);
    process.exit(result.status ?? 1);
  }
  console.log(`Passed batch ${batchNumber}/${batchCount} (files ${start + 1}-${start + batch.length} of ${targets.length}).`);
}

console.log(`Lint passed for all ${targets.length} TypeScript files.`);
