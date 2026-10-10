import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'dist');
const files = ['index.html', 'script.js'];
const directories = ['css', 'images'];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of files) {
    await cp(resolve(projectRoot, file), resolve(outputDirectory, file));
}

for (const directory of directories) {
    await cp(resolve(projectRoot, directory), resolve(outputDirectory, directory), { recursive: true });
}

console.log(`Static site built at ${outputDirectory}`);
