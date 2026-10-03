# 🌾 DIRECT FARM - Farm-to-Consumer Marketplace

A comprehensive full-stack platform connecting farmers directly with consumers, featuring real-time order tracking, AI predictions, and integrated payments.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![React](https://img.shields.io/badge/react-19.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### For Customers
- 🛒 Browse fresh farm products with advanced filtering
- 💳 Secure checkout with Razorpay integration & COD
- 📦 Real-time order tracking with live GPS updates
- 💬 Direct chat with farmers
- ⭐ Rate and review products
- 📱 Responsive design for all devices

### For Farmers
- 📊 Product inventory management
- 📈 Order fulfillment dashboard
- 🚚 Delivery tracking with GPS broadcasting
- 💰 Wallet system for earnings
- 🌱 Harvest timeline management
- 🤖 AI-powered predictions (disease, pricing, demand)

### For Admins
- 👥 User management dashboard
- ✅ Farmer verification system
- 📊 Analytics & KPI tracking
- 🎯 Platform monitoring tools

---

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT with refresh tokens
- **Real-time:** Socket.IO
- **Validation:** Joi
- **Security:** Helmet, CORS, bcrypt, express-mongo-sanitize

### Frontend
- **Framework:** React 19
- **Language:** TypeScript
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS 4
- **Maps:** Leaflet with React-Leaflet
- **Charts:** Recharts
- **Animation:** Framer Motion
- **i18n:** i18next
- **Real-time:** Socket.IO Client

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ ([Download](https://nodejs.org/))
- npm v9+
- Git

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd DIRECT_FARM
```

### 2. Automated Setup (Recommended)
```powershell
# Run setup script (installs dependencies & seeds database)
.\setup.ps1

# Start both servers
.\run.ps1
```

### 3. Manual Setup
```powershell
# Install dependencies
cd BACKEND
npm install

cd ..\FRONTEND
npm install

# Seed database
cd ..\BACKEND
npm run seed

# Start backend (Terminal 1)
npm run dev

# Start frontend (Terminal 2)
cd ..\FRONTEND
npm run dev
```

### 4. Access Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api-docs

### 5. Login
- **Admin:** admin@directfarm.com / Admin@123
- **Or register a new account**

📖 **Full Setup Guide:** See [QUICKSTART.md](QUICKSTART.md) or [SETUP_AND_RUN.md](SETUP_AND_RUN.md)

---

## 📁 Project Structure

```
DIRECT_FARM/
├── BACKEND/                 # Node.js Express Backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── models/         # MongoDB models
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── socket/         # Socket.IO handlers
│   │   ├── validators/     # Joi validation schemas
│   │   ├── app.js          # Express app setup
│   │   ├── server.js       # Server entry point
│   │   └── seed.js         # Database seeding
│   ├── .env                # Environment variables
│   └── package.json
│
├── FRONTEND/               # React TypeScript Frontend
│   ├── src/
│   │   ├── app/
│   │   │   └── providers/  # Context providers
│   │   ├── components/     # Reusable components
│   │   ├── data/           # Mock/demo data
│   │   ├── lib/
│   │   │   ├── api/        # API client
│   │   │   └── realtime/   # Socket.IO clients
│   │   ├── pages/          # Route pages
│   │   ├── styles/         # Global styles
│   │   └── main.tsx        # App entry point
│   ├── .env                # Environment variables
│   └── package.json
│
├── setup.ps1               # Automated setup script
├── run.ps1                 # Server startup script
├── QUICKSTART.md           # 5-minute quick start
├── SETUP_AND_RUN.md        # Detailed setup guide
├── COMPLETION_SUMMARY.md   # Integration completion docs
└── README.md               # This file
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/register      - Register new user
POST   /api/v1/auth/login         - Login
POST   /api/v1/auth/logout        - Logout
POST   /api/v1/token/refresh      - Refresh access token
```

### Products
```
GET    /api/v1/products           - List products (public)
GET    /api/v1/products/:id       - Get product details
POST   /api/v1/products           - Create product (farmer)
PATCH  /api/v1/products/:id       - Update product (farmer)
DELETE /api/v1/products/:id       - Delete product (farmer)
```

### Orders
```
GET    /api/v1/orders             - List user orders
GET    /api/v1/orders/:id         - Get order details
POST   /api/v1/orders             - Create order
PATCH  /api/v1/orders/:id/cancel  - Cancel order
```

### Farmers
```
GET    /api/v1/farmers            - List farmers (public)
GET    /api/v1/farmers/:id        - Get farmer profile (public)
GET    /api/v1/farmers/profile    - Get own profile (farmer)
POST   /api/v1/farmers/profile    - Create profile (farmer)
PATCH  /api/v1/farmers/profile    - Update profile (farmer)
```

### AI Predictions
```
POST   /api/v1/ai-predictions                - Create prediction
GET    /api/v1/ai-predictions/my-predictions - User predictions
GET    /api/v1/ai-predictions/farmer/:id     - Farmer predictions
GET    /api/v1/ai-predictions/product/:id    - Product predictions
```

### Harvest Timeline
```
GET    /api/v1/harvest-timeline/upcoming     - Upcoming harvests (public)
GET    /api/v1/harvest-timeline/farmer/:id   - Farmer timelines (public)
POST   /api/v1/harvest-timeline              - Create timeline (farmer)
PATCH  /api/v1/harvest-timeline/:id          - Update timeline (farmer)
POST   /api/v1/harvest-timeline/:id/events   - Add event (farmer)
```

### Delivery Tracking
```
GET    /api/v1/delivery/:orderId              - Get tracking
PATCH  /api/v1/delivery/:orderId              - Update tracking (farmer/admin)
POST   /api/v1/delivery/:orderId/events       - Add tracking event (farmer/admin)
```

**Full API Documentation:** http://localhost:5000/api-docs (after starting backend)

---

## 🔌 Socket.IO Events

### Chat Events
```javascript
// Client → Server
socket.emit('thread:join', { threadId })
socket.emit('thread:leave', { threadId })
socket.emit('typing:start', { threadId })
socket.emit('typing:stop', { threadId })
socket.emit('message:send', { localId, receiverId, threadId, text })

// Server → Client
socket.on('typing', { threadId, from, typing })
socket.on('message:ack', { localId, serverId, threadId, status })
socket.on('message:new', { id, threadId, senderId, from, kind, text, at, status })
```

### Delivery Tracking Events
```javascript
// Client → Server
socket.emit('delivery:subscribe', { orderId })
socket.emit('delivery:unsubscribe', { orderId })
socket.emit('delivery:gps', { orderId, latitude, longitude, accuracy, timestamp })
socket.emit('delivery:status', { orderId, status, location, message })

// Server → Client
socket.on('delivery:location', { orderId, location, updatedBy })
socket.on('delivery:update', { orderId, status, location, message, timestamp, updatedBy })
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://...
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173

# Optional
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_WS_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=
```

---

## 🧪 Testing

### Backend Tests
```powershell
cd BACKEND
npm test
```

### Frontend Build
```powershell
cd FRONTEND
npm run build
npm run preview
```

---

## 📊 Database Schema

### Collections
- **users** - User accounts (customer, farmer, admin)
- **farmerProfiles** - Farmer profile details
- **products** - Product listings
- **orders** - Customer orders
- **payments** - Payment records
- **deliveryTracking** - Delivery status & GPS
- **messages** - Chat messages
- **notifications** - User notifications
- **reviews** - Product reviews
- **wallets** - User wallet balances
- **walletTopups** - Wallet top-up records
- **aiPredictions** - AI prediction history
- **harvestTimelines** - Crop harvest timelines

---

## 🚢 Deployment

### Backend Deployment Options
- **Railway** (recommended) - https://railway.app
- **Render** - https://render.com
- **DigitalOcean App Platform**
- **AWS/GCP/Azure**

### Frontend Deployment Options
- **Vercel** (recommended) - https://vercel.com
- **Netlify** - https://netlify.com
- **Cloudflare Pages**

### Database
- **MongoDB Atlas** (already configured)

📖 **Deployment Guide:** See deployment section in [SETUP_AND_RUN.md](SETUP_AND_RUN.md)

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Issues
- Check internet connection
- Verify MongoDB Atlas IP whitelist
- Confirm credentials in `.env`

### Module Not Found
```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
```

📖 **Full Troubleshooting:** See [SETUP_AND_RUN.md](SETUP_AND_RUN.md)

---

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Get started in 5 minutes
- [SETUP_AND_RUN.md](SETUP_AND_RUN.md) - Detailed setup guide
- [COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md) - Integration completion status
- [task.md](c:\Users\user\Downloads\Task) - Development task tracker

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

**DIRECT FARM Team**

---

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Razorpay for payment integration
- OpenStreetMap for mapping data
- All open-source contributors

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check documentation files
- Review troubleshooting section

---

**Built with ❤️ for farmers and consumers**

🌾 **Happy Farming!**
