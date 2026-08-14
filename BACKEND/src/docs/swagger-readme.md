# Swagger API Examples

This file documents example requests and responses for the payment and delivery endpoints exposed by the DIRECT FARM backend.

## Payments

### Create Payment

- Endpoint: `POST /api/v1/payments`
- Auth: Bearer JWT required
- Request body:

```json
{
  "order": "60d21b4667d0d8992e610c85",
  "method": "razorpay",
  "amount": 1500,
  "status": "pending",
  "transactionId": "txn_12345",
  "providerResponse": {
    "provider": "razorpay",
    "status": "created"
  }
}
```

- Example response:

```json
{
  "id": "60d21b8767d0d8992e610c90",
  "order": "60d21b4667d0d8992e610c85",
  "user": "60d21b3567d0d8992e610c70",
  "method": "razorpay",
  "amount": 1500,
  "status": "pending",
  "transactionId": "txn_12345",
  "providerResponse": {
    "provider": "razorpay",
    "status": "created"
  },
  "createdAt": "2026-07-20T16:00:00.000Z"
}
```

### List User Payments

- Endpoint: `GET /api/v1/payments`
- Auth: Bearer JWT required
- Example response:

```json
[
  {
    "id": "60d21b8767d0d8992e610c90",
    "order": "60d21b4667d0d8992e610c85",
    "user": "60d21b3567d0d8992e610c70",
    "method": "razorpay",
    "amount": 1500,
    "status": "pending",
    "transactionId": "txn_12345",
    "providerResponse": {
      "provider": "razorpay",
      "status": "created"
    },
    "createdAt": "2026-07-20T16:00:00.000Z"
  }
]
```

### Get Payment by Order

- Endpoint: `GET /api/v1/payments/order/{orderId}`
- Auth: Bearer JWT required
- Example response: same as payment object above

## Delivery Tracking

### Get Delivery Tracking

- Endpoint: `GET /api/v1/delivery/{orderId}`
- Auth: Bearer JWT required
- Example response:

```json
{
  "order": "60d21b4667d0d8992e610c85",
  "courier": "FastFarm Express",
  "trackingNumber": "TRACK12345",
  "currentStatus": "in_transit",
  "estimatedDelivery": "2026-07-24T12:00:00.000Z",
  "route": ["Farm Hub", "Regional Depot", "City Center"],
  "events": [
    {
      "status": "picked",
      "location": "Farm Hub",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "recordedAt": "2026-07-20T10:00:00.000Z"
    },
    {
      "status": "in_transit",
      "location": "Regional Depot",
      "latitude": 13.0827,
      "longitude": 80.2707,
      "recordedAt": "2026-07-21T08:30:00.000Z"
    }
  ],
  "createdAt": "2026-07-20T09:30:00.000Z"
}
```

### Update Delivery Tracking

- Endpoint: `PATCH /api/v1/delivery/{orderId}`
- Auth: Bearer JWT required
- Request body:

```json
{
  "courier": "Faster Farm Logistics",
  "trackingNumber": "TRACK12345",
  "currentStatus": "delivered",
  "estimatedDelivery": "2026-07-24T12:00:00.000Z"
}
```

- Example response: updated delivery tracking object

### Add Delivery Event

- Endpoint: `POST /api/v1/delivery/{orderId}/events`
- Auth: Bearer JWT required
- Request body:

```json
{
  "status": "delivered",
  "location": "Customer Address",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "recordedAt": "2026-07-24T11:45:00.000Z"
}
```

- Example response: delivery tracking object with newly appended event

## Wallet

### Get Wallet

- Endpoint: `GET /api/v1/wallet`
- Auth: Bearer JWT required
- Example response:

```json
{
  "status": "success",
  "data": {
    "id": "60d21b8767d0d8992e610c91",
    "user": "60d21b3567d0d8992e610c70",
    "balance": 5000,
    "currency": "NGN",
    "transactions": [
      {
        "type": "credit",
        "amount": 5000,
        "reference": "wallet_topup_001",
        "description": "Initial wallet funding",
        "createdAt": "2026-07-20T16:05:00.000Z"
      }
    ],
    "updatedAt": "2026-07-20T16:05:00.000Z"
  }
}
```

### Add Wallet Transaction

- Endpoint: `POST /api/v1/wallet/transactions`
- Auth: Bearer JWT required
- Request body:

```json
{
  "type": "debit",
  "amount": 1200,
  "reference": "order_payment_123",
  "description": "Payment for order #123"
}
```

- Example response:

```json
{
  "status": "success",
  "data": {
    "type": "debit",
    "amount": 1200,
    "reference": "order_payment_123",
    "description": "Payment for order #123",
    "createdAt": "2026-07-20T16:10:00.000Z"
  }
}
```

## Sessions

### List Sessions

- Endpoint: `GET /api/v1/sessions`
- Auth: Bearer JWT required
- Example response:

```json
{
  "status": "success",
  "data": [
    {
      "device": "Chrome on Windows",
      "ip": "203.0.113.10",
      "userAgent": "Mozilla/5.0 ...",
      "refreshToken": "refresh_token_example",
      "createdAt": "2026-07-20T15:45:00.000Z",
      "lastSeenAt": "2026-07-20T16:00:00.000Z"
    }
  ]
}
```

### Revoke Session

- Endpoint: `POST /api/v1/sessions/revoke`
- Auth: Bearer JWT required
- Request body:

```json
{
  "refreshToken": "refresh_token_example"
}
```

- Example response:

```json
{
  "status": "success",
  "data": []
}
```

### Revoke All Sessions

- Endpoint: `POST /api/v1/sessions/revoke-all`
- Auth: Bearer JWT required
- Example response:

```json
{
  "status": "success",
  "data": []
}
```

## Auth Token Examples

### Rotate Refresh Token

- Endpoint: `POST /api/v1/token/refresh`
- Request body:

```json
{
  "refreshToken": "existing_refresh_token_value"
}
```

- Example response:

```json
{
  "accessToken": "new_access_token_value",
  "refreshToken": "new_refresh_token_value",
  "user": {
    "id": "60d21b3567d0d8992e610c70",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "role": "customer",
    "isVerified": true,
    "walletBalance": 3200,
    "addresses": [],
    "createdAt": "2026-07-20T15:35:00.000Z"
  }
}
```

### Logout and Revoke Refresh Token

- Endpoint: `POST /api/v1/auth/logout`
- Request body:

```json
{
  "refreshToken": "existing_refresh_token_value"
}
```

- Example response:

```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```
```