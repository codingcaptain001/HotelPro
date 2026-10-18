# Security Review & Threat Model

## 1. Threat Modeling & Defense Strategies

| Threat Vector | Mitigation Strategy in HotelPro |
| :--- | :--- |
| **Cross-Site Scripting (XSS)** | React JSX escapes interpolated variables automatically. Sensitive session tokens are placed in HTTP-only cookies, inaccessible to malicious DOM scripts. |
| **Cross-Site Request Forgery (CSRF)** | Cookies are configured with `SameSite: 'lax'`, preventing cross-origin invocation from malicious third-party websites during state-changing POST requests. |
| **NoSQL Injection** | Mongoose strictly types and casts schema values. Direct arbitrary query parameter injection (e.g. `{$gt: ""}`) is sanitized by schema casting. |
| **Brute Force Attacks** | Bcrypt work factor (10 salt rounds) introduces computational latency to thwart dictionary attacks. Recommended production enhancement: Rate limiting via `express-rate-limit`. |
| **Privilege Escalation** | Route endpoints check user role on every single transaction from the database document attached by `protect`, not relying purely on client-side claims. |
