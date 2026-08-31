# NeedHub – Fast Groceries & Essential Home Services Delivery

NeedHub is a modern, full-stack eCommerce and on-demand home services platform built with **React 19**, **TypeScript**, **Tailwind CSS 4**, **Express backend**, **PWA capabilities**, and a native **Android Capacitor** project.

---

## 📁 Project Architecture

```text
NeedHub/
├── android/               # Complete native Android Capacitor project (com.needhub.app)
├── data/                  # Persistent database storage (db.json auto-created & synced)
├── public/                # Static assets, PWA manifest, service worker, & icons
│   ├── icon-192.png       # 192x192 PWA & Android app icon
│   ├── icon-512.png       # 512x512 PWA & splash icon
│   ├── icon-maskable.png  # Adaptive Android maskable icon
│   ├── icon.svg           # High-resolution vector brand icon
│   ├── manifest.json      # Web App Manifest (standalone display, shortcuts, theme)
│   ├── NeedHub_v1.0.apk   # Direct downloadable release Android package
│   ├── offline.html       # Offline fallback screen
│   └── sw.js              # Production Service Worker (cache + stale-while-revalidate)
├── server/
│   └── db.ts              # Database models, schemas, bcrypt hashing & persistence
├── src/
│   ├── assets/            # Local images and graphic assets
│   ├── components/        # Modular UI components
│   │   ├── admin/         # Superadmin dashboard (products, categories, services, orders, settings)
│   │   ├── cart/          # Cart drawer with live price calculation & delivery fees
│   │   ├── checkout/      # Multi-step checkout with address saving & receipt countdown
│   │   ├── common/        # Header, Bottom Navigation, Toast notifications, Install Modal
│   │   ├── home/          # Banner carousel, categories grid, popular products & services
│   │   ├── orders/        # Live order history, receipt modal & status tracking
│   │   ├── products/      # Product cards, modal detail, search & filtering
│   │   ├── profile/       # Customer profile & address management
│   │   ├── search/        # Unified multi-category search engine
│   │   ├── services/      # Service cards, booking modal with date & time slots
│   │   ├── settings/      # Dark/light theme switch, notifications, admin login shortcut
│   │   └── welcome/       # First-time customer onboarding screen
│   ├── config/
│   │   └── appConfig.ts   # Dynamic environment configuration
│   ├── context/
│   │   └── AppContext.tsx # Centralized global state management (cart, theme, auth, PWA)
│   ├── services/
│   │   └── api.ts         # Type-safe API client for customer and admin endpoints
│   ├── types.ts           # Global TypeScript interfaces & types
│   ├── App.tsx            # Main application shell with tab routing
│   ├── index.css          # Tailwind CSS global styles
│   └── main.tsx           # React DOM root & Service Worker registration
├── .env.example           # Environment variables configuration template
├── build-apk.bat          # 1-Click Windows Android APK builder script
├── build-apk.sh           # 1-Click Linux / macOS Android APK builder script
├── capacitor.config.json  # Capacitor native configuration
├── package.json           # Project dependencies & build scripts
├── server.ts              # Production Express server (API routes + Vite middleware)
├── tsconfig.json          # TypeScript compiler configuration
└── vite.config.ts         # Vite build configuration with Tailwind CSS plugin
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **bun** / **yarn**

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Review and customize values inside `.env` if desired (e.g., custom `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`).

### 4. Start Development Server
```bash
npm run dev
```
The application will start on **http://localhost:3000** (or `http://0.0.0.0:3000`).

---

## 🛠️ Production Build & Start

### 1. Build the Application
```bash
npm run build
```
This builds:
1. The client-side React SPA into `dist/`
2. The Express server bundle into `dist/server.cjs` via `esbuild`

### 2. Start the Production Server
```bash
npm start
```

---

## 🌐 Deploying to Any Hosting Platform

### Option A: Deploying with Docker
Create a `Dockerfile` in the project root:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/server.cjs"]
```

### Option B: Cloud Run / Render / Railway / Heroku / VPS
1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm start`
3. **Port**: Bind to port `3000` (or the port specified by the `$PORT` environment variable).
4. Set environment variables from `.env.example` in your platform's dashboard.

---

## 🔐 Admin Dashboard & Authentication

NeedHub includes a built-in superadmin portal to manage the entire store in real time.

- **Access Admin Portal**: Open the app &rarr; Settings &rarr; **Admin Portal** (or click the Admin icon in the header).
- **Default Superadmin Email**: `admin@needhub.com`
- **Default Superadmin Password**: `Admin@NeedHub2026!`
- **Customize Credentials**: Update `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env` file, or change them directly inside the **Admin Portal &rarr; Security** tab.

### Admin Capabilities:
- **Dashboard Stats**: Real-time total sales, active orders, product inventory, and customer count.
- **Product Management**: Add, edit, delete, toggle stock, upload images, set discount percentages, and feature popular items.
- **Category Management**: Create, edit, and reorder categories.
- **Service Bookings**: Manage on-demand home services (plumbers, electricians, appliance repair, etc.).
- **Order Pipeline**: View, filter, and transition order statuses (`Pending` &rarr; `Confirmed` &rarr; `Preparing` &rarr; `Out for Delivery` &rarr; `Delivered` / `Cancelled`).
- **Store & Delivery Settings**: Configure standard delivery fee, free delivery threshold, estimated delivery time, store open/closed status, currency symbol, and customer support phone number.

