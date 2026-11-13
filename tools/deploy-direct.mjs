import crypto from 'node:crypto';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

const siteId = '5a8e333b-2f8b-4460-9982-1818df40edfe';
let token = process.env.NETLIFY_AUTH_TOKEN;

if (!token && process.env.APPDATA) {
  try {
    const configPath = path.join(process.env.APPDATA, 'netlify', 'Config', 'config.json');
    if (fs.existsSync(configPath)) {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      token = cfg.users?.[cfg.userId]?.auth?.token || Object.values(cfg.users || {})[0]?.auth?.token;
    }
  } catch {}
}

if (!token) {
  console.error('Error: NETLIFY_AUTH_TOKEN not found in environment or Netlify CLI config.');
  process.exit(1);
}
const distDir = path.resolve('dist');

function getAllFiles(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getAllFiles(fullPath, baseDir));
    } else {
      const relPath = '/' + path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push({ fullPath, relPath });
    }
  }
  return results;
}

const allFiles = getAllFiles(distDir);
const filesMap = {};
const shaToFile = {};

for (const { fullPath, relPath } of allFiles) {
  const content = fs.readFileSync(fullPath);
  const sha = crypto.createHash('sha1').update(content).digest('hex');
  filesMap[relPath] = sha;
  shaToFile[sha] = { fullPath, relPath, content };
}

console.log('Total files to deploy:', Object.keys(filesMap).length);
console.log(filesMap);

function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

function uploadFile(deployId, relPath, content) {
  return new Promise((resolve, reject) => {
    // Netlify path in PUT URL is without leading slash
    const cleanPath = relPath.startsWith('/') ? relPath.slice(1) : relPath;
    const options = {
      hostname: 'api.netlify.com',
      port: 443,
      path: `/api/v1/deploys/${deployId}/files/${encodeURI(cleanPath)}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': content.length
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Failed to upload ${relPath}: HTTP ${res.statusCode} ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(content);
    req.end();
  });
}

async function run() {
  const createDeployBody = JSON.stringify({
    files: filesMap,
    async: false
  });

  console.log('Creating deploy on Netlify...');
  const deploy = await httpRequest({
    hostname: 'api.netlify.com',
    port: 443,
    path: `/api/v1/sites/${siteId}/deploys`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(createDeployBody)
    }
  }, createDeployBody);

  console.log('Deploy created! ID:', deploy.id);
  console.log('State:', deploy.state);
  console.log('Required files to upload:', deploy.required ? deploy.required.length : 0);

  if (deploy.required && deploy.required.length > 0) {
    for (const sha of deploy.required) {
      const fileInfo = shaToFile[sha];
      if (fileInfo) {
        console.log(`Uploading ${fileInfo.relPath} (${fileInfo.content.length} bytes)...`);
        await uploadFile(deploy.id, fileInfo.relPath, fileInfo.content);
        console.log(`Uploaded ${fileInfo.relPath}`);
      } else {
        console.warn(`Unknown SHA: ${sha}`);
      }
    }
  }

  console.log('Checking final deploy status...');
  const finalDeploy = await httpRequest({
    hostname: 'api.netlify.com',
    port: 443,
    path: `/api/v1/sites/${siteId}/deploys/${deploy.id}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  console.log('Final Deploy State:', finalDeploy.state);
  console.log('Live Site URL:', finalDeploy.ssl_url);
}

run().catch(console.error);
