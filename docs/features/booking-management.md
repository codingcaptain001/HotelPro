# Bookings & Reservations Management

## 1. Overview

The Bookings Management view (`/admin/bookings`) acts as the front desk ledger for the hotel.

---

## 2. Ledger Controls & Filters

- **Search Bar**: Filters records dynamically by booking reference (e.g. `BK-...`), guest name, customer email, or suite title.
- **Status Filter Tabs**:
  - `All Bookings`: Unfiltered view.
  - `Confirmed`: Active, confirmed reservations.
  - `Pending`: In-review reservations.
  - `Cancelled`: Cancelled bookings.
- **Date Sorting**: Sorts by newest reservation date or oldest arrival date.

---

## 3. Operations Table Columns

| Column | Data Represented |
| :--- | :--- |
| **Reference** | Public booking code (e.g. `BK-MVEBDJU2-GST`) |
| **Guest Profile** | Full name, email, and telephone number |
| **Accommodations** | Suite name and category |
| **Dates of Stay** | Check-in date $\rightarrow$ Check-out date and night count |
| **Financials** | Total price in USD with paid status badge |
| **Operational Status** | Green for `Confirmed`, amber for `Pending`, red for `Cancelled` |
| **Actions** | Status adjustment modal button & printable invoice button |

---

## 4. Status Transition Modal

Staff can click on a booking's status to open the Status Adjustment Modal, allowing transitions between:
- `Confirmed`: Guarantees the room is held for the guest.
- `Pending`: Marks the reservation as under front desk review.
- `Cancelled`: Immediately releases the dates back to inventory.

---

## 5. Printable Luxury Folio Invoice Modal

Staff can click the **Print** icon on any booking to open the luxury invoice modal:
- HotelPro brand header, resort address, and contact numbers.
- Formal guest billing details and check-in/check-out timestamps.
- Itemized room charge table with nightly rate, night count, subtotal, and tax.
- **Print Button**: Triggers `window.print()`. Thanks to the `@media print` CSS engine in `client/src/index.css`, all background UI is hidden and only the crisp invoice document is printed.
