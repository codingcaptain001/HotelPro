# Environment Variables Reference

## 1. Backend Environment Variables (`server/.env`)

| Variable | Required? | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Optional | `5000` | Port on which the Express HTTP server binds |
| `NODE_ENV` | Optional | `development` | Environment mode (`development` or `production`) |
| `MONGO_URI` | **Required** | `mongodb+srv://...` | MongoDB Atlas cluster connection string with credentials & database name |
| `JWT_SECRET` | **Required** | `your_secret_key` | Secret key used to sign and verify JSON Web Tokens |
| `CLIENT_URL` | Optional | `http://localhost:5173` | Allowed origin for CORS headers |

---

## 2. Frontend Environment Variables (`client/.env`)

| Variable | Required? | Example Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Optional | `http://localhost:5000/api` | Base URL for the backend API if not using Vite reverse proxy |

---

## 3. Security Guidelines for Environment Files

- **Never Commit `.env` Files**: `.env` is declared in `.gitignore` and must never be committed to public or private source repositories.
- Use `.env.example` as a template for other engineers joining the project.
- In production platforms (Render, Railway, AWS ECS, Heroku), configure these variables directly in the platform's Environment Settings dashboard.
