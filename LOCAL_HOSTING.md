# Local Hosting with Cloudflare Tunnel

This guide explains how to host your application locally and expose it to the internet using Cloudflare Tunnel.

## Prerequisites

- Ensure your application is running locally.
- Ensure you have internet access.

## Steps

### 1. Start the Local Application

Open your terminal in the project directory (`d:\electrosilam-main\electrosilam-main`) and run:

```bash
npm run dev
```

Wait until you see:
```
- Ready in ... ms
- Local: http://localhost:3000
```

### 2. Start Cloudflare Tunnel

Open a **new** terminal window (keep the first one running) and run:

```bash
npx cloudflared tunnel --url http://localhost:3000
```
(You may be asked to install `cloudflared` on the first run. Press `y` to accept).

### 3. Share the Link

In the Cloudflare terminal output, look for a URL ending in `.trycloudflare.com`.
Example:
```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
|  https://random-name-123.trycloudflare.com                                                 |
+--------------------------------------------------------------------------------------------+
```

Copy this URL. This is your "online link" that connects to your local database and application!

## Troubleshooting Database Connection

If the application crashes or shows database errors, it means your local environment cannot connect to the Neon database.

**Current Status:**
The database connection string in `.env` is invalid (Authentication Failed).
Please update `.env` with the correct `DATABASE_URL` from your Neon Dashboard:

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Copy the **Direct Connection String** (or Pooled, but Direct is better for migrations)
4. Update the `DATABASE_URL` in `d:\electrosilam-main\electrosilam-main\.env`