---

## 🔥 Firebase Integration (Optional)

NeedHub works out-of-the-box with local file-backed persistence (`data/db.json`) and is fully prepared to integrate with Firebase:

### Client-Side Firebase Setup (Auth, Firestore, Cloud Storage):
1. In the [Firebase Console](https://console.firebase.google.com/), create a project and add a **Web App**.
2. Add your Firebase credentials to `.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-app-id
   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

### Server-Side Firebase Admin Setup (Private Service Account):
1. Go to **Project Settings &rarr; Service Accounts &rarr; Generate New Private Key**.
2. Configure credentials in your server environment:
   ```env
   FIREBASE_PROJECT_ID=your-app-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-app-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

---

## 📱 Progressive Web App (PWA) & "Get App" Button

NeedHub is a complete, certified PWA:
- **Instant 1-Tap Install**: Triggers native `beforeinstallprompt` on Android Chrome, Windows Chrome/Edge, and macOS.
- **iOS Safari Support**: Provides interactive instructions for Safari's *Share &rarr; Add to Home Screen*.
- **Offline Reliability**: Powered by `public/sw.js` with automatic asset caching and `public/offline.html` fallback.
- **Direct APK Option**: The "Get App" modal includes an integrated direct APK download link pointing to `VITE_APK_DOWNLOAD_URL`.

---

## 🤖 Building Native Android APK (Capacitor)

The repository includes a ready-to-build native Android project located in `/android`:
- **Package ID**: `com.needhub.app`
- **Version Name**: `1.0.0` (Version Code: `1`)

### Method 1: Using the 1-Click Build Scripts
- **On Windows**: Double-click or run `build-apk.bat`
- **On Linux / macOS**: Run `./build-apk.sh`

The compiled APK will be output at:
```text
android/app/build/outputs/apk/release/app-release.apk
```

### Method 2: Using Android Studio
1. Build web assets and sync:
   ```bash
   npm run cap:build
   npm run cap:sync
   ```
2. Open the project in Android Studio:
   ```bash
   npm run cap:open
   ```
3. In Android Studio, go to **Build &rarr; Build Bundle(s) / APK(s) &rarr; Build APK(s)**.

---

## 📋 API Endpoints Summary

### Public Endpoints
- `GET  /api/health` — Service health check
- `GET  /api/config` — Store configuration & delivery settings
- `GET  /api/categories` — Enabled categories list
- `GET  /api/products` — Filter products by category, search query, or stock
- `GET  /api/products/:id` — Single product details
- `GET  /api/services` — Filter and list home services
- `GET  /api/services/:id` — Single service details
- `GET  /api/search?q=:query` — Multi-entity instant search
- `GET  /api/orders?phone=:phone` — Customer order lookup
- `POST /api/orders` — Submit new order / service booking
- `PUT  /api/orders/:id/cancel` — Cancel pending order
- `POST /api/customer/save` — Save customer delivery profile

### Protected Admin Endpoints (`Authorization: Bearer <token>`)
- `POST /api/admin/login` — Authenticate superadmin & issue JWT
- `GET  /api/admin/verify` — Verify token validity
- `POST /api/admin/change-credentials` — Update admin email & password
- `GET  /api/admin/stats` — Metrics and recent orders
- `POST /api/admin/products` — Create new product
- `PUT  /api/admin/products/:id` — Update product details / stock / price
- `DELETE /api/admin/products/:id` — Delete product
- `POST /api/admin/categories` — Create category
- `PUT  /api/admin/categories/:id` — Update category
- `DELETE /api/admin/categories/:id` — Delete category
- `POST /api/admin/services` — Create service
- `PUT  /api/admin/services/:id` — Update service
- `DELETE /api/admin/services/:id` — Delete service
- `GET  /api/admin/orders` — List and filter all orders
- `PUT  /api/admin/orders/:id/status` — Update order status & add status notes
- `PUT  /api/admin/delivery-settings` — Update delivery fee, thresholds, & store status

---

## ❓ Troubleshooting

| Issue | Solution |
|---|---|
| **Port 3000 already in use** | Set `PORT=8080` in `.env` or run `PORT=8080 npm start`. |
| **Admin login fails** | Ensure `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` match your login input, or restart server with fresh `data/db.json`. |
| **PWA Install button does not appear** | PWA installation requires an **HTTPS** connection (or `localhost`). Ensure your production domain has a valid SSL certificate. |
| **Android Build fails missing JDK** | Install **JDK 17** (or 21) and set `JAVA_HOME` environment variable pointing to your JDK installation. |
| **Images not displaying** | All images use high-reliability CDN endpoints or local `/public` assets. Verify internet connectivity for Unsplash image rendering. |

---

## 📄 License
This project is proprietary and maintained for NeedHub. All rights reserved.
