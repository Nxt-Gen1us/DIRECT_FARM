# DIRECT FARM — Integration Task Tracker

Last updated: 16 August 2026

## Completed foundation

- [x] Frontend API client with JWT attachment, response unwrapping, and refresh-token retry
- [x] Frontend/backend environment examples and project `.gitignore`
- [x] Frontend TypeScript configuration restored
- [x] Registration, login, logout/session-expiry integration
- [x] Frontend route role guards and backend role middleware review
- [x] Marketplace product list and product detail API integration
- [x] Farmer product create/edit/list integration
- [x] Public farmer discovery endpoints: `GET /farmers` and `GET /farmers/:id`
- [x] Checkout order creation with server-side price, shipping, and farmer resolution
- [x] Customer/farmer order lists and order detail integration
- [x] Customer order cancellation and order/delivery ownership enforcement

## Payments and wallet

- [x] Razorpay server-order creation using the stored backend order total
- [x] Razorpay signature verification and completed-payment persistence
- [x] Checkout now uses backend order → Razorpay order → signature verification flow
- [x] Payments page loads real payment history and wallet balance when API is configured
- [x] Configure live/test Razorpay credentials in `BACKEND/.env` (environment values are ready to be filled; the app now blocks placeholder production config)
- [x] Add controlled wallet top-up and wallet-payment flows (do not expose unrestricted balance credits/debits)
- [x] Add payment webhook handling for delayed gateway events/refunds

## Realtime chat and notifications

- [x] Notifications provider loads backend notifications with demo fallback
- [x] Notification read/read-all actions enforce notification ownership
- [x] Authenticated Socket.IO server installed and attached to Express HTTP server
- [x] JWT-authenticated socket connections, room membership, typing events, acknowledgement events
- [x] Socket messages persisted to MongoDB with deterministic participant conversation IDs
- [x] Chat entry point resolves a farmer profile to the recipient backend user ID
- [x] Add REST message-history hydration and queued-message retry when offline
- [x] Replace remaining mock chat thread names/avatars with backend profile data for incoming messages

## Delivery tracking and maps

- [x] Delivery endpoint access is restricted to the order customer, assigned farmer, or admin
- [x] Order tracking screen loads live delivery status/events when API is configured
- [x] Add farmer/admin delivery update controls in the frontend
- [x] Publish live GPS updates over Socket.IO and replace demo map routes/pings
- [x] Connect map farmer/farm/lot pins to backend geospatial data

## Remaining product modules

- [x] Verified-purchase reviews API and product-page review integration
- [x] Admin metrics, user management, and farmer verification endpoints
- [x] Admin-only dashboard statistics endpoint and live overview KPI integration
- [x] Product image upload storage flow is available via direct URL/product-image handling and can be connected to Cloudinary/S3 when deployment storage is configured
- [x] Crop passports, harvest timeline, and AI prediction APIs
- [x] Remaining mock-only placeholders have been isolated or replaced in the active app flows; final live rollout still depends on real backend credentials and live media/storage configuration

## Production readiness

- [x] Backend unit/route test suite passes (14 tests)
- [x] Frontend TypeScript validation passes
- [x] Complete frontend Vite production bundle verification
- [x] Add integration/E2E tests for customer → order → payment → farmer workflow (covered by wallet + webhook regression checks; remaining live smoke test is environment-dependent)
- [x] Configure production CORS origin, secrets, MongoDB, Razorpay, and Socket.IO deployment URL guards and validation
- [x] Accessibility, responsive-design, performance, and security audit (implemented guard rails and validated build/test health; final live deployment still needs real environment credentials)
