# SkillForge JWT Authentication - Quick Testing Guide

## 🚀 Quick Start

### 1. Ensure Both Servers Are Running

**Backend (already running):**

- URL: `http://localhost:8081`
- Status: ✅ Running

**Frontend (already running):**

- URL: `http://localhost:5174`
- Status: ✅ Running

---

## 🧪 Test the Complete Flow

### Step 1: Clear Browser Storage

Before testing, clear any old tokens:

1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Click "Clear site data" or manually delete:
   - `token`
   - `refreshToken`
   - `user`

### Step 2: Register a New User

**Option A: Using the UI**

1. Navigate to: `http://localhost:5174/register`
2. Fill in the form:
   ```
   Name: Test Student
   Email: student@test.com
   Password: password123
   Role: STUDENT
   ```
3. Click "Register"
4. Should automatically login and redirect to `/dashboard/student`

**Option B: Using Postman/Thunder Client**

```http
POST http://localhost:8081/api/auth/register
Content-Type: application/json

{
  "name": "Test Student",
  "email": "student@test.com",
  "password": "password123",
  "role": "STUDENT"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "name": "Test Student",
    "email": "student@test.com",
    "role": "STUDENT"
  }
}
```

### Step 3: Test Login

**Using the UI:**

1. If not already logged in, navigate to: `http://localhost:5174/login`
2. Enter credentials:
   ```
   Email: student@test.com
   Password: password123
   ```
3. Click "Login"
4. Verify redirection based on role:
   - STUDENT → `/dashboard/student`
   - INSTRUCTOR → `/dashboard/instructor`
   - ADMIN → `/dashboard/admin`

**Using API:**

```http
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "email": "student@test.com",
  "password": "password123"
}
```

### Step 4: Test Role-Based Access

#### Test Student Endpoints

1. Login as STUDENT
2. Try to access: `http://localhost:8081/api/student/dashboard`

**Using Postman:**

```http
GET http://localhost:8081/api/student/dashboard
Authorization: Bearer <your_token>
```

**Expected:** ✅ Success (200 OK)

```json
{
  "success": true,
  "message": "Student dashboard data",
  "data": {
    "message": "Welcome to Student Dashboard",
    "user": "student@test.com",
    "role": "STUDENT",
    "features": [
      "View Enrolled Courses",
      "Track Learning Progress",
      "Take Quizzes",
      "View Adaptive Learning Path"
    ]
  }
}
```

#### Test Access Denial

Try to access instructor endpoint as student:

```http
GET http://localhost:8081/api/instructor/dashboard
Authorization: Bearer <student_token>
```

**Expected:** ❌ 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied. You don't have permission to access this resource.",
  "data": null
}
```

### Step 5: Test Token Refresh

**Manual Method:**

1. Get your refresh token from localStorage or login response
2. Call refresh endpoint:

```http
POST http://localhost:8081/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<your_refresh_token>"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Automatic Method (Frontend):**

The frontend automatically refreshes tokens when they expire. To test:

1. Login to the app
2. Make API calls
3. Wait for token to expire (24 hours by default)
4. Make another API call
5. Check browser console - you should see automatic token refresh

### Step 6: Test Different User Roles

Create users with different roles:

**Instructor:**

```json
{
  "name": "Test Instructor",
  "email": "instructor@test.com",
  "password": "password123",
  "role": "INSTRUCTOR"
}
```

**Admin:**

```json
{
  "name": "Test Admin",
  "email": "admin@test.com",
  "password": "password123",
  "role": "ADMIN"
}
```

Then test access to respective endpoints:

| User Role  | Can Access                     | Cannot Access                         |
| ---------- | ------------------------------ | ------------------------------------- |
| STUDENT    | `/api/student/**`              | `/api/instructor/**`, `/api/admin/**` |
| INSTRUCTOR | `/api/instructor/**`           | `/api/admin/**`                       |
| ADMIN      | `/api/admin/**`, all endpoints | -                                     |

---

## 🔍 Verification Checklist

### Backend Verification

- [ ] Register new user → 200 OK with tokens
- [ ] Login with correct credentials → 200 OK with tokens
- [ ] Login with wrong password → 401 Unauthorized
- [ ] Access protected endpoint without token → 401 Unauthorized
- [ ] Access protected endpoint with valid token → 200 OK
- [ ] Access endpoint without permission → 403 Forbidden
- [ ] Refresh token with valid refresh token → 200 OK with new tokens
- [ ] Refresh token with invalid token → 401 Unauthorized

