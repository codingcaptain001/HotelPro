# Room & Inventory Management

## 1. Overview

Accommodations management is accessible under `/admin/rooms` and `/admin/add-room`. It enables full lifecycle management of luxury suites.

---

## 2. Inventory Catalog View (`/admin/rooms`)

### Dual Display Modes
Staff can toggle between two presentation formats:
1. **Cards View (`LayoutGrid`)**: High-visual card layout showing the primary cover photo, category badge, nightly rate badge, capacity, amenity pills, and action buttons.
2. **Table View (`List`)**: Compact, dense operational table showing thumbnail, room title, category, rate, capacity, status pill, and action icons.

### Controls & Actions
- **Live Search**: Instant keyword filtering by room title or category.
- **Category Filter Dropdown**: Filter by Deluxe Suite, Executive Suite, Ocean Villa, etc.
- **Status Filter Dropdown**: Filter by `All Statuses`, `Available`, or `Maintenance`.
- **Instant Status Toggle**: Switch a room between `Available for Booking` and `Under Maintenance` in one click.
- **Room Deletion Modal**: Confirm room removal with safety prompt.

---

## 3. Suite Provisioning Studio (`/admin/add-room`)

A 4-module structured studio for adding new inventory:

### Module 1: Suite Identity & Classification
- Suite Title / Identifier (e.g. "Royal Oceanfront Penthouse 501").
- Category selection dropdown.
- Ambiance & narrative description textarea.

### Module 2: Pricing, Capacity & Availability
- Nightly rate with `$` adornment.
- Guest capacity with guest icon.
- Initial operational status.

### Module 3: Signature Amenities
- **1-Click Curated Presets Bar**: Auto-populates presets for Ocean Villa, Executive Penthouse, and Botanical Residence.
- **Interactive Pill Toggles**: 12 quick-click tags (Ocean View, King Bed, Soaking Tub, Butler Service, etc.) that toggle gold checkmarks and update the form ledger.
- Custom text ledger for custom amenity tags.

### Module 4: Photography & Media Assets
- Comma-separated high-resolution photo URLs.
- **Live Photo Asset Strip**: Automatically detects valid URLs and renders thumbnail previews with a `Cover` badge.

### Sticky Live Guest Card Simulator (Right Column)
- Pins at `top: 95px`.
- Renders the exact guest card preview in real time: hero image, dark vignette gradient, glassmorphic price badge, status badge, serif typography, and guest CTA simulation.
