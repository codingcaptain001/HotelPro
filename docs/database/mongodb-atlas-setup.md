# MongoDB Atlas Setup

## 1. Overview

HotelPro requires an active **MongoDB Atlas** database cluster (or a local MongoDB instance). Cloud Atlas provides managed high-availability replica sets, automated backups, and TLS-encrypted network channels.

---

## 2. Setting Up MongoDB Atlas

1. **Create an Account / Project**:
   - Navigate to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an organization/project.
2. **Deploy a Free Shared Cluster (M0)**:
   - Select AWS, Google Cloud, or Azure in your preferred geographic region.
3. **Configure Database Access (Credentials)**:
   - Under *Security > Database Access*, create a database user (e.g. `hotelpro_admin`) with password authentication and `readWriteAnyDatabase` privileges.
4. **Configure Network Access (IP Whitelist)**:
   - Under *Security > Network Access*, add an IP entry:
     - For local development: Click *"Allow Access from Anywhere"* (`0.0.0.0/0`) or whitelist your current public IP address.
5. **Obtain Connection String**:
   - Under *Databases*, click *"Connect" > "Drivers" (Node.js)*.
   - Copy the SRV connection URI:
     ```
     mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hotelpro?retryWrites=true&w=majority
     ```

---

## 3. Configuring the Application

Paste the connection string into `server/.env`:
```env
MONGO_URI=mongodb+srv://hotelpro_admin:your_secure_password@cluster0.abcde.mongodb.net/hotelpro?retryWrites=true&w=majority
```

Verify connection by launching the backend:
```bash
cd server
node index.js
# Output: Connected to MongoDB Atlas
```
