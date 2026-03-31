# Portfolio Deployment Notes

This setup is designed for a portfolio deployment, not a high-scale production environment.

## Free Demo Deployment

For the easiest free deployment:

- Frontend: Vercel or Netlify
- Backend: Render, Railway, or Koyeb
- Database: MongoDB Atlas free tier

In this mode, disable live code execution:

- `Backend/.env`: `ENABLE_CODE_EXECUTION=false`
- `Frontend/.env`: `VITE_ENABLE_CODE_EXECUTION=false`

That keeps auth, rooms, chat, roles, sockets, and collaborative editing online while avoiding Docker hosting requirements.

## Recommended Setup

- Frontend: Vercel or Netlify
- Backend: Docker-capable VPS
- Database: MongoDB Atlas

## Why the Backend Needs a VPS

The backend executes user code by starting Docker containers. Because of that, the backend should run on a host where Docker is available and the backend container can access the Docker socket.

## Backend Deployment

1. Clone the repository onto the VPS.
2. Place the project at a stable host path such as:

   `/opt/collaborative-code-editor`

3. Create the required env files:

   - copy `.env.example` to `.env`
   - copy `Backend/.env.example` to `Backend/.env`

4. Fill in the real values in `Backend/.env`:

   - `MONGO_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL`

5. Make sure the shared execution temp directory exists on the host:

   `mkdir -p /opt/collaborative-code-editor/Backend/temp`

6. Start the backend service:

   `docker compose up -d --build`

## Frontend Deployment

1. Deploy the [`frontend`](/Users/deepakreddy/Downloads/Collaborative-Code-editor/frontend) app to Vercel or Netlify.
2. Copy `frontend/.env.example` to the hosting platform env settings.
3. Set:

   `VITE_API_URL=https://your-backend-domain.com/api`

4. Redeploy the frontend after setting the environment variable.

## Google OAuth Setup

Update the Google Cloud OAuth app with the deployed values:

- Authorized JavaScript origin:
  `https://your-frontend-domain.com`
- Authorized redirect URI:
  `https://your-backend-domain.com/api/auth/google/callback`

## Useful Commands

- Validate compose config:
  `docker compose config --quiet`
- Start backend:
  `docker compose up -d --build`
- View logs:
  `docker compose logs -f backend`
- Stop backend:
  `docker compose down`

## Important Notes

- The backend container uses the host Docker socket to run language containers.
- The path in `HOST_CODE_EXECUTION_TMP_DIR` must be a real host path.
- This deployment style is suitable for demos and portfolio use.
- If `Backend/.env` contains old local secrets, rotate them before public hosting.
