import test from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

async function createApp() {
  process.env.RAZORPAY_KEY_SECRET = 'test_secret';
  const { default: app } = await import('../src/app.js');
  return app;
}

test('POST /api/v1/webhooks/razorpay with valid signature returns 200', async () => {
  const app = await createApp();
  const server = app.listen(0);
  const address = server.address();
  const port = address && address.port;
  assert.ok(port, 'Expected server to bind to an ephemeral port');

  const payload = { event: 'payment.captured', payload: { payment: { entity: { id: 'pay_1', order_id: 'order_1' } } } };
  const raw = JSON.stringify(payload);
  const signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(Buffer.from(raw)).digest('hex');

  const res = await fetch(`http://127.0.0.1:${port}/api/v1/webhooks/razorpay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': signature },
    body: raw
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.status, 'ok');

  await close(server);
});

test('POST /api/v1/webhooks/razorpay with invalid signature returns 400', async () => {
  const app = await createApp();
  const server = app.listen(0);
  const address = server.address();
  const port = address && address.port;
  assert.ok(port, 'Expected server to bind to an ephemeral port');

  const payload = { event: 'payment.failed', payload: { payment: { entity: { id: 'pay_2', order_id: 'order_2' } } } };
  const raw = JSON.stringify(payload);
  const badSig = 'bad_signature';

  const res = await fetch(`http://127.0.0.1:${port}/api/v1/webhooks/razorpay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': badSig },
    body: raw
  });

  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.status, 'error');

  await close(server);
});
