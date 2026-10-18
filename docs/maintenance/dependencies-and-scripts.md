# Dependencies & npm Scripts

## 1. Top-Level Scripts (`package.json`)

| Command | Action Performed |
| :--- | :--- |
| `npm run dev` | Concurrently boots both `npm run server` and `npm run client` |
| `npm run server` | Starts Express backend with nodemon file watcher |
| `npm run client` | Starts Vite frontend development server |
| `npm run seed:rooms`| Executes `node server/scripts/seedRooms.js` to seed 8 suites |
| `npm run seed:admin`| Executes `node server/scripts/seedAdmin.js` to seed admin user |
| `npm run seed:guest`| Executes `node server/scripts/seedGuest.js` to seed demo guest |

---

## 2. Frontend Dependencies (`client/package.json`)

- `react` & `react-dom` (^19.3.0): Core virtual DOM rendering engine.
- `react-router-dom` (^7.18.4): Client-side routing.
- `react-bootstrap` (^2.10.10) & `bootstrap` (^5.3.8): UI component primitives & responsive grid.
- `lucide-react` (^1.55.0): Accessible modern SVG iconography.
- `axios` (^1.20.0): HTTP client with interceptors and cookie support.
- `vite` (^8.3.0) & `@vitejs/plugin-react` (^6.1.2): Build tool & fast HMR engine.

---

## 3. Backend Dependencies (`server/package.json`)

- `express` (^5.3.0): Web application framework.
- `mongoose` (^9.11.1): Object Data Modeling for MongoDB.
- `bcryptjs` (^3.0.3): Password hashing.
- `jsonwebtoken` (^9.0.3): Signed authentication token creation.
- `cookie-parser` (^1.4.7): Cookie header parsing middleware.
- `cors` (^2.8.6): Cross-origin resource sharing configuration.
- `dotenv` (^18.0.7): Environment variable loader.
