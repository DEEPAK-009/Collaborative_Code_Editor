# Deployment Guide

CollabX can be deployed using either **Judge0 Cloud/Self-Hosted API** (recommended for easy cloud hosting like Render/Vercel) or a **Dedicated Docker VPS**.

---

## Recommended Free Deployment (Render + Vercel + Judge0)

With **Judge0**, you do not need Docker on your backend server. You can deploy both frontend and backend for free on standard cloud platforms with full live code execution and stdin support:

- **Frontend**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend**: [Render](https://render.com) or [Railway](https://railway.app)
- **Database**: [MongoDB Atlas Free Tier](https://www.mongodb.com/atlas)
- **Code Execution**: Judge0 CE (`https://ce.judge0.com`) or Self-Hosted

---

## 1. Backend Deployment (Render / Railway)

1. Connect your GitHub repository to **Render** or **Railway** as a **Web Service**.
2. Set the Root Directory to `Backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables in the hosting dashboard:
   ```env
   PORT=6050
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/collab-code-editor
   JWT_SECRET=your-random-jwt-secret
   JWT_EXPIRES=7d
   FRONTEND_URL=https://your-frontend.vercel.app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback

   # Code Execution Settings
   ENABLE_CODE_EXECUTION=true
   EXECUTION_PROVIDER=judge0
   JUDGE0_API_URL=https://ce.judge0.com
   ```

---

## 2. Frontend Deployment (Vercel / Netlify)

1. Import your GitHub repository on **Vercel**.
2. Set Root Directory to `Frontend` (or project root depending on build setup).
3. Framework Preset: `Vite`.
4. Configure Environment Variables in Vercel:
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_ENABLE_CODE_EXECUTION=true
   ```
5. Click **Deploy**.

---

## 3. Google OAuth Configuration

Update your Google Cloud Console OAuth 2.0 Client:
- **Authorized JavaScript origins**: `https://your-frontend.vercel.app`
- **Authorized redirect URIs**: `https://your-backend.onrender.com/api/auth/google/callback`

---

## 4. Alternative: Self-Hosted on Docker VPS

If you prefer self-hosting everything (Backend + Docker Sandbox + Judge0) on an **Oracle Cloud Always Free VM** or **AWS EC2**:
- Follow [`docs/JUDGE0_SELF_HOSTING.md`](./docs/JUDGE0_SELF_HOSTING.md) for deploying Judge0.
- Use `docker compose up -d --build` to run the CollabX backend with Docker socket access.
