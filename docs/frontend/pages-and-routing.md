# Frontend Pages & Routing

## 1. Routing Strategy

HotelPro utilizes **React Router v7** (`react-router-dom`), configured with HTML5 browser history (`BrowserRouter`). The routing configuration is defined inside `client/src/App.jsx`.

---

## 2. Route Inventory

| Route Pattern | Target Component | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Public | Luxury landing page with hero banner and featured suites |
| `/rooms` | `Rooms.jsx` | Public | Complete accommodations catalog with filter tabs |
| `/rooms/:id` | `RoomDetails.jsx` | Public | Comprehensive suite view, photo gallery, and booking widget |
| `/about` | `About.jsx` | Public | Brand narrative, resort story, and guest services information |
| `/login` | `Login.jsx` | Public | Guest sign-in with 1-click demo guest autofill button |
| `/register` | `Register.jsx` | Public | New guest registration form |
| `/dashboard` | `Dashboard.jsx` | Authenticated Guest | Guest account portal with active reservation ledger |
| `/my-bookings` | `Dashboard.jsx` | Authenticated Guest | Alias for guest booking ledger |
| `/admin/login` | `AdminLogin.jsx` | Public | Dedicated staff gateway with 1-click admin autofill button |
| `/admin` | `Admin.jsx` | Admin Only | Central Command dashboard (defaults to overview tab) |
| `/admin/:tab` | `Admin.jsx` | Admin Only | Deep-linked admin sub-views (`overview`, `bookings`, `rooms`, `add-room`, `users`) |
| `*` | `NotFound.jsx` | Public | 404 luxury error view |

---

## 3. Dynamic Route Parameters in Admin (`/admin/:tab`)

In `client/src/pages/Admin.jsx`, the current administrative view is controlled via the `:tab` route parameter:

```jsx
const { tab: urlTab } = useParams();
const validTabs = ['overview', 'bookings', 'rooms', 'add-room', 'users'];
const activeTab = validTabs.includes(urlTab) ? urlTab : 'overview';
```

When an admin clicks a navigation item in the sidebar, navigation is executed using `navigate('/admin/' + tabKey)`. This architecture provides two major benefits:
1. **Direct Deep Linking**: Staff can bookmark direct URLs (e.g. `/admin/add-room` or `/admin/bookings`) without losing their place on page refresh.
2. **Browser Back/Forward Support**: The browser history stack maintains each tab transition properly.

---

## 4. Protected Route Guard (`ProtectedRoute.jsx`)

The application guards sensitive routes using `ProtectedRoute.jsx`:
- Checks `loading`: If authentication status is still being resolved from the server, renders an elegant luxury loading spinner.
- Checks `user`: If not authenticated, redirects the user to `/login` (or `/admin/login` if attempting to reach an admin path), saving `location` in `state.from` for automatic return after login.
- Checks `adminOnly`: If `adminOnly={true}` is specified and `user.role !== 'admin'`, redirects to the guest `/dashboard` or home with an unauthorized notification.
