# Kaaputale — Handcrafted Woolen Elegance 🧶🌸

Kaaputale is a specialized e-commerce platform dedicated to handcrafted woolen flowers and home goods. Built with a modern tech stack (React, Vite, Firebase), it combines a clean minimalist design with a powerful admin system for real-time inventory management.

---

## ✨ Key Features

### 🛍️ Shopping Experience
- **Dynamic Catalog:** Browse through categorized collections (Flowers, Keychains, Accessories, Bookmarks).
- **Product details (Model):** Interactive previews with deep-dive descriptions and pricing.
- **Real-time Sync:** Products are fetched live from Firestore, ensuring you see the latest stock and designs.
- **Fast Experience:** Optimized with skeleton loaders and smooth animations (Framer Motion).

### 🔐 Advanced Admin Panel
- **Hidden Gateway:** Secure access via URL hash `#admin-panel`.
- **Full CRUD Suite:** Add, edit, or delete products with a dedicated management interface.
- **Custom Image Upload:** Integrated **ImgBB API** for direct image hosting and management.
- **Multi-UID Authentication:** Role-Based Access Control (RBAC) allowing multiple admin members.
- **Interactive Stats:** Real-time dashboard with product metrics and categorical breakdowns.
- **Appearance Control:** Native **Dark/Light Mode** switching for the dashboard.

---

## 🛠️ Technology Stack

- **Frontend:** React (Hooks + Functional Components), Vite (Build Tool)
- **Styling:** Custom CSS, Lucide-React (Icons), Framer Motion (Animations)
- **Backend:** Firebase (Firestore, Auth, Hosting, Functions, Analytics)
- **Integrations:** Axios (API Calls), ImgBB (Image Hosting)

---

## 📂 Project Structure

```text
kaaputale/
├── public/                 # Static assets & index.html
├── src/                    # Source Code
│   ├── assets/             # Brand logos & background images
│   ├── components/         # Reusable UI (Admin, Checkout, NavBar, etc.)
│   ├── hooks/              # Custom React hooks (useProducts)
│   ├── pages/              # Main route views (Home, Collection, About)
│   ├── styles/             # Modular CSS for components
│   └── firebase.js         # Firebase initialization & SDKs
├── server/                 # Express backend (Order API & Node.js)
├── .env                    # Secrets (Exclude from Git!)
├── firebase.json           # Firebase hosting/hosting configuration
└── package.json            # Dependencies & scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (LTS)
- npm or yarn

### 2. Installation
```bash
git clone [repository-url]
npm install
```

### 3. Environment Setup
Create a `.env` file in the root and add the following keys:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

VITE_ADMIN_UIDS=uid1,uid2        # Valid Admin Firebase UIDs
VITE_IMGBB_API_KEY=your_imgbb_key # For image uploads
```

### 4. Running Locally
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## ☁️ Deployment

The project is hosted via **Firebase Hosting**. 
To deploy updates:
```bash
npm run build
firebase deploy --only hosting
```

---

## 👤 Credits
**Author:** Leejaw Chitrakar
**Project Version:** 2.0.0 (Grand Update)
