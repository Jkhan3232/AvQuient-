# TaskFlow MERN Task Management App

TaskFlow is a complete MERN stack task management application with JWT authentication, protected APIs, per-user task ownership, search, status filters, pagination, task statistics, dark mode, loading states, toast notifications, and responsive Tailwind CSS UI.

## Tech Stack

- MongoDB, Mongoose
- Express.js, Node.js
- JWT, bcrypt
- express-validator, dotenv, cors
- React, React Router DOM
- Axios, React Hook Form, Context API
- Tailwind CSS, react-hot-toast, lucide-react

## Project Structure

```text
backend/
  src/
    config/db.js
    controllers/authController.js
    controllers/taskController.js
    middleware/authMiddleware.js
    middleware/errorMiddleware.js
    models/User.js
    models/Task.js
    routes/authRoutes.js
    routes/taskRoutes.js
    utils/asyncHandler.js
    utils/generateToken.js
    utils/validation.js
    app.js
    server.js
  .env.example
  package.json

frontend/
  src/
    api/axios.js
    components/Navbar.jsx
    components/TaskCard.jsx
    components/TaskForm.jsx
    components/SearchBar.jsx
    components/Pagination.jsx
    context/AuthContext.jsx
    pages/Login.jsx
    pages/Register.jsx
    pages/Dashboard.jsx
    routes/ProtectedRoute.jsx
    App.jsx
    main.jsx
    index.css
  .env.example
  package.json
```

## Quick Start

Install all workspace dependencies from the project root:

```bash
npm install
```

Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Start MongoDB locally, then run both apps:

```bash
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- Health check: `http://localhost:5000/api/health`

## Environment Variables

Backend:

```bash
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/task_management_app
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Frontend:

```bash
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

Authentication:

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register user and return JWT |
| POST | `/api/auth/login` | Public | Login user and return JWT |
| GET | `/api/auth/me` | Protected | Return current user |
| POST | `/api/auth/logout` | Protected | Client-side token logout helper |

Tasks:

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/tasks` | Protected | List owned tasks with search, filter, pagination, stats |
| GET | `/api/tasks/:id` | Protected | Get one owned task |
| POST | `/api/tasks` | Protected | Create task |
| PUT | `/api/tasks/:id` | Protected | Update task |
| DELETE | `/api/tasks/:id` | Protected | Delete task |
| PATCH | `/api/tasks/:id/status` | Protected | Mark task pending or completed |

List query parameters:

```text
search=invoice
status=pending
page=1
limit=6
```

## Request Examples

Register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@example.com","password":"secret123"}'
```

Create task:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Prepare report","description":"Send final report by Friday","status":"pending"}'
```

## File-by-File Notes

- `backend/src/config/db.js`: Connects Mongoose to MongoDB.
- `backend/src/models/User.js`: User schema with unique email validation and bcrypt pre-save password hashing.
- `backend/src/models/Task.js`: Task schema with `pending` or `completed` status and required `userId` ownership.
- `backend/src/controllers/authController.js`: Register, login, profile, and logout responses with JWT token generation.
- `backend/src/controllers/taskController.js`: Task CRUD, status updates, ownership enforcement, search, filters, pagination, and stats.
- `backend/src/middleware/authMiddleware.js`: Validates Bearer JWT and attaches the authenticated user.
- `backend/src/middleware/errorMiddleware.js`: Normalizes validation, duplicate key, cast, and server errors.
- `backend/src/routes/authRoutes.js`: Auth endpoints with express-validator checks.
- `backend/src/routes/taskRoutes.js`: Protected task endpoints with route and body validation.
- `backend/src/utils/asyncHandler.js`: Wraps async Express handlers.
- `backend/src/utils/generateToken.js`: Signs JWT tokens.
- `backend/src/utils/validation.js`: Converts express-validator results into API errors and escapes search regex input.
- `backend/src/app.js`: Express app setup, CORS, JSON parsing, routes, health check, and error middleware.
- `backend/src/server.js`: Starts the API and handles graceful shutdown.
- `frontend/src/api/axios.js`: Axios instance with API base URL and JWT request header injection.
- `frontend/src/context/AuthContext.jsx`: Context API auth state, register, login, logout, and localStorage persistence.
- `frontend/src/routes/ProtectedRoute.jsx`: Guards authenticated pages.
- `frontend/src/pages/Login.jsx`: Login page with React Hook Form validation and toast errors.
- `frontend/src/pages/Register.jsx`: Registration page with client-side validation.
- `frontend/src/pages/Dashboard.jsx`: Task dashboard with API integration, modals, search, filters, pagination, stats, and error handling.
- `frontend/src/components/Navbar.jsx`: Header with user identity, logout, and dark mode toggle.
- `frontend/src/components/TaskCard.jsx`: Responsive task card with edit, delete, and status actions.
- `frontend/src/components/TaskForm.jsx`: Add and edit task modal.
- `frontend/src/components/SearchBar.jsx`: Search input and status filter.
- `frontend/src/components/Pagination.jsx`: Page navigation.
- `frontend/src/App.jsx`: Routes and toast provider.
- `frontend/src/main.jsx`: React entry point and theme bootstrap.
- `frontend/src/index.css`: Tailwind setup and reusable component classes.

## Deployment

Backend deployment options: Render, Railway, Fly.io, or a Node-capable VPS.

1. Set the backend root to `backend`.
2. Build command: `npm install`.
3. Start command: `npm start`.
4. Add production environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=<your MongoDB Atlas connection string>`
   - `JWT_SECRET=<long random secret>`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_URL=<your frontend URL>`

Frontend deployment options: Vercel, Netlify, Render Static Sites, or any static host.

1. Set the frontend root to `frontend`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Add `VITE_API_URL=<your deployed backend URL>/api`.

MongoDB Atlas:

1. Create a cluster.
2. Add a database user.
3. Allow your backend host IP or use the host provider's recommended allowlist.
4. Put the Atlas connection string in `MONGO_URI`.

## Security Notes

- Passwords are hashed with bcrypt before save.
- JWT tokens are signed with `JWT_SECRET`.
- All task routes require a valid Bearer token.
- Every task lookup includes `userId`, so users can access only their own tasks.
- Request bodies and route params are validated with express-validator.
- Error responses avoid leaking stack traces in production.
