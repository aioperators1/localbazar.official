# Electro Islam - Deployment Guide

## Prerequisites
- Node.js 18+
- npm or pnpm
- A database (PostgreSQL recommended for production, SQLite is used for dev)

## 1. Environment Setup
Create a `.env` file in the root directory (copy `.env.example`).
```env
DATABASE_URL="file:./dev.db"  # Or your postgres connection string
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"
```

## 2. Installation
```bash
npm install
```

## 3. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma migrate deploy

# Seed initial data (optional)
npx tsx prisma/seed.ts
```

## 4. Build for Production
```bash
npm run build
```

## 5. Start Application
```bash
npm start
```

## Deployment Options

### Vercel (Recommended)
1. Push code to GitHub.
2. Import project in Vercel.
3. Add Environment Variables in Vercel Dashboard.
4. **Note**: Vercel does not support SQLite persistently. Use Vercel Postgres or an external DB (Neon, Supabase).

### Docker
Use the generated `Dockerfile` (if added) or standard Next.js Docker setup.
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Windows Helper Scripts (If npm is not recognized)
If you see an error saying `npm is not recognized`, use the included batch files:
- **Run Setup**: Double-click `setup.bat` to install dependencies.
- **Start Server**: Double-click `dev.bat` or run `.\dev.bat` in your terminal.

## Admin Access
Visit `/admin` to access the dashboard.
