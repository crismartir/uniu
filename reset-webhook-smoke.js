const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const port = Number(process.env.PORT || 4212);
const webhookPort = Number(process.env.WEBHOOK_PORT || 4321);
const tempData = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'unio-reset-')), 'data.json');
let received = null;

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}
function jsonRequest(url, body, headers = {}) {
  const payload = JSON.stringify(body);
  return request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), ...headers }, body: payload });
}
function waitForHealth() {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const poll = () => request(`http://127.0.0.1:${port}/api/health`).then(r => r.status === 200 ? resolve() : retry()).catch(retry);
    const retry = () => Date.now() - started > 8000 ? reject(new Error('server did not start')) : setTimeout(poll, 100);
    poll();
  });
}

(async () => {
  const webhook = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      received = { auth: req.headers.authorization || '', body: JSON.parse(body || '{}') };
      res.writeHead(204); res.end();
    });
  });
  await new Promise(resolve => webhook.listen(webhookPort, '127.0.0.1', resolve));
  const child = spawn(process.execPath, ['server.js'], {
    cwd: __dirname,
    env: { ...process.env, NODE_ENV: 'production', PORT: String(port), DATA_FILE: tempData, RESET_EMAIL_WEBHOOK: `http://127.0.0.1:${webhookPort}/reset`, RESET_EMAIL_WEBHOOK_SECRET: 'smoke-secret' },
    stdio: ['ignore', 'ignore', 'pipe']
  });
  try {
    await waitForHealth();
    const email = `reset-smoke-${Date.now()}@example.com`;
    const registered = await jsonRequest(`http://127.0.0.1:${port}/api/auth/register`, { email, password: 'old-password-123' });
    const reset = await jsonRequest(`http://127.0.0.1:${port}/api/auth/request-password-reset`, { email });
    if (reset.status !== 200 || !received || received.auth !== 'Bearer smoke-secret' || received.body.email !== email || !received.body.token) throw new Error('webhook delivery failed');
    const logPath = path.join(__dirname, 'reset-delivery.log');
    const before = fs.existsSync(logPath) ? fs.statSync(logPath).mtimeMs : null;
    const changed = fs.existsSync(logPath) && fs.statSync(logPath).mtimeMs !== before;
    const changedPassword = await jsonRequest(`http://127.0.0.1:${port}/api/auth/reset-password`, { token: received.body.token, password: 'new-password-123' });
    const loggedIn = await jsonRequest(`http://127.0.0.1:${port}/api/auth/login`, { email, password: 'new-password-123' });
    if (registered.status !== 201 || changedPassword.status !== 200 || loggedIn.status !== 200 || changed) throw new Error('reset flow failed');
    console.log('RESET_WEBHOOK_SMOKE delivery=ok auth=ok no_local_log=ok reset=ok login=ok');
  } finally {
    child.kill();
    webhook.close();
  }
})().catch(error => { console.error(`RESET_WEBHOOK_SMOKE_FAILED ${error.message}`); process.exitCode = 1; });
