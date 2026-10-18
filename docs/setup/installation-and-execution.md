# Installation & Execution Guide

## 1. Cloning the Repository

```bash
git clone https://github.com/codingcaptain001/HotelPro.git
cd HotelPro
```

---

## 2. Dependency Installation

HotelPro includes dependencies at three directory tiers: root (orchestrator), `server/` (backend), and `client/` (frontend).

```bash
# 1. Install root orchestrator dependencies
npm install

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# Return to repository root
cd ..
```

---

## 3. Environment Configuration

Create a `.env` file inside `server/` with your database credentials:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hotelpro?retryWrites=true&w=majority
JWT_SECRET=hotelpro_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

---

## 4. Seeding Database Records

Populate the database with accommodations and demo accounts:
```bash
# Seed 8 luxury suites
npm run seed:rooms

# Seed default administrator account (admin@hotelpro.com / admin123)
npm run seed:admin

# Seed demo guest account with sample booking (guest@hotelpro.com / guest123)
npm run seed:guest
```

---

## 5. Starting the Development Environment

Launch both backend and frontend concurrently:
```bash
npm run dev
```

The application will be accessible at:
- Frontend Client: [http://localhost:5173](http://localhost:5173)
- Backend REST API: [http://localhost:5000](http://localhost:5000)
- Admin Portal: [http://localhost:5173/admin](http://localhost:5173/admin)
