# Styling & Responsive Design

## 1. Overview

HotelPro features a bespoke luxury design system codified in `client/src/index.css`. The design deliberately rejects generic, unstyled components in favor of high-end hospitality aesthetics: deep royal navies, subtle gold accents, glassmorphic card overlays, custom serif typography, and responsive micro-animations.

---

## 2. Design Tokens (`client/src/index.css`)

```css
:root {
  /* Luxury Color Palette */
  --navy-primary: #0A1424;
  --navy-secondary: #12233D;
  --navy-light: #1B355A;
  
  --gold-primary: #D4AF37;
  --gold-secondary: #B89628;
  --gold-light: #F3E5AB;
  --gold-gradient: linear-gradient(135deg, #D4AF37 0%, #AA820A 100%);
  
  --ivory-bg: #FAF9F5;
  --ivory-card: #FFFFFF;
  --text-primary: #12233D;
  --text-muted: #64748B;
  
  /* Typography Tokens */
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Cinzel', 'Playfair Display', serif;
}
```

---

## 3. Core Component Utility Classes

| Class Name | Visual Role | Key CSS Properties |
| :--- | :--- | :--- |
| `.card-luxury` | Luxury surface card | `border-radius: 20px; background: #FFF; box-shadow: 0 10px 30px -10px rgba(18, 35, 61, 0.08);` |
| `.admin-form-card` | Spacious form container | `border-radius: 24px; padding: 40px; border: 1px solid #E2E8F0; background: #FFF;` |
| `.amenity-pill-btn` | Interactive amenity toggle | `border-radius: 30px; padding: 8px 16px; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);` |
| `.amenity-pill-btn.selected` | Active amenity indicator | `background: linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.08) 100%); border-color: #D4AF37;` |
| `.preview-card-showcase` | Guest card simulator | `border-radius: 24px; border: 1.5px solid rgba(212, 175, 55, 0.3); overflow: hidden;` |
| `.admin-stat-card` | Operations KPI card | `border-radius: 18px; padding: 24px; position: relative; border-top: 4px solid var(--card-accent);` |
| `.badge-gold` | Luxury status pill | `background: var(--gold-gradient); color: #0A1424; font-weight: 700;` |

---

## 4. Responsive Breakpoints

```css
/* Tablet & Mobile Breakpoint (max-width: 991.98px) */
@media (max-width: 991.98px) {
  .admin-sidebar-desktop {
    display: none; /* Collapses desktop sidebar into Offcanvas menu */
  }
  .admin-topbar {
    padding: 14px 20px;
  }
  .admin-content-area {
    padding: 20px 16px 40px 16px; /* Reduced mobile padding */
  }
  .admin-form-card {
    padding: 24px 18px; /* Compact mobile form padding */
  }
}
```

---

## 5. Printable Folio Invoice Engine (`@media print`)

In `client/src/index.css`, dedicated print styling ensures that front-desk staff can click *"Print Official Invoice"* in the Bookings ledger and print a pristine physical receipt:

```css
@media print {
  body * {
    visibility: hidden;
  }
  #hotelpro-invoice, #hotelpro-invoice * {
    visibility: visible;
  }
  #hotelpro-invoice {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 20px;
    border: none !important;
    box-shadow: none !important;
  }
}
```
All screen elements, navigation bars, buttons, and backgrounds are suppressed, rendering exclusively the printable modal folio invoice.
