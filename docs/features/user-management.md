# User & Staff Management

## 1. Overview

The User Directory (`/admin/users`) enables administrative oversight of all registered guests and staff members in the MongoDB Atlas database.

---

## 2. Directory Features

- **Live Search**: Instant keyword search matching guest names or email addresses.
- **Role Filtering**: Filter between `All Roles`, `Registered Guests`, and `Administrators`.
- **Identity Badging**:
  - `Admin`: Gold badge indicating full administrative command privileges.
  - `Guest`: Slate badge indicating verified guest privileges.

---

## 3. Administrative Privilege Promotion

Administrators can promote or demote accounts directly from the table:
- **Promote to Admin**: Upgrades a guest account to administrative privileges. Executes `PUT /api/users/:id/role` with `{ role: 'admin' }`.
- **Demote to Guest**: Revokes administrative access for a staff member.
- **Pre-Save Safety**: The Mongoose `User` model automatically synchronizes `isAdmin = true` when `role = 'admin'` and vice versa.

---

## 4. User Deletion Safeguards

Clicking the delete icon prompts a confirmation modal to prevent accidental deletion of guest history or staff accounts.
