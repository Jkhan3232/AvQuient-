# Task Management Backend

Express, MongoDB, Mongoose, JWT, bcrypt, CORS, dotenv, and express-validator API for the task management app.

## Scripts

```bash
npm run dev
npm start
```

## Environment

Copy `.env.example` to `.env` and update:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_management_app
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173,http://localhost:5174,https://your-frontend-domain.com
CORS_ORIGIN_PATTERNS=
```

## Vercel Notes

This backend includes `api/index.js` and `vercel.json` so Vercel can run the Express app as a serverless function. Set the Vercel project root to `backend`.

If the deployed URL shows Vercel Authentication, disable Deployment Protection or use a public production deployment URL. That protection page is returned before Express runs, so CORS headers from this app cannot be added.

## Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
