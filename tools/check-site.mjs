import { readFile, stat } from 'node:fs/promises';
import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const htmlPath = resolve(projectRoot, 'index.html');
const html = await readFile(htmlPath, 'utf8');
const failures = [];

if (!/^<!doctype html>/i.test(html.trimStart())) {
    failures.push('index.html is missing the HTML doctype.');
}

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length > 0) {
    failures.push(`Duplicate HTML IDs: ${[...new Set(duplicateIds)].join(', ')}`);
}

const idSet = new Set(ids);
for (const [, target] of html.matchAll(/\bhref=["']#([^"']+)["']/g)) {
    if (!idSet.has(target)) {
        failures.push(`In-page link points to missing ID: #${target}`);
    }
}

const localReferences = [
    ...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)
].map(match => match[1]).filter(value => {
    return value
        && !value.startsWith('#')
        && !value.startsWith('//')
        && !/^[a-z][a-z\d+.-]*:/i.test(value);
});

for (const reference of localReferences) {
    let localPath;
    try {
        const pathname = decodeURIComponent(new URL(reference, 'http://localhost').pathname);
        localPath = resolve(projectRoot, pathname.replace(/^\/+/, ''));
    } catch {
        failures.push(`Invalid local asset reference: ${reference}`);
        continue;
    }

    const relativePath = relative(projectRoot, localPath);
    if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
        failures.push(`Local asset reference escapes the project: ${reference}`);
        continue;
    }

    try {
        if (!(await stat(localPath)).isFile()) {
            failures.push(`Local asset is not a file: ${reference}`);
        }
    } catch {
        failures.push(`Local asset does not exist: ${reference}`);
    }
}

const projectsSection = html.match(/<section\b(?=[^>]*\bid=["']projects["'])[^>]*>([\s\S]*?)<\/section>/i);
if (!projectsSection) {
    failures.push('Projects section with id="projects" was not found.');
} else {
    const projectCards = [...projectsSection[1].matchAll(/<article\b/gi)];
    if (projectCards.length !== 3) {
        failures.push(`Expected 3 project cards, found ${projectCards.length}.`);
    }
}

if (failures.length > 0) {
    console.error('Site check failed:');
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exitCode = 1;
} else {
    console.log(`Site check passed: ${ids.length} unique IDs and ${localReferences.length} local assets.`);
}
