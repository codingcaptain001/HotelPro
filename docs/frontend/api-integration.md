# Frontend API Integration

## 1. Axios Client Configuration (`client/src/services/api.js`)

All network communication between the frontend React application and the Express backend is mediated by a configured Axios instance in `client/src/services/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

---

## 2. Key Configuration Attributes

1. **`baseURL`**:
   - In local development, the Vite dev server configures a reverse proxy or targets `/api`.
   - In production, `VITE_API_URL` can point directly to the deployed API host (e.g., `https://api.hotelpro.com/api`).
2. **`withCredentials: true`**:
   - **Crucial Setting**: Directs the browser to transmit cross-origin cookies (specifically `jwt`) with every outbound asynchronous request. Without this setting, Express `req.cookies` will be empty on cross-origin requests.
3. **`Content-Type: application/json`**:
   - Ensures all outbound POST/PUT request bodies are parsed correctly by Express `express.json()`.

---

## 3. Request & Response Interceptors

When an authorized user signs in, the client attaches the JWT token to the Axios default authorization headers:
```javascript
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Error Recovery & Status Handling
Pages execute API calls inside standard `try / catch` blocks. Errors returned from Express are normalized:
```javascript
try {
  const { data } = await api.get('/rooms');
  setRooms(data);
} catch (err) {
  const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch rooms';
  setError(errorMsg);
}
```
If a `401 Unauthorized` status is received on a protected action, the client automatically clears user state and routes the guest to `/login`.
