# Project Overview

## 1. What is HotelPro?

**HotelPro** is a modern, enterprise-ready hotel booking and operations management platform engineered specifically for luxury boutique resorts, urban business hotels, and independent hospitality properties.

Historically, hotel reservation software has suffered from fragmented tooling: booking engines were isolated from operations desks, manual exports were required to compute revenue metrics, and front desks frequently faced double-booking errors caused by non-atomic booking transactions. 

HotelPro solves this by unifying:
1. **The Public Guest Experience**: An inviting, responsive storefront that showcases curated suites, transparent pricing, high-resolution imagery, and a friction-free booking flow.
2. **The Operations Central Command**: A unified administrative portal that synchronizes directly with a live MongoDB Atlas database, computing real-time Key Performance Indicators (KPIs), offering an immutable reservation ledger, dynamic suite provisioning, and a staff directory.

---

## 2. Target User Personas

| Persona | Primary Goal | Key Workflows & Permissions |
| :--- | :--- | :--- |
| **Prospective Guest** | Discover accommodations, evaluate luxury amenities, and reserve dates. | Browses `/rooms`, filters by category and capacity, reviews transparent nightly rates, and creates reservations. |
| **Registered Guest** | Manage active reservations, view booking history, and cancel if needed. | Logs in at `/login`, views `/dashboard` and `/my-bookings`, reviews confirmation receipts, and initiates self-service cancellations. |
| **Front Desk Staff** | Check guests in/out, verify reservations, and print physical invoices. | Logs in at `/admin/login`, views `/admin/bookings`, filters by arrival dates, adjusts reservation states, and prints official guest folio invoices. |
| **Hotel General Manager / Admin** | Monitor property health, occupancy, revenue, suite inventory, and staff roles. | Accesses `/admin/overview`, evaluates 7 live KPI cards, adds or edits suite listings at `/admin/add-room`, toggles maintenance states, and manages staff privileges at `/admin/users`. |

---

## 3. Technology Stack & Important Dependencies

### Frontend (`client/`)
- **Runtime & Build**: [React 19.3.0](https://react.dev/), [Vite 8.3.0](https://vitejs.dev/) with `@vitejs/plugin-react` and TypeScript typing definitions.
- **Routing**: [React Router v7.18.4](https://reactrouter.com/) supporting declarative nested routing, route-level parameter matching, and dynamic URL navigation.
- **Component Primitives**: [React-Bootstrap 2.10.10](https://react-bootstrap.netlify.app/) and [Bootstrap 5.3.8](https://getbootstrap.com/) for fluid grid layouts, modals, alerts, and offcanvas drawers.
- **Icons**: [Lucide React 1.55.0](https://lucide.dev/) providing over 30 consistent, accessible SVG icon components.
- **HTTP Client**: [Axios 1.20.0](https://axios-http.com/) configured with credentials support (`withCredentials: true`) to seamlessly transmit HTTP-only JWT session cookies.
- **Styling Architecture**: Custom luxury design system (`index.css`) utilizing CSS custom properties (variables), HSL tailored color schemes, custom serif typography, glassmorphism overlays, and `@media print` styling rules.

### Backend (`server/`)
- **Web Framework**: [Express 5.3.0](https://expressjs.com/) on [Node.js](https://nodejs.org/), leveraging modern async routing, robust error middleware, and modular controllers.
- **Database & ODM**: [MongoDB Atlas](https://www.mongodb.com/atlas) accessed through [Mongoose 9.11.1](https://mongoosejs.com/) Object Data Modeling (ODM) with strict schemas, custom pre-save hooks, and population mechanisms.
- **Security & Cryptography**:
  - [bcryptjs 3.0.3](https://www.npmjs.com/package/bcryptjs) for salted password hashing (10 salt rounds).
  - [jsonwebtoken 9.0.3](https://www.npmjs.com/package/jsonwebtoken) for stateless, signed JWT creation and verification.
  - [cookie-parser 1.4.7](https://www.npmjs.com/package/cookie-parser) for parsing encrypted and HTTP-only session cookies.
  - [cors 2.8.6](https://www.npmjs.com/package/cors) with explicit origin reflection and credentials permissions.
- **Environment & Process Management**:
  - [dotenv 18.0.7](https://www.npmjs.com/package/dotenv) for environment variable encapsulation.
  - [concurrently 8.2.2](https://www.npmjs.com/package/concurrently) for parallel orchestration of client and server processes from the project root.

---

## 4. Major Implemented Features

### Live Admin Operations Dashboard (`/admin`)
- **7 Operations KPI Metric Cards**:
  1. *Total Rooms*: Live catalog count with active/maintenance breakdown.
  2. *Available Rooms*: Real-time inventory ready for immediate guest check-in with computed occupancy rate.
  3. *Total Bookings*: All-time count of reservations across all statuses.
  4. *Confirmed Bookings*: Active, validated bookings with computed confirmation rate percentage.
  5. *Cancelled Bookings*: Tracks cancelled bookings and pending reviews.
  6. *Registered Users*: Total verified accounts with role distribution.
  7. *Gross Booking Revenue*: Sum of all confirmed booking transactions calculated directly from Atlas data.
- **Bookings Ledger**:
  - Text search by reference code, guest name, customer email, or room title.
  - Multi-status filter tabs (`All`, `Confirmed`, `Pending`, `Cancelled`).
  - Date sorting (newest first vs. oldest first).
  - Modal to update status on demand.
  - Printable Folio Invoice Receipt generator formatted for standard 8.5"x11" / A4 paper.
- **Suite Provisioning Engine (`/admin/add-room`)**:
  - 4-module structured form with luxury styling.
  - 1-Click Curated Presets: Auto-populates specifications for Penthouses, Ocean Villas, and Courtyard Suites.
  - Interactive Signature Amenity Badges: Click-to-toggle pills with checkmarks and gold accents.
  - Live Photo Assets Strip: Detects entered URLs and renders a horizontal thumbnail strip highlighting the cover image.
  - Live Guest Card Preview: Sticky real-time simulator showing the public card appearance.
- **Accommodations Catalog Management (`/admin/rooms`)**:
  - View switcher: Card Grid vs. Structured Table.
  - Instant status toggle between `Available` and `Maintenance`.
  - Delete modal with dependency confirmation.
- **User & Staff Directory (`/admin/users`)**:
  - Directory of all registered accounts.
  - 1-click privilege adjustment (promote guest to admin, demote admin to guest).

### Guest & Public Storefront
- **Responsive Navigation**: Brand mark, public links, dynamic guest authentication menu, and direct staff portal access.
- **Rooms Catalog (`/rooms`)**: Category filters, amenity tags, pricing, and guest capacity badges.
- **Room Detail View (`/rooms/:id`)**: Photo gallery, amenity breakdown, and booking date selector.
- **Date Conflict Prevention**: Backend engine prevents overlapping bookings on the same room for specified dates.
- **Guest Dashboard (`/dashboard`)**: Guest portal displaying upcoming stays with one-click reservation cancellation.
