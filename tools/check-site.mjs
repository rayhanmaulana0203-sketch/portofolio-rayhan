import { readFile, stat } from 'node:fs/promises';
import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distHtmlPath = resolve(projectRoot, 'dist', 'index.html');
const rootHtmlPath = resolve(projectRoot, 'index.html');

let htmlPath = rootHtmlPath;
try {
    await stat(distHtmlPath);
    htmlPath = distHtmlPath;
} catch {
    htmlPath = rootHtmlPath;
}

const html = await readFile(htmlPath, 'utf8');
const failures = [];

if (!/^<!doctype html>/i.test(html.trimStart())) {
    failures.push(`${relative(projectRoot, htmlPath)} is missing the HTML doctype.`);
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
    let pathname;
    try {
        pathname = decodeURIComponent(new URL(reference, 'http://localhost').pathname);
    } catch {
        failures.push(`Invalid local asset reference: ${reference}`);
        continue;
    }

    const cleanPath = pathname.replace(/^\/+/, '');
    const searchDirs = [
        resolve(projectRoot, 'dist'),
        resolve(projectRoot, 'public'),
        projectRoot
    ];

    let fileFound = false;
    for (const dir of searchDirs) {
        const candidate = resolve(dir, cleanPath);
        const rel = relative(projectRoot, candidate);
        if (rel.startsWith('..') || isAbsolute(rel)) continue;

        try {
            if ((await stat(candidate)).isFile()) {
                fileFound = true;
                break;
            }
        } catch {}
    }

    if (!fileFound) {
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
    console.log(`Site check passed: ${ids.length} unique IDs and ${localReferences.length} local assets in ${relative(projectRoot, htmlPath)}.`);
}
