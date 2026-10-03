# 🚀 DIRECT FARM - Complete Setup & Run Guide

This guide will help you set up and run the DIRECT FARM project from scratch.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18+ ([Download here](https://nodejs.org/))
- **npm** v9+ (comes with Node.js)
- **Git** ([Download here](https://git-scm.com/))
- **MongoDB** - Already configured via Atlas in `.env`

### Verify Installation

```powershell
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
git --version     # Should show git version
```

---

## 🔧 Step 1: Install Dependencies

### Backend Setup

```powershell
# Navigate to backend directory
cd BACKEND

# Install all dependencies
npm install

# This installs:
# - Express, MongoDB, Socket.IO
# - Authentication (JWT, bcrypt)
# - Validation (Joi)
# - Security (helmet, cors, mongo-sanitize)
# - Utilities (morgan, winston)
```

### Frontend Setup

```powershell
# Navigate to frontend directory (from root)
cd ..\FRONTEND

# Install all dependencies
npm install

# This installs:
# - React 19, React Router
# - Tailwind CSS, Framer Motion
# - Leaflet (maps), Recharts (analytics)
# - Socket.IO client, i18next (translations)
```

---

## 🗄️ Step 2: Database Setup & Seeding

Your MongoDB Atlas connection is already configured. Now let's seed initial data:

```powershell
# Go to backend directory
cd ..\BACKEND

# Seed the database with sample data
npm run seed

# This creates:
# ✓ Admin user (admin@directfarm.com / Admin@123)
# ✓ Sample farmers
# ✓ Sample products
# ✓ Sample orders
# ✓ Sample AI predictions
# ✓ Sample harvest timelines
```

**Seed Success Output:**
```
✓ Connected to MongoDB
✓ Database cleared
✓ Admin user created
✓ Sample users created
✓ Farmer profiles created
✓ Products created
✓ Orders created
✓ Reviews created
✓ AI Predictions created
✓ Harvest Timelines created
✓ Seed completed successfully!
```

---

## ⚙️ Step 3: Verify Environment Variables

### Backend (.env) - Already configured ✓

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://... (your Atlas connection)
JWT_SECRET=direct_farm_super_secret_key_change_in_production
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env) - Already configured ✓

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_WS_URL=http://localhost:5000
```

---

## 🚀 Step 4: Start the Application

You have two options:

### Option A: Run Both Servers in Separate Terminals (Recommended)

**Terminal 1 - Backend Server:**
```powershell
cd BACKEND
npm run dev

# Expected output:
# [nodemon] starting `node src/server.js`
# Server running on port 5000
# MongoDB Connected: ac-izuey15-shard-00-00.m70pmio.mongodb.net
# Socket.IO server initialized
```

**Terminal 2 - Frontend Server:**
```powershell
cd FRONTEND
npm run dev

# Expected output:
# VITE v7.3.1  ready in 1234 ms
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
# ➜  press h + enter to show help
```

### Option B: Run with Single Command (Background)

```powershell
# From root directory, start backend in background
cd BACKEND
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

# Wait 3 seconds for backend to start
Start-Sleep -Seconds 3

# Start frontend in background
cd ..\FRONTEND
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
```

---

## 🌐 Step 5: Access the Application

Once both servers are running:

### Frontend Application
**URL:** http://localhost:5173

**Test Accounts:**

1. **Admin Account**
   - Email: `admin@directfarm.com`
   - Password: `Admin@123`
   - Access: Admin dashboard, farmer verification

2. **Farmer Account** (created during seed)
   - Email: `farmer1@directfarm.com` (or check seed output)
   - Password: `Farmer@123`
   - Access: Product management, order fulfillment, delivery tracking

3. **Customer Account**
   - Register a new account at http://localhost:5173/register
   - Or use any seeded customer account

### Backend API
**URL:** http://localhost:5000

**API Documentation (Swagger):**
http://localhost:5000/api-docs

**Health Check:**
http://localhost:5000/api/v1/health

Expected response:
```json
{
  "status": "success",
  "message": "Server is healthy",
  "timestamp": "2026-08-16T..."
}
```

---

## ✅ Step 6: Verify Everything Works

### Test Checklist

#### 1. **Backend Health**
```powershell
# Check if backend is responding
curl http://localhost:5000/api/v1/health
```

#### 2. **Database Connection**
- Backend console should show: `MongoDB Connected`
- No connection errors in terminal

#### 3. **Socket.IO**
- Backend console should show: `Socket.IO server initialized`
- Frontend should connect automatically (check browser console)

#### 4. **Frontend Loading**
- Navigate to http://localhost:5173
- Should see DIRECT FARM homepage
- No errors in browser console (F12)

#### 5. **Login Test**
- Go to http://localhost:5173/login
- Login with `admin@directfarm.com` / `Admin@123`
- Should redirect to dashboard

#### 6. **API Integration Test**
- Click on "Market" in navigation
- Products should load from backend
- Check Network tab (F12) - should see API calls to `localhost:5000`

#### 7. **Real-time Features Test**
- Login as customer
- Go to Chat section
- Should see Socket.IO connection indicator (green dot)

---

## 🎯 Quick Feature Tour

### For Customers:

1. **Browse Products**
   - http://localhost:5173/market
   - Search, filter by category
   - Click product for details

2. **Place Order**
   - Add products to cart
   - Proceed to checkout
   - Fill shipping address
   - Choose payment (COD or Razorpay)

3. **Track Order**
   - Go to "My Orders"
   - Click on order
   - View tracking page with live updates

4. **Chat with Farmer**
   - From product page, click "Contact Farmer"
   - Real-time messaging

### For Farmers:

1. **Login as Farmer**
   - Email: Check seed output or create farmer account
   - Go to Farmer Dashboard

2. **Manage Products**
   - Add new products
   - Edit existing products
   - Set prices, quantities

3. **Fulfill Orders**
   - View incoming orders
   - Update delivery status
   - Broadcast GPS location (live tracking)

4. **Harvest Timeline**
   - Create crop planting records
   - Add growth stage events
   - Set harvest dates

### For Admins:

1. **Login as Admin**
   - Email: `admin@directfarm.com`
   - Password: `Admin@123`

2. **Verify Farmers**
   - Admin > Verify Farmers
   - Approve/Reject pending applications

3. **View Analytics**
   - Admin Dashboard
   - GMV, order stats, user metrics
   - Category distribution charts

4. **Manage Users**
   - View all users
   - Filter by role
   - Search functionality

---

## 🐛 Troubleshooting

### Backend Issues

#### Port Already in Use
```powershell
# Error: Port 5000 is already in use
# Solution: Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in BACKEND/.env
PORT=5001
```

#### MongoDB Connection Failed
```powershell
# Error: MongoNetworkError
# Solutions:
# 1. Check internet connection
# 2. Verify MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)
# 3. Check credentials in .env file
# 4. Verify MongoDB Atlas cluster is running
```

#### Module Not Found
```powershell
# Error: Cannot find module 'express'
# Solution: Reinstall dependencies
cd BACKEND
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Frontend Issues

#### Port 5173 Already in Use
```powershell
# Solution: Kill process or Vite will auto-assign new port
# Vite will prompt: "Port 5173 is in use, use 5174 instead?"
# Press 'y' to accept
```

#### API Connection Failed
```powershell
# Error: Network Error / API not responding
# Solutions:
# 1. Ensure backend is running on port 5000
# 2. Check VITE_API_URL in FRONTEND/.env
# 3. Verify CORS_ORIGIN in BACKEND/.env matches frontend URL
# 4. Clear browser cache and reload
```

#### Build Errors
```powershell
# Error: TypeScript errors
# Solution: Clean and rebuild
cd FRONTEND
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev
```

#### Socket.IO Not Connecting
```powershell
# Check browser console for errors
# Verify:
# 1. VITE_WS_URL in FRONTEND/.env is correct
# 2. Backend Socket.IO initialized (check backend logs)
# 3. No CORS errors in browser console
# 4. User is logged in (Socket.IO requires JWT token)
```

---

## 📦 Additional Setup (Optional)

### Enable Razorpay Payments

1. **Create Razorpay Account**
   - Go to https://dashboard.razorpay.com
   - Sign up for test account

2. **Get API Keys**
   - Dashboard > Settings > API Keys
   - Copy Key ID and Key Secret

3. **Update Environment Variables**

**BACKEND/.env:**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

**FRONTEND/.env:**
```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
```

4. **Test Payment Flow**
   - Restart both servers
   - Place order and select "Pay Online"
   - Use Razorpay test cards

### Enable Email Notifications

**BACKEND/.env:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Note:** For Gmail, enable 2FA and create App Password

---

## 🔍 Verify Installation Completeness

Run this checklist:

```powershell
# Backend checks
cd BACKEND
npm list express    # Should show express version
npm list mongoose   # Should show mongoose version
npm list socket.io  # Should show socket.io version

# Frontend checks
cd ..\FRONTEND
npm list react      # Should show react version
npm list vite       # Should show vite version
```

---

## 📊 Monitor Application

### Backend Logs
Watch the backend terminal for:
- `✓ MongoDB Connected`
- `✓ Socket.IO server initialized`
- `Server running on port 5000`
- API request logs (via Morgan)

### Frontend Logs
Open browser console (F12) to see:
- React component rendering
- API requests (Network tab)
- Socket.IO connection status
- Any errors or warnings

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Backend server shows "Server running on port 5000"  
✅ Frontend shows "Local: http://localhost:5173/"  
✅ Can access homepage at http://localhost:5173  
✅ Can login with admin credentials  
✅ Products load on marketplace page  
✅ Socket.IO shows "connected" in browser console  
✅ API calls succeed (check Network tab)  
✅ No errors in backend or frontend terminals  

---

## 📝 Next Steps After Setup

1. **Explore Features**
   - Try all user roles (customer, farmer, admin)
   - Test order flow end-to-end
   - Chat with farmers
   - Track deliveries

2. **Customize**
   - Add your own products
   - Update farmer profiles
   - Customize branding

3. **Development**
   - Make code changes
   - Changes auto-reload (hot reload enabled)
   - Test your modifications

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the Troubleshooting section above
2. Verify all prerequisites are installed
3. Check environment variables are correct
4. Review terminal logs for error messages
5. Check browser console for frontend errors

---

## 🔄 Restart Application

To restart after making changes:

```powershell
# Stop servers (Ctrl+C in each terminal)

# Backend
cd BACKEND
npm run dev

# Frontend (new terminal)
cd FRONTEND
npm run dev
```

---

**Happy Farming! 🌾**
