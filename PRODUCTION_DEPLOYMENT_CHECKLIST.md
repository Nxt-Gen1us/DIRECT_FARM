# DIRECT FARM Production Deployment Checklist

This checklist covers the final deployment requirements for a real production launch.

## 1. Required environment values

### Backend
Update BACKEND/.env with actual values:

- NODE_ENV=production
- PORT=5000
- MONGO_URI=<live MongoDB Atlas connection string>
- JWT_SECRET=<strong random secret>
- JWT_EXPIRES_IN=1d
- REFRESH_TOKEN_EXPIRES_IN=7d
- LOG_LEVEL=info
- CORS_ORIGIN=<frontend production URL>
- RAZORPAY_KEY_ID=<live Razorpay key>
- RAZORPAY_KEY_SECRET=<live Razorpay secret>

### Frontend
Update FRONTEND/.env with actual values:

- VITE_API_URL=<backend production API URL>
- VITE_WS_URL=<backend production websocket URL>
- VITE_RAZORPAY_KEY_ID=<live public Razorpay key>

Notes:
- The app now blocks production startup if these values are blank or still use placeholders.
- Do not leave localhost or example values in production.

## 2. Deployment validation

Before launch:

- Start the backend with production config
- Confirm MongoDB connection succeeds
- Confirm JWT auth works
- Confirm API calls hit the production backend, not localhost
- Confirm websocket URL matches the deployed backend
- Confirm CORS allows the final frontend domain
- Confirm Razorpay key IDs and secrets are valid

## 3. Live smoke test

Run a real production smoke test for:

- user register/login
- product listing
- checkout flow
- wallet top-up
- order create and payment verification
- webhook delivery to backend
- chat send/receive
- order tracking GPS share
- farmer/admin delivery updates

## 4. Security review

Check:

- no secret values committed to git
- no localhost values in production env
- proper CORS origins only
- helmet / security headers enabled if used by your hosting platform
- backend access control for farmer/admin routes remains enforced
- webhook signing is validated before any DB updates

## 5. Release gate

Do not deploy until all items above are valid in the real environment.

The application code is validated locally, but deployment must still be verified against live infrastructure and live payment credentials.
