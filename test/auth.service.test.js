import test from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../src/services/auth.service.js';

const mockUser = {
  id: 'userId1',
  email: 'test@example.com',
  password: '$2b$12$Nyc4/0L7KyywYdCNPsdC9urBAEXA6Z3PsenGpPDGHBtUKmNhQwMTu',
  role: 'customer',
  sessions: []
};

const mockUserRepository = {
  findByEmail: async (email) => (email === mockUser.email ? { ...mockUser } : null),
  addSession: async (id, sessionData) => ({ ...mockUser, sessions: [sessionData] }),
  findById: async () => ({ ...mockUser }),
  replaceSession: async () => ({ ...mockUser }),
  removeSession: async () => ({ ...mockUser })
};

const mockEmailService = {
  sendVerificationEmail: async () => {},
  sendPasswordReset: async () => {},
  sendOtp: async () => {}
};

const authService = new AuthService({ userRepository: mockUserRepository, emailService: mockEmailService });

test('login should throw invalid credentials for unknown email', async () => {
  await assert.rejects(async () => authService.login('unknown@example.com', 'pass'), {
    message: 'Invalid credentials'
  });
});

test('login should return tokens for a valid user', async () => {
  const result = await authService.login(mockUser.email, 'secret123');
  assert.ok(result.accessToken, 'accessToken should exist');
  assert.ok(result.refreshToken, 'refreshToken should exist');
  assert.strictEqual(result.user.email, mockUser.email);
});

test('register should throw when email is already registered', async () => {
  await assert.rejects(async () => authService.register({ email: mockUser.email, password: 'secret123', firstName: 'Jane' }), {
    message: 'Email already registered'
  });
});

test('rotateRefreshToken should reject invalid tokens', async () => {
  await assert.rejects(async () => authService.rotateRefreshToken('invalid-token'), {
    message: 'Invalid refresh token'
  });
});

test('rotateRefreshToken should return new tokens for a valid refresh token', async () => {
  const oldRefreshToken = authService.generateToken({ userId: mockUser.id, role: mockUser.role }, '7d');
  mockUser.sessions = [{ refreshToken: oldRefreshToken }];

  const result = await authService.rotateRefreshToken(oldRefreshToken);
  assert.ok(result.accessToken, 'accessToken should exist');
  assert.ok(result.refreshToken, 'refreshToken should exist');
  assert.strictEqual(typeof result.accessToken, 'string');
  assert.strictEqual(typeof result.refreshToken, 'string');
  assert.strictEqual(result.refreshToken.split('.').length, 3, 'refreshToken should be a JWT');
});

test('logout should remove refresh token from active sessions', async () => {
  const refreshToken = authService.generateToken({ userId: mockUser.id, role: mockUser.role }, '7d');
  mockUser.sessions = [{ refreshToken }];

  let removedSessionArgs = null;
  mockUserRepository.removeSession = async (id, token) => {
    removedSessionArgs = { id, token };
    return { ...mockUser, sessions: [] };
  };

  const result = await authService.logout(refreshToken);

  assert.deepStrictEqual(removedSessionArgs, { id: mockUser.id, token: refreshToken });
  assert.deepStrictEqual(result.sessions, []);
});

test('logout should reject invalid or malformed refresh tokens', async () => {
  await assert.rejects(async () => authService.logout('not-a-valid-jwt'), {
    message: 'Invalid token'
  });
});
