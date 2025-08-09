# **P**ersonalized **E**ducation **T**ool Project

Full-stack application with:

- **Frontend**: Vite + React + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB (Mongoose) + TypeScript

## 📂 Project Structure

├── frontend/       # React + Vite + Tailwind

└── backend/        # Express + MongoDB + TypeScript API

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd <project-folder>
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env   # Fill in PORT, MONGODB_URI, etc.
npm install
npm run dev
Backend runs at http://localhost:3001
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
Frontend runs at http://localhost:5173
```

### 4. Optionally Run both servers in parallel (requires npm v7+)

npm run dev --workspace=backend & npm run dev --workspace=frontend

## 📡 API Health Check

```bash
curl http://localhost:3001/api/health
```

Example response:

```json
{
  "ok": true,
  "env": "development",
  "serverTime": "2025-08-09T17:21:54.567Z",
  "apiVersion": "1.0.0",
  "dbStatus": "disconnected",
  "dbName": null
}
```

## 🔐 Environment Variables

- Backend (`/backend/.env`, ignored by git; see `/backend/.env.example`):

```ini
  PORT=3001
  MONGODB_URI=mongodb://127.0.0.1:27017/pet_dev
```

- Frontend (`/frontend/.env`, optional; must start with `VITE_`):

```ini
  VITE_API_BASE=http://localhost:3001
```

## 📝 Notes

- Initial scaffold with frontend + backend, root `.gitignore`, and basic health endpoint.
- Server starts even if MongoDB is down; `dbStatus` in `/api/health` reflects connection state.
