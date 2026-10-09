import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';

if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('PORT must be an integer between 0 and 65535.');
}

const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml; charset=utf-8'
};
const publicRootFiles = new Set(['index.html', 'script.js']);

function sendJson(response, statusCode, body, method) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
    });
    response.end(method === 'HEAD' ? undefined : JSON.stringify(body));
}

const server = createServer(async (request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.setHeader('Allow', 'GET, HEAD');
        sendJson(response, 405, { error: 'Method not allowed' }, request.method);
        return;
    }

    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch (error) {
        sendJson(response, 400, { error: 'Invalid URL path' }, request.method);
        return;
    }

    if (pathname === '/api/health') {
        sendJson(response, 200, {
            status: 'ok',
            service: 'rayhan-portfolio',
            timestamp: new Date().toISOString()
        }, request.method);
        return;
    }

    if (pathname.startsWith('/api/')) {
        sendJson(response, 404, { error: 'API route not found' }, request.method);
        return;
    }

    const requestedPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const filePath = resolve(rootDirectory, requestedPath);
    const relativePath = relative(rootDirectory, filePath);

    if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
        sendJson(response, 403, { error: 'Forbidden' }, request.method);
        return;
    }

    const normalizedPath = relativePath.replaceAll('\\', '/');
    const isPublicFile = publicRootFiles.has(normalizedPath)
        || normalizedPath.startsWith('css/')
        || normalizedPath.startsWith('images/');

    if (!isPublicFile) {
        sendJson(response, 404, { error: 'File not found' }, request.method);
        return;
    }

    let fileInfo;
    try {
        fileInfo = await stat(filePath);
    } catch (error) {
        if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
            sendJson(response, 404, { error: 'File not found' }, request.method);
            return;
        }
        console.error('Failed to inspect requested file:', error);
        sendJson(response, 500, { error: 'Unable to serve file' }, request.method);
        return;
    }

    if (!fileInfo.isFile()) {
        sendJson(response, 404, { error: 'File not found' }, request.method);
        return;
    }

    const contentType = contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream';
    response.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': fileInfo.size,
        'X-Content-Type-Options': 'nosniff'
    });

    if (request.method === 'HEAD') {
        response.end();
        return;
    }

    const fileStream = createReadStream(filePath);
    fileStream.on('error', error => {
        console.error('Failed to stream requested file:', error);
        if (response.headersSent) {
            response.destroy(error);
        } else {
            sendJson(response, 500, { error: 'Unable to serve file' }, request.method);
        }
    });
    fileStream.pipe(response);
});

server.on('error', error => {
    console.error('Portfolio server failed:', error);
    process.exitCode = 1;
});

server.listen(port, host, () => {
    const address = server.address();
    console.log(`Portfolio server listening at http://${host}:${address.port}`);
});
