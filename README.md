# DIRECT FARM Backend

[![CI](https://github.com/Nxt-Gen1us/DIRECT_FARM/actions/workflows/ci.yml/badge.svg)](https://github.com/Nxt-Gen1us/DIRECT_FARM/actions/workflows/ci.yml)

Enterprise backend starter for DIRECT FARM.

## Architecture Overview

- Clean Architecture with layered responsibilities
- MVC pattern for request flow
- Service layer for business rules
- Repository layer for persistence
- Centralized middleware for security and error handling
- API versioning under `/api/v1`

## Folder Structure

- `src/server.js` - application bootstrap
- `src/app.js` - express application and middleware
- `src/config` - environment and database configuration
- `src/routes` - route definitions and API versioning
- `src/controllers` - request handlers
- `src/services` - business logic layer
- `src/repositories` - data access layer
- `src/middlewares` - global middleware and error handling
- `src/utils` - shared utilities like logging

## Getting Started

1. Copy `.env.example` to `.env`
2. Set `MONGO_URI` and secrets
3. Install dependencies: `npm install`
4. Run lint: `npm run lint`
5. Run tests: `npm test`
6. Run security audit: `npm run audit`
7. Run in development: `npm run dev`

## GitHub Push

The repository is configured with origin:

```bash
git remote -v
```

Use the current branch and push to GitHub:

```bash
git push -u origin HEAD
```

## Test Coverage

The repository includes unit and smoke tests for core authentication and health checks:

- `test/auth.service.test.js`: auth flow coverage for login, registration validation, and refresh token rotation
- `test/health.test.js`: smoke test for `GET /api/v1/health`

Run tests with `npm test` to verify auth and health behavior.

## Atlas Startup

If Atlas SRV DNS lookups fail in your environment, use a direct host connection string in `.env`:

```env
MONGO_URI=mongodb://<user>:<password>@ac-izuey15-shard-00-00.m70pmio.mongodb.net:27017,ac-izuey15-shard-00-01.m70pmio.mongodb.net:27017,ac-izuey15-shard-00-02.m70pmio.mongodb.net:27017/?replicaSet=atlas-9nbjnn-shard-0&authSource=admin&ssl=true
```

Then start the app normally:

```bash
npm run dev
```

## API Docs

- Swagger UI: `http://localhost:5000/api-docs`
- API base path: `/api/v1`
- Payment endpoints: `/api/v1/payments`
- Wallet endpoints: `/api/v1/wallet` and `/api/v1/wallet/transactions`
- Session endpoints: `/api/v1/sessions`, `/api/v1/sessions/revoke`, `/api/v1/sessions/revoke-all`
- Auth session endpoints: `/api/v1/token/refresh` and `/api/v1/auth/logout`
- Delivery endpoints: `/api/v1/delivery/{orderId}`
- API examples: `src/docs/swagger-readme.md`
- Test coverage notes: `test/auth.service.test.js`, `test/health.test.js`, and `test/token.controller.test.js` validate auth flows, refresh token rotation, and health endpoint behavior.

## Health Check

- `GET /api/v1/health` returns application status and environment details.
