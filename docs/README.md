# HotelPro Documentation Hub

Welcome to the official developer and technical documentation for **HotelPro**, a full-stack MERN (MongoDB Atlas, Express 5, React 19, Node.js) hospitality management and guest reservation platform.

This documentation is structured into modular domain guides designed to allow any engineer, architect, or maintainer to understand, navigate, configure, test, and extend the codebase without guessing or reverse-engineering source files.

---

## Documentation Navigation Sitemap

```
docs/
├── README.md                                  # You are here: Documentation index & quick navigation
├── project-overview.md                        # High-level vision, core capabilities, tech stack & user personas
├── architecture/
│   ├── system-architecture.md                 # System components, network topologies, boundaries & data flow
│   ├── frontend-architecture.md               # React 19 component tree, routing, layout structure & design tokens
│   ├── backend-architecture.md                # Express 5 MVC architecture, controllers, routing & middleware
│   ├── request-response-flow.md               # Sequence diagrams and lifecycle of guest & admin transactions
│   └── folder-structure.md                    # File tree breakdown with responsibility annotations
├── frontend/
│   ├── pages-and-routing.md                   # React Router v7 routes, public vs. protected guest/admin pages
│   ├── components-and-layouts.md              # Reusable UI components, navigation, error boundary, footer
│   ├── state-management-and-auth.md           # AuthContext, session persistence, JWT cookies & access control
│   ├── api-integration.md                     # Axios client, base configuration, interceptors & error recovery
│   └── styling-and-responsive-design.md       # Custom luxury CSS system, tokens, media queries & print engine
├── backend/
│   ├── server-configuration.md                # Express entry points (index.js/app.js), CORS, env & port configuration
│   ├── api-reference.md                       # Complete HTTP REST endpoint reference with payload/response schemas
│   ├── routes-and-controllers.md              # Controller method breakdown (auth, room, booking, user)
│   ├── middleware-and-authorization.md        # JWT protection, role verification, cookies & error middlewares
│   ├── authentication.md                      # Password hashing with bcrypt, JWT signing, verification & expiration
│   ├── validation-and-error-handling.md       # Schema validation, error formatting & HTTP status codes
│   └── business-logic.md                      # Double-booking conflict detection, occupancy & revenue calculations
├── database/
│   ├── mongodb-atlas-setup.md                 # Cloud Atlas provisioning, URI strings, IP whitelisting & indexes
│   ├── data-models.md                         # Mongoose schema definitions, field constraints, types & hooks
│   ├── schema-reference.md                    # Tabular quick-reference of all model fields and validation rules
│   ├── relationships-and-indexes.md           # Foreign key references (ObjectId), indexing strategy & cascades
│   └── seed-scripts.md                        # Idempotent database seeders (rooms, admin, demo guest)
├── features/
│   ├── guest-workflows.md                     # Room discovery, booking creation, receipt generation, cancellation
│   ├── admin-dashboard.md                     # 7 Live KPI cards, navigation hub, real-time Atlas synchronization
│   ├── room-management.md                     # Inventory catalog, card/table views, live status toggling, deletion
│   ├── booking-management.md                  # Bookings ledger, status adjustments, date filtering, invoice modal
│   ├── user-management.md                     # Guest & staff directory, promotion to admin, verification badges
│   └── payments.md                            # Payment modeling, transactional states, Razorpay roadmap
├── setup/
│   ├── prerequisites.md                       # Required software versions (Node, npm, MongoDB Atlas)
│   ├── installation-and-execution.md          # Step-by-step repository cloning, dependency install & dev scripts
│   ├── environment-variables.md               # Exhaustive documentation of all server and client .env variables
│   ├── testing-and-verification.md            # Build checks, curl endpoint tests, and runtime verification
│   └── troubleshooting.md                     # Common gotchas, port collisions, MongoDB timeout & CSS caching
├── security/
│   ├── authentication-and-access-control.md   # Defense in depth, role-based gates, protected route guards
│   ├── data-protection.md                     # Password hashing, token handling, sensitive data isolation
│   └── security-review.md                     # Threat model, input sanitization, CSRF & XSS posture
└── maintenance/
    ├── dependencies-and-scripts.md            # npm package dependencies analysis and npm scripts reference
    ├── adding-a-feature.md                    # Developer step-by-step guide for implementing a new full-stack feature
    └── known-limitations.md                   # Documented technical debt, pending features & production roadmap
```

---

## Quick Reference Links

- **Main Repository README**: [`/README.md`](../README.md)
- **Local Application URLs**:
  - Public Website & Catalog: [http://localhost:5173/](http://localhost:5173/)
  - Guest Sign In: [http://localhost:5173/login](http://localhost:5173/login)
  - Staff Management Portal: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
  - Backend API Health: [http://localhost:5000/api/rooms](http://localhost:5000/api/rooms)
- **Default Seed Credentials**:
  - Administrator: `admin@hotelpro.com` / `admin123`
  - Demo Guest: `guest@hotelpro.com` / `guest123`
