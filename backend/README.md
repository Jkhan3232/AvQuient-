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
```

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
