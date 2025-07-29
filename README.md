# Full-Stack Image Processing App

## 🌐 Project Overview

This is a full-stack web application that allows users to:
- Log in using Google OAuth2
- Upload images securely to Google Cloud Storage
- Trigger automated image processing via Cloud Functions (thumbnail generation using `sharp`)
- Get real-time processing updates via WebSockets
- View upload/processing status live in the dashboard

---

## ⚙️ Tech Stack

### Frontend:
- React + Vite
- shadcn/ui (for design)
- TypeScript
- Socket.IO client

### Backend:
- Fastify (with CORS, JWT, Multipart)
- OpenAPI
- tRPC (planned integration)
- Socket.IO
- Google Cloud Storage
- Google Secret Manager
- Google Cloud Functions

---

## 🚀 Running the App Locally

### 1. Clone the repository

```bash
git clone <repo-url>
cd 7Sigma-Full-Stack-Web-Application-Assessment
```

### 2. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 3. Environment Setup

#### `.env` for Backend

```env
PORT=5001
GOOGLE_CLIENT_ID=323311732198-jkaf3obtq0f2gsdu71pb4pv453lcvhja.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
JWT_SECRET=mysecret123
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
GCS_BUCKET_NAME=image-processing-poornesh
```

#### `.env` for Frontend

```env
VITE_BACKEND_URL=http://localhost:5001
```

> ⚠️ Do **not** check secrets into GitHub. Use Secret Manager in production.

---

## 🔐 Google Cloud Secret Manager

Secrets like `GOOGLE_CLIENT_SECRET`, `JWT_SECRET`, `GOOGLE_APPLICATION_CREDENTIALS` are stored securely in Secret Manager.

### Setting up:

1. Go to Google Cloud Console → Secret Manager
2. Click "Create Secret"
3. Add values for:
   - `GOOGLE_CLIENT_SECRET`
   - `JWT_SECRET`
   - `GOOGLE_APPLICATION_CREDENTIALS` (paste full JSON string)

### Permissions

Give your compute or service account `Secret Manager Secret Accessor` permission under IAM.

---

## 🛠 Google OAuth2 Setup

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth2 Client ID
3. Authorized redirect URI: `http://localhost:5001/auth/google/callback`
4. Copy client ID & secret into `.env`

---

## 📦 Google Cloud Functions

### Function: `processImage`

- Trigger: Cloud Storage (upload)
- Resizes image using `sharp` and saves with `processed_` prefix

```js
const sharp = require('sharp');
// Resize logic ...
```

### Environment Vars (Cloud Function):

- `SOCKET_IO_SERVER_URL=http://localhost:5001`
- `CLOUD_FUNCTION_JWT=cloud-function-secret`

---

## 📡 WebSocket Events

- `image_status`: Sent by backend to update image upload or processing status.
- Live UI updates based on events in `Dashboard.tsx`.

---

## 📘 API Architecture

- **OpenAPI**: Backend routes follow OpenAPI specs (auto-documented)
- **tRPC**: (Planned) For type-safe RPC endpoints

---

## 🖼 UI Features

- Drag & drop (via shadcn/ui)
- JWT-protected dashboard
- Profile picture rendering
- Upload button with real-time progress

---

## Project Status

### Level 1: MVP – ✅ Completed
- Google OAuth flow works
- GCS image upload
- Cloud Function triggers & processes
- WebSockets send status
- Basic frontend UI

### Level 2: Intermediate – 🔄 In Progress
- Secret Manager (Integrated)
- OpenAPI spec + tRPC (planned)
- Polished UI (partially implemented)

---

## 📽 Demo

- Loom Video: [Insert Loom Link]
- GitHub: [Insert GitHub URL]
- Deployment: [Optional]

---