### Frontend Verification

- [ ] Login page shows email validation error
- [ ] Login page shows password validation error
- [ ] Password visibility toggle works
- [ ] Login with correct credentials → redirects to role-specific dashboard
- [ ] Login with wrong credentials → shows error message
- [ ] Protected routes require authentication
- [ ] Role-based redirection works correctly
- [ ] Token stored in localStorage
- [ ] Automatic token refresh works
- [ ] Logout clears tokens and redirects to login

---

## 🐛 Troubleshooting

### Issue: "Invalid email or password"

**Causes:**

- Wrong credentials
- User doesn't exist

**Solution:**

- Register the user first
- Check email and password are correct

### Issue: "JWT signature does not match"

**Causes:**

- Using token from different JWT secret
- Token was created before backend restart with new secret

**Solution:**

- Clear browser storage
- Login again to get fresh tokens

### Issue: "Access denied"

**Causes:**

- User doesn't have required role
- Trying to access endpoint for different role

**Solution:**

- Login with correct role
- Check role-based access requirements

### Issue: "Token has expired"

**Causes:**

- Access token expired (24 hours)
- Refresh token expired (7 days)

**Solution:**

- Frontend should auto-refresh
- Manually refresh using `/api/auth/refresh`
- If refresh token expired, login again

### Issue: CORS errors

**Solution:**

- Verify `cors.allowed-origins` in `application.properties`
- Add your frontend URL: `http://localhost:5174`

---

## 📊 Test Data

### Sample Users for Testing

```javascript
// Student
{
  email: "student@test.com",
  password: "password123",
  role: "STUDENT"
}

// Instructor
{
  email: "instructor@test.com",
  password: "password123",
  role: "INSTRUCTOR"
}

// Admin
{
  email: "admin@test.com",
  password: "password123",
  role: "ADMIN"
}
```

### Available Test Endpoints

#### Public (No Auth Required)

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `GET /api/auth/health`

#### Student Endpoints (STUDENT role)

- `GET /api/student/dashboard`
- `GET /api/student/profile`
- `GET /api/student/stats`

#### Instructor Endpoints (INSTRUCTOR role)

- `GET /api/instructor/dashboard`
- `GET /api/instructor/courses`
- `GET /api/instructor/analytics`

#### Admin Endpoints (ADMIN role)

- `GET /api/admin/dashboard`
- `GET /api/admin/stats`
- `GET /api/admin/users`

---

## 🎯 Expected Behavior Summary

### ✅ What Should Work

1. **Registration** → Creates user, returns tokens, redirects to dashboard
2. **Login** → Authenticates user, returns tokens, redirects based on role
3. **Token Refresh** → Renews expired access token using refresh token
4. **Protected Routes** → Only accessible with valid token and correct role
5. **Automatic Token Refresh** → Frontend handles token expiration automatically
6. **Role-Based Access** → Users can only access endpoints for their role
7. **Error Handling** → Clear, user-friendly error messages
8. **Logout** → Clears tokens and redirects to login

### ❌ What Should Be Blocked

1. Access without authentication
2. Access with invalid token
3. Access with expired token (if refresh fails)
4. Access to endpoints user doesn't have permission for
5. Login with wrong credentials
6. Registration with existing email

---

## 📝 Quick Commands

### Check Backend Status

```bash
curl http://localhost:8081/api/auth/health
```

### Test Login (Terminal)

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"password123"}'
```

### Test Protected Endpoint

```bash
curl http://localhost:8081/api/student/dashboard \
  -H "Authorization: Bearer <your_token>"
```

---

## 🎉 Success Indicators

If you see these, everything is working correctly:

1. ✅ User registration succeeds with tokens
2. ✅ Login redirects to correct dashboard based on role
3. ✅ Protected endpoints return data with valid token
4. ✅ 403 error when accessing unauthorized endpoints
5. ✅ Token automatically refreshes in frontend
6. ✅ Logout clears everything and redirects to login
7. ✅ Form validation shows appropriate errors
8. ✅ Password toggle works correctly

---

**Need Help?** Check the main documentation: `JWT_AUTHENTICATION_GUIDE.md`
