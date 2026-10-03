# ✅ CORRECT LOGIN CREDENTIALS FOR DIRECT FARM

## 🔐 ACTUAL PASSWORDS FROM DATABASE

Based on the seed file (`BACKEND/src/seed.js`), all users have the same password:

### Password for ALL accounts:
```
FarmDirect2026!
```

---

## 👤 AVAILABLE USER ACCOUNTS

### 1. ADMIN ACCOUNT
```
Email: admin@directfarm.com
Password: FarmDirect2026!
Role: Admin
```

### 2. FARMER ACCOUNTS

**Farmer #1 - Ramesh Patel**
```
Email: ramesh.farmer@directfarm.com
Password: FarmDirect2026!
Role: Farmer
Farm: Green Valley Organic Farms
```

**Farmer #2 - Priya Sharma**
```
Email: priya.farmer@directfarm.com
Password: FarmDirect2026!
Role: Farmer
Farm: Sunrise Mango & Spices Estate
```

### 3. CUSTOMER ACCOUNTS

**Customer #1 - Rahul Verma**
```
Email: rahul.customer@directfarm.com
Password: FarmDirect2026!
Role: Customer
```

**Customer #2 - Sneha Kulkarni**
```
Email: sneha.customer@directfarm.com
Password: FarmDirect2026!
Role: Customer
```

---

## 🚀 HOW TO LOGIN

1. Open http://localhost:5173 in your browser
2. Click on the appropriate role tab (Admin/Farmer/Customer)
3. Enter the email and password from above
4. Click "Sign in"

---

## ⚠️ IMPORTANT: SEED THE DATABASE FIRST

If you haven't seeded the database yet, these users won't exist. Run:

```powershell
cd BACKEND
npm run seed
```

This will:
- Clear all existing data
- Create the test users with the password `FarmDirect2026!`
- Create sample products, orders, and other data

---

## 🔄 IF LOGIN STILL FAILS

1. **Check if backend is running**: http://localhost:5000/api/v1/health
2. **Check browser console** (F12) for any errors
3. **Re-seed the database**:
   ```powershell
   cd BACKEND
   npm run seed
   ```
4. **Clear browser cache** and try again (Ctrl + Shift + R)

---

## 📝 NOTE ABOUT PREVIOUS CREDENTIALS

The credentials I provided earlier were INCORRECT:
- ❌ `admin@directfarm.com` / `Admin@123` - WRONG
- ❌ `john.doe@example.com` / `Farmer@123` - WRONG  
- ❌ `jane.smith@example.com` / `Consumer@123` - WRONG

The CORRECT password for all accounts is:
- ✅ `FarmDirect2026!` - CORRECT

---

## 🎯 QUICK TEST

Try logging in as admin:
```
Email: admin@directfarm.com
Password: FarmDirect2026!
```

This should work immediately after seeding the database.

---

**Last Updated**: Now  
**Source**: BACKEND/src/seed.js (line 44)
