# Data Protection & Privacy

## 1. Sensitive Data Handling

- **Password Hashes**: Plain-text passwords are never persisted. They are hashed using `bcryptjs` with 10 salt rounds. Password hashes are explicitly excluded from database queries using `.select('-passwordHash')` whenever returning user profiles.
- **Session Tokens**: JWT secrets are stored solely in environment variables and never exposed to client-side bundles.
- **Payment Information**: Credit card numbers and CVV codes are never stored or logged in MongoDB Atlas.

---

## 2. Transport Layer Security (TLS)

- **Database Connection**: MongoDB Atlas mandates TLS/SSL encryption for all socket connections over the wire.
- **API Traffic**: In production, HTTPS must be enforced by terminating SSL at the load balancer or reverse proxy (e.g. NGINX, Cloudflare, AWS ALB).
- **Secure Cookie Flag**: Cookies set `secure: true` when `NODE_ENV === 'production'`, preventing token leakage over insecure HTTP channels.
