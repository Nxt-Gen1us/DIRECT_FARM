export default {
  openapi: '3.0.1',
  info: {
    title: 'DIRECT FARM API',
    version: '1.0.0',
    description: 'Enterprise backend API for DIRECT FARM'
  },
  servers: [{ url: '/api/v1' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Address: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          street: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          postalCode: { type: 'string' },
          country: { type: 'string' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string' },
          isVerified: { type: 'boolean' },
          walletBalance: { type: 'number' },
          addresses: { type: 'array', items: { $ref: '#/components/schemas/Address' } },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          price: { type: 'number' },
          stock: { type: 'number' },
          farmer: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      OrderItem: {
        type: 'object',
        properties: {
          product: { type: 'string' },
          quantity: { type: 'number' },
          price: { type: 'number' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          customer: { type: 'string' },
          farmer: { type: 'string' },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
          status: { type: 'string' },
          subtotal: { type: 'number' },
          shippingFee: { type: 'number' },
          tax: { type: 'number' },
          total: { type: 'number' },
          deliveryAddress: { $ref: '#/components/schemas/Address' },
          invoiceUrl: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Payment: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          order: { type: 'string' },
          user: { type: 'string' },
          method: { type: 'string' },
          amount: { type: 'number' },
          status: { type: 'string' },
          transactionId: { type: 'string' },
          providerResponse: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      WalletTransaction: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['credit', 'debit'] },
          amount: { type: 'number' },
          reference: { type: 'string' },
          description: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Wallet: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          user: { type: 'string' },
          balance: { type: 'number' },
          currency: { type: 'string' },
          transactions: { type: 'array', items: { $ref: '#/components/schemas/WalletTransaction' } },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Session: {
        type: 'object',
        properties: {
          device: { type: 'string' },
          ip: { type: 'string' },
          userAgent: { type: 'string' },
          refreshToken: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          lastSeenAt: { type: 'string', format: 'date-time' }
        }
      },
      SuccessWalletResponse: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          data: { $ref: '#/components/schemas/Wallet' }
        }
      },
      SuccessWalletTransactionResponse: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          data: { $ref: '#/components/schemas/WalletTransaction' }
        }
      },
      SuccessSessionsResponse: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          data: { type: 'array', items: { $ref: '#/components/schemas/Session' } }
        }
      },
      SuccessEmptySessionsResponse: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          data: { type: 'array', items: { type: 'string' } }
        }
      },
      DeliveryEvent: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          location: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          recordedAt: { type: 'string', format: 'date-time' }
        }
      },
      DeliveryTracking: {
        type: 'object',
        properties: {
          order: { type: 'string' },
          courier: { type: 'string' },
          trackingNumber: { type: 'string' },
          currentStatus: { type: 'string' },
          estimatedDelivery: { type: 'string', format: 'date-time' },
          route: { type: 'array', items: { type: 'string' } },
          events: { type: 'array', items: { $ref: '#/components/schemas/DeliveryEvent' } },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          user: { $ref: '#/components/schemas/User' }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Service is healthy'
          }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['firstName', 'email', 'password']
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          }
        }
      }
    },
    '/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'User details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } }
          }
        }
      }
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products',
        responses: {
          '200': {
            description: 'Product list',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } }
              }
            }
          }
        }
      }
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Product details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } }
          }
        }
      }
    },
    '/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Create order',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  farmer: { type: 'string' },
                  items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
                  total: { type: 'number' }
                },
                required: ['farmer', 'items', 'total']
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } }
          }
        }
      }
    },
    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Order details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } }
          }
        }
      }
    },
    '/payments': {
      post: {
        tags: ['Payments'],
        summary: 'Create payment',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  order: { type: 'string' },
                  method: { type: 'string' },
                  amount: { type: 'number' },
                  status: { type: 'string' },
                  transactionId: { type: 'string' },
                  providerResponse: { type: 'object' }
                },
                required: ['order', 'method', 'amount']
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Payment created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Payment' } } }
          }
        }
      },
      get: {
        tags: ['Payments'],
        summary: 'List user payments',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Payment list',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Payment' } } } }
          }
        }
      }
    },
    '/payments/order/{orderId}': {
      get: {
        tags: ['Payments'],
        summary: 'Get payment by order ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Payment details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Payment' } } }
          }
        }
      }
    },
    '/wallet': {
      get: {
        tags: ['Wallet'],
        summary: 'Get current user wallet',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Wallet details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessWalletResponse' } } }
          }
        }
      }
    },
    '/wallet/transactions': {
      post: {
        tags: ['Wallet'],
        summary: 'Add wallet transaction',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['credit', 'debit'] },
                  amount: { type: 'number' },
                  reference: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['type', 'amount']
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Transaction added',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessWalletTransactionResponse' } } }
          }
        }
      }
    },
    '/sessions': {
      get: {
        tags: ['Sessions'],
        summary: 'List active sessions',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Active sessions',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessSessionsResponse' } } }
          }
        }
      }
    },
    '/sessions/revoke': {
      post: {
        tags: ['Sessions'],
        summary: 'Revoke a refresh token (single device)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' }
                },
                required: ['refreshToken']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Session revoked',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessSessionsResponse' } } }
          }
        }
      }
    },
    '/sessions/revoke-all': {
      post: {
        tags: ['Sessions'],
        summary: 'Revoke all sessions for current user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'All sessions revoked'
          }
        }
      }
    },
    '/delivery/{orderId}': {
      get: {
        tags: ['Delivery'],
        summary: 'Get delivery tracking for order',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Delivery tracking details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/DeliveryTracking' } } }
          }
        }
      },
      patch: {
        tags: ['Delivery'],
        summary: 'Update delivery tracking',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  courier: { type: 'string' },
                  trackingNumber: { type: 'string' },
                  estimatedDelivery: { type: 'string', format: 'date-time' },
                  currentStatus: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Delivery updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/DeliveryTracking' } } }
          }
        }
      }
    },
    '/delivery/{orderId}/events': {
      post: {
        tags: ['Delivery'],
        summary: 'Add delivery event to order tracking',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DeliveryEvent' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Event added',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/DeliveryTracking' } } }
          }
        }
      }
    },
    '/auth/verify-email': {
      post: { tags: ['Auth'], summary: 'Verify email token', responses: { '200': { description: 'OK' } } }
    },
    '/auth/forgot-password': {
      post: { tags: ['Auth'], summary: 'Request password reset', responses: { '200': { description: 'OK' } } }
    },
    '/auth/reset-password': {
      post: { tags: ['Auth'], summary: 'Reset password', responses: { '200': { description: 'OK' } } }
    },
    '/auth/send-otp': {
      post: { tags: ['Auth'], summary: 'Send OTP', responses: { '200': { description: 'OK' } } }
    },
    '/auth/verify-otp': {
      post: { tags: ['Auth'], summary: 'Verify OTP', responses: { '200': { description: 'OK' } } }
    },
    '/auth/logout': {
      post: { tags: ['Auth'], summary: 'Logout (revoke refresh token)', responses: { '200': { description: 'OK' } } }
    },
    '/token/refresh': {
      post: { tags: ['Auth'], summary: 'Rotate refresh token and return new tokens', responses: { '200': { description: 'OK' } } }
    }
  }
};
