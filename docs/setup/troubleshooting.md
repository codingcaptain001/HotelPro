# Troubleshooting & Common Issues

## 1. Common Issues & Solutions

### 1. `MONGO_URI is missing in environment variables`
- **Cause**: Running backend scripts without `.env` or running from a directory where `dotenv` cannot locate `.env`.
- **Solution**: The backend entry point uses `path.join(__dirname, '.env')`. Ensure `server/.env` exists and contains a valid `MONGO_URI`.

### 2. Port `5000` or `5173` Already in Use (`EADDRINUSE`)
- **Cause**: A previous Node or Vite process is still running in the background.
- **Solution**:
  - Windows:
    ```powershell
    netstat -ano | findstr :5000
    taskkill /PID <PID> /F
    ```
  - Linux / macOS:
    ```bash
    lsof -i :5000 -t | xargs kill -9
    ```

### 3. Blank Screen on Admin Routes
- **Cause**: An unhandled client-side exception occurred or the user profile could not be retrieved.
- **Solution**:
  - The application is wrapped in `ErrorBoundary.jsx`. Check the browser Developer Tools console (`F12 > Console`) to inspect the stack trace.
  - Clear `localStorage` via `localStorage.clear()` in the browser console and log in again at `/admin/login`.

### 4. Cross-Origin Cookie Not Saved (`req.cookies.jwt` is undefined)
- **Cause**: Browser blocked third-party cookies or `withCredentials: true` was omitted.
- **Solution**:
  - Verify that `client/src/services/api.js` has `withCredentials: true`.
  - In `server/app.js`, verify `cors` allows `origin: 'http://localhost:5173'` with `credentials: true`.
