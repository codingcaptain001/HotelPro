# Admin Dashboard & Operations Central Command

## 1. Overview

The Admin Dashboard (`client/src/pages/Admin.jsx`) is the operational command center for HotelPro. Accessible at `/admin` and deep-linked via `/admin/:tab`, it replaces static mockups with live MongoDB Atlas operational data.

---

## 2. Central Navigation Hub

The dashboard features a 300px permanent sidebar on desktop and an Offcanvas drawer on mobile:
- **Brand Identity**: HotelPro Management Portal with crown badge.
- **Navigation Hub**:
  - `Overview` (`/admin/overview`) — Live badge
  - `Bookings Ledger` (`/admin/bookings`) — Count badge
  - `Accommodations` (`/admin/rooms`) — Catalog count badge
  - `Add New Suite` (`/admin/add-room`) — Provisioning studio
  - `Guest Directory` (`/admin/users`) — User count badge
- **External Navigation**:
  - `Public Catalog` (opens `/rooms` in new tab)
  - `Guest Home Page` (navigates to `/`)
- **Admin Profile Footer**:
  - Two-tier luxury card displaying administrator avatar, name, `Verified Admin` gold badge, email, and one-click Sign Out button.

---

## 3. Operations KPI Cards (`/admin/overview`)

The top of the overview displays 7 live metric cards with color-coded accent bars:
1. **Total Rooms**: Real-time count of accommodations in the Atlas database.
2. **Available Rooms**: Rooms with status `available` and computed ready-for-guests percentage.
3. **Total Bookings**: Count of all reservations in the ledger.
4. **Confirmed Bookings**: Verified reservations with confirmation percentage.
5. **Cancelled Bookings**: Count of cancellations and pending review requests.
6. **Registered Users**: Total guest and staff accounts.
7. **Gross Booking Revenue**: Total sum in USD generated from confirmed reservations.

---

## 4. Sticky Topbar

- Breadcrumb trail tracking active view.
- Real-time **"MongoDB Atlas Sync"** indicator.
- **Sync Atlas Button**: Manually triggers parallel re-fetching of rooms, bookings, and users.
- **Add Room Quick Button**: Direct navigation shortcut.
- **User Profile Dropdown**: Quick access to public website and sign-out.
