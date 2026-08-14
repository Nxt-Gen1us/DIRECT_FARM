# DIRECT FARM Enterprise Backend Architecture

## Goals

- Design the complete backend before writing code.
- Support scalability, security, testability, and deployment readiness.

## Architecture Components

- Presentation Layer: Express routes and controllers.
- Application Layer: Services handling business rules.
- Domain Layer: Entities and validation boundaries.
- Infrastructure Layer: Repositories, database connectors, logging, and email/push providers.

## Patterns

- MVC: Controller receives request, delegates to service, returns response.
- Service Layer: Business logic is isolated from controllers.
- Repository Pattern: Data access is abstracted behind repository interfaces.
- Middleware: Cross-cutting concerns such as security, request parsing, logging, and error handling.
- API Versioning: `/api/v1` prefix for stable versioning.
- Environment Configuration: `.env` driven with typed access in `src/config`.

## Deployment Architecture

1. Client / Mobile App
2. API Gateway / NGINX
3. Express Backend
4. MongoDB Atlas
5. CDN / Cloudinary / Media Storage
6. Message broker / WebSocket Server (future)

## Security Strategy

- JWT authentication and refresh tokens
- Role-based access control
- Helmet for secure headers
- CORS allow-list per environment
- Sanitization and XSS protection
- Rate limiting and request validation
- Audit logging and activity stream

## Logging Strategy

- Structured logs using Winston
- Separate transports for console and file/log aggregation
- Request logging by Morgan
- Error stack capture in production

## Diagram

```
[Client] --> [NGINX/API Gateway] --> [Express API v1]
                                     |--> [MongoDB Atlas]
                                     |--> [Cloudinary / Object Storage]
                                     |--> [Email / SMS / Push]
                                     |--> [Socket.IO / Realtime]
```

## Environment Configuration

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `LOG_LEVEL`

## Milestone 1 / 2 Deliverables

- Project folder structure
- Clean architecture and MVC
- Service and repository foundations
- Middleware structure
- API versioning
- Global error handling
- Health check endpoint
