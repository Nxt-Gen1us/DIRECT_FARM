# CI/CD Checklist

This checklist helps keep the DIRECT FARM backend production-ready.

## Pipeline

- [x] Use GitHub Actions for automated CI on `main`/`master`
- [x] Run `npm ci` to install dependencies cleanly
- [x] Run `npm run audit` to catch known dependency vulnerabilities
- [x] Run `npm run lint` to enforce code quality and consistency
- [x] Run `npm test` to validate auth flows and core behavior

## Quality

- [x] Add linting and static analysis
- [x] Add security scanning (npm audit, dependency checks)
- [x] Add smoke tests for health endpoint `/api/v1/health`

## Deployment

- [ ] Configure environment-specific `.env` values for staging/production
- [ ] Use a managed MongoDB instance with proper network rules
- [ ] Ensure JWT secret and refresh token secret are stored securely
- [ ] Enable HTTPS and reverse proxy when deploying

## Documentation

- [x] Maintain API docs in `src/docs/swagger.js`
- [x] Keep examples in `src/docs/swagger-readme.md`
- [x] Update `README.md` with startup and API details
