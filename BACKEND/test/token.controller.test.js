import test from 'node:test';
import assert from 'node:assert';
import authService from '../src/services/auth.service.js';
import { refreshToken } from '../src/controllers/token.controller.js';

const originalRotateRefreshToken = authService.rotateRefreshToken;

test('refreshToken controller returns new tokens', async () => {
  const mockTokens = { accessToken: 'new_access_token', refreshToken: 'new_refresh_token' };
  authService.rotateRefreshToken = async (refreshTokenValue) => {
    assert.strictEqual(refreshTokenValue, 'existing_refresh_token');
    return mockTokens;
  };

  let statusCode = null;
  let jsonBody = null;
  const req = { body: { refreshToken: 'existing_refresh_token' } };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      jsonBody = body;
    }
  };

  const next = (err) => {
    if (err) throw err;
  };

  await refreshToken(req, res, next);

  assert.strictEqual(statusCode, 200);
  assert.deepStrictEqual(jsonBody, { status: 'success', data: mockTokens });
  authService.rotateRefreshToken = originalRotateRefreshToken;
});

test('refreshToken controller rejects missing refreshToken', async () => {
  const req = { body: {} };
  let nextError = null;
  const res = { status() { return this; }, json() {} };
  const next = (err) => { nextError = err; };

  await refreshToken(req, res, next);

  assert.ok(nextError);
  assert.strictEqual(nextError.message, 'Refresh token required');
  assert.strictEqual(nextError.statusCode, 400);
});

test('refreshToken controller forwards authService errors', async () => {
  authService.rotateRefreshToken = async () => {
    const error = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  };

  const req = { body: { refreshToken: 'existing_refresh_token' } };
  let nextError = null;
  const res = { status() { return this; }, json() {} };
  const next = (err) => { nextError = err; };

  await refreshToken(req, res, next);

  assert.ok(nextError);
  assert.strictEqual(nextError.message, 'Invalid refresh token');
  assert.strictEqual(nextError.statusCode, 401);
  authService.rotateRefreshToken = originalRotateRefreshToken;
});
