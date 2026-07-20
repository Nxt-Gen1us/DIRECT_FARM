import test from 'node:test';
import assert from 'node:assert';
import app from '../src/app.js';

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

test('GET /api/v1/health returns ok status', async () => {
  const server = app.listen(0);
  const address = server.address();
  const port = address && address.port;

  assert.ok(port, 'Expected server to bind to an ephemeral port');

  const response = await fetch(`http://127.0.0.1:${port}/api/v1/health`);
  const body = await response.json();

  assert.strictEqual(response.status, 200);
  assert.strictEqual(body.status, 'ok');
  assert.strictEqual(body.environment, process.env.NODE_ENV || 'development');
  assert.strictEqual(body.version, 'v1');

  await close(server);
});
