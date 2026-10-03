# 🚀 DIRECT FARM - Quick Start (5 Minutes)

Get up and running in 5 minutes!

---

## Option 1: Automated Setup (Easiest) ⚡

### Step 1: Run Setup Script
```powershell
# Open PowerShell in project root directory
.\setup.ps1
```

This will:
- ✅ Check Node.js installation
- ✅ Install all dependencies (backend & frontend)
- ✅ Verify environment files
- ✅ Seed database with sample data

### Step 2: Run Both Servers
```powershell
.\run.ps1
```

This will:
- ✅ Start backend server (port 5000)
- ✅ Start frontend server (port 5173)
- ✅ Open browser automatically

**Done! 🎉**

---

## Option 2: Manual Setup (Step by Step) 📝

### Step 1: Install Dependencies

**Backend:**
```powershell
cd BACKEND
npm install
```

**Frontend:**
```powershell
cd ..\FRONTEND
npm install
```

### Step 2: Seed Database

```powershell
cd ..\BACKEND
npm run seed
```

### Step 3: Start Servers

**Terminal 1 - Backend:**
```powershell
cd BACKEND
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd FRONTEND
npm run dev
```

**Done! 🎉**

---

## Access Application

### URLs
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api-docs

### Test Accounts

**Admin Account:**
- Email: `admin@directfarm.com`
- Password: `Admin@123`

**Customer Account:**
- Register new account or use seeded users

---

## Verify It's Working ✅

1. **Backend Running:**
   - Terminal shows: `Server running on port 5000`
   - Visit: http://localhost:5000/api/v1/health
   - Should return: `{"status":"success","message":"Server is healthy"}`

2. **Frontend Running:**
   - Terminal shows: `Local: http://localhost:5173/`
   - Visit: http://localhost:5173
   - Should see DIRECT FARM homepage

3. **Database Connected:**
   - Backend terminal shows: `MongoDB Connected`
   - No connection errors

4. **Test Login:**
   - Go to: http://localhost:5173/login
   - Login with admin credentials
   - Should redirect to dashboard

---

## Common Issues & Solutions 🔧

### Port Already in Use

```powershell
# Backend (port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (port 5173) - will auto-assign new port
```

### Dependencies Not Installing

```powershell
# Clear and reinstall
cd BACKEND
Remove-Item -Recurse -Force node_modules
npm install
```

### MongoDB Connection Failed

- Check internet connection
- Verify MongoDB Atlas is running
- Check `.env` file has correct MONGO_URI

---

## Next Steps 🎯

1. **Explore Features:**
   - Browse marketplace
   - Place test order
   - Try admin dashboard
   - Test chat feature

2. **Read Full Guide:**
   - See `SETUP_AND_RUN.md` for detailed information

3. **Customize:**
   - Add your products
   - Update settings
   - Modify branding

---

## Stop Servers

Press `Ctrl+C` in each terminal window

---

## Restart Servers

Simply run `.\run.ps1` again or start manually:

```powershell
# Backend
cd BACKEND
npm run dev

# Frontend (new terminal)
cd FRONTEND
npm run dev
```

---

**Total Time:** ~5 minutes ⏱️

**Happy Farming! 🌾**
