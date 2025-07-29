# 7Sigma-Full-Stack-Web-Application-Assessment

A full-stack image processing application built with Google OAuth2, image uploads to Google Cloud Storage, real-time status updates via WebSockets, and serverless image processing via Cloud Functions.

---

# Features

- Google OAuth2 authentication (frontend + backend)
- Secure image uploads to Google Cloud Storage
- Cloud Function triggers image processing on upload
- Real-time status updates via WebSockets (Socket.IO)
- JWT-based protected API routes
- Typed backend using Fastify + OpenAPI (In progress)
- Modern frontend using Vite + React + shadcn/ui

---

# Tech Stack

| Frontend      | Backend     | Cloud / Tools           |
|---------------|-------------|--------------------------|
| React + Vite  | Fastify     | Google Cloud Storage     |
| shadcn/ui     | OpenAPI     | Google Cloud Functions   |
| JWT + Axios   | TypeScript  | Google Secret Manager    |
| Socket.IO     | tRPC (In progress) | GitHub, Loom          |


| Layer             | Technology / Tool           | Description                              |
| ----------------- | --------------------------- | ---------------------------------------- |
| **Frontend**      | React + Vite                | Modern, fast SPA frontend framework      |
|                   | shadcn/ui                   | Beautiful and accessible UI components   |
|                   | Socket.IO Client            | Real-time communication with backend     |
|                   | Axios                       | HTTP client for API requests             |
|                   | TypeScript                  | Type-safe frontend development           |
|                   | JWT Token Handling          | Decoding and storing auth token          |
|                   | Tailwind CSS (via shadcn)   | Utility-first CSS framework              |
|                   | Google OAuth2               | Frontend Google sign-in flow             |
| **Backend**       | Fastify                     | Fast, low-overhead Node.js web framework |
|                   | OpenAPI + fastify-openapi   | Schema-driven API + automatic docs       |
|                   | fastify-oauth2              | Google login strategy for Fastify        |
|                   | Socket.IO Server            | Real-time push updates to client         |
|                   | fastify-jwt                 | JWT token generation and validation      |
|                   | Google Cloud Storage SDK    | Uploading and accessing image files      |
|                   | Google Secret Manager SDK   | Secure secrets handling                  |
|                   | tRPC (optional integration) | Type-safe backend procedure calls        |
| **Cloud / Infra** | Google Cloud Storage        | Image file storage                       |
|                   | Google Cloud Functions      | Serverless image processing logic        |
|                   | Google Secret Manager       | Manages credentials & config securely    |
|                   | GitHub                      | Source control and version tracking      |
|                   | Loom                        | Demo walkthrough recording               |


---

# Application Flow

1. **Login** via Google OAuth2
2. **Upload an image** securely (JWT protected)
3. Image is saved to **Google Cloud Storage**
4. A **Cloud Function** triggers to process the image
5. Real-time **WebSocket status updates** show upload + processing status

---

# Setup Instructions

# 1. Clone the Repo
```bash
git clone https://github.com/Poornesh-Muppalam/7Sigma-Full-Stack-Web-Application-Assessment.git
cd 7Sigma-Full-Stack-Web-Application-Assessment
