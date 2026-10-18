# Authentication & Session Security

## 1. Password Hashing with Bcrypt

HotelPro enforces salted, one-way password hashing using `bcryptjs` before any password reaches database storage.

```javascript
// Generation during registration / seeding
const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(plainTextPassword, salt);
```

### Password Verification Method (`User.js`)
The `User` Mongoose schema includes a helper instance method:
```javascript
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};
```
This guarantees that plain-text passwords are never compared directly or logged.

---

## 2. JWT Generation & Token Lifecycle

Tokens are generated in `authController.js` using `jsonwebtoken`:

```javascript
const generateToken = (res, userId, role) => {
  const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  // Store in secure HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  return token;
};
```

### Security Attributes
1. **`httpOnly: true`**: Inaccessible to client-side scripts (`document.cookie`), neutralizing credential exfiltration via XSS attacks.
2. **`secure: process.env.NODE_ENV === 'production'`**: Requires HTTPS transmission in production environments.
3. **`sameSite: 'lax'`**: Balances CSRF defense with smooth cross-site navigation.
