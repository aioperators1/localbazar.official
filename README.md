# Electro Islam - Premium Electronics E-Commerce

A modern, minimalist, and high-performance e-commerce platform built with Next.js 16, Prisma, and Tailwind CSS.

## Features

- **Storefront**: Clean, professional design with responsive layout.
- **Product Management**: Browse by categories, new arrivals, and search.
- **Admin Dashboard**: Analytics, product status, and order tracking.
- **Performance**: Server Actions, Server Components, and optimized assets.
- **Modern UI**: "Clean Aesthetic" design system using Tailwind CSS variables.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: SQLite (Dev) / PostgreSQL (Prod ready)
- **ORM**: Prisma
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed.
- npm installed.

### Installation

1. Clone the repository (or extract files).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database:
   ```bash
   npm run db:push
   ```
   *Note: This creates a `dev.db` SQLite database and syncs the schema.*

4. Seed the database with Premium products:
   ```bash
   npm run db:seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push to GitHub.
2. Import project to Vercel.
3. Configure Environment Variables:
   - `DATABASE_URL`: Your production database URL (e.g., from Postgres/Supabase).
4. Deploy.

### Manual Build

```bash
npm run build
npm start
```

## Admin Access

Access the admin panel at `/admin`.
*Note: In this demo version, admin routes are unprotected. Integration with NextAuth.js is recommended for production.*

## Project Structure

- `/app`: App Router pages and layouts.
- `/components`: Reusable UI components.
  - `/store`: Customer-facing components (Header, Hero, ProductCard).
  - `/admin`: Admin-specific components.
  - `/ui`: Atomic design elements (Buttons, Inputs).
- `/lib`: Utilities and Server Actions.
- `/prisma`: Database schema.

---

**Designed with precision.**
