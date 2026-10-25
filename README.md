# Lumora Photography — Full Stack

React + Vite + Tailwind CSS (frontend) | Node.js + Express + MongoDB (backend)

## Quick Start

### Step 1 — Install everything
npm run install:all

### Step 2 — Configure environment
cp .env.example .env
(then open .env and fill in MongoDB, Cloudinary, Email values)

### Step 3 — Create admin account (first time only)
npm run seed:admin

### Step 4 — Run the project
npm run dev

Frontend: http://localhost:5173
Backend API: http://localhost:5001
Health check: http://localhost:5001/api/health

## All Scripts
npm run dev            — start frontend + backend together
npm run dev:client     — start frontend only
npm run dev:server     — start backend only
npm run build          — build frontend for production
npm run install:all    — install all npm packages
npm run seed:admin     — create first admin account
