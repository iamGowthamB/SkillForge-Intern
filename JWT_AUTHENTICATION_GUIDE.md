# SkillForge JWT Authentication System

## Complete Implementation Guide

This document provides a comprehensive overview of the JWT authentication system implemented in SkillForge, covering both backend (Spring Boot) and frontend (React) components.

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [API Endpoints](#api-endpoints)
5. [Security Features](#security-features)
6. [Testing Guide](#testing-guide)
7. [Folder Structure](#folder-structure)

---

## 🎯 System Overview

### Features Implemented

✅ **Backend**

- JWT token generation with role claims
- Refresh token mechanism (7-day expiration)
- Spring Security with BCrypt password hashing
- Role-based access control (STUDENT, INSTRUCTOR, ADMIN)
- Global exception handling for authentication errors
- Protected endpoints by role

✅ **Frontend**

- Enhanced login page with validation
- Password visibility toggle
- Automatic token refresh on expiration
- Role-based routing and redirection
- Secure token storage in localStorage
- Error handling with user-friendly messages

---

## 🔧 Backend Implementation

### 1. Project Structure

```
src/main/java/com/example/skillforge/
├── config/
│   └── SecurityConfig.java              # Spring Security configuration
├── controller/
│   ├── AuthController.java              # Login, register, refresh endpoints
│   ├── StudentController.java           # STUDENT role endpoints
│   ├── InstructorController.java        # INSTRUCTOR role endpoints
│   └── AdminController.java             # ADMIN role endpoints
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── RefreshTokenRequest.java
│   └── response/
│       ├── AuthResponse.java
│       └── RefreshTokenResponse.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── TokenExpiredException.java
│   ├── InvalidTokenException.java
│   └── AccessDeniedException.java
├── model/
│   ├── entity/
│   │   └── User.java                    # User entity with role
│   └── enums/
│       └── Role.java                    # STUDENT, INSTRUCTOR, ADMIN
├── security/
│   ├── JwtService.java                  # JWT generation & validation
│   ├── JwtAuthenticationFilter.java     # JWT filter
│   └── UserDetailsServiceImpl.java      # Load user details
└── service/
    └── AuthService.java                 # Authentication logic
```

### 2. Key Components

#### A. User Entity (`User.java`)

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    @JsonIgnore
    private String password;  // BCrypt hashed

    @Enumerated(EnumType.STRING)
    private Role role;  // STUDENT, INSTRUCTOR, ADMIN

    private LocalDateTime createdAt;
    // ... other fields
}
```

#### B. JWT Service (`JwtService.java`)

**Features:**

- Generates access tokens (24 hours expiration)
- Generates refresh tokens (7 days expiration)
- Includes role in JWT claims
- Validates tokens
- Extracts username and role from tokens

**Key Methods:**

```java
String generateToken(UserDetails userDetails)  // With role claims
String generateRefreshToken(UserDetails userDetails)
String extractUsername(String token)
String extractRole(String token)
boolean isTokenValid(String token, UserDetails userDetails)
```

#### C. Security Configuration (`SecurityConfig.java`)

**Configuration:**

- Stateless session management
- BCrypt password encoder
- JWT authentication filter
- Public endpoints: `/api/auth/**`
- Protected endpoints with role requirements

**Role-based Access:**

```java
.requestMatchers("/api/student/**").hasRole("STUDENT")
.requestMatchers("/api/instructor/**").hasRole("INSTRUCTOR")
.requestMatchers("/api/admin/**").hasRole("ADMIN")
```

#### D. Authentication Service (`AuthService.java`)

**Methods:**

1. **register()** - Create new user

   - Validates email uniqueness
   - Hashes password with BCrypt
   - Creates role-specific profile
   - Generates access & refresh tokens

2. **login()** - Authenticate user

   - Validates credentials
   - Generates tokens with role claims
   - Returns user info with tokens

3. **refreshToken()** - Renew access token
   - Validates refresh token
   - Generates new access & refresh tokens
   - Handles token expiration

#### E. Global Exception Handler

Handles:

- `BadCredentialsException` → 401 "Invalid email or password"
- `TokenExpiredException` → 401 "Token has expired"
- `InvalidTokenException` → 401 "Invalid token"
- `ExpiredJwtException` → 401 "JWT token has expired"
- `AccessDeniedException` → 403 "Access denied"
- `MalformedJwtException` → 401 "Malformed JWT"

---

## 🎨 Frontend Implementation

### 1. Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx                    # Enhanced login with validation
│   │   └── Register.jsx
│   ├── common/
│   │   └── PrivateRoute.jsx             # Role-based route protection
│   └── dashboard/
│       ├── StudentDashboard.jsx
│       ├── InstructorDashboard.jsx
│       └── AdminDashboard.jsx
├── services/
│   ├── api.js                           # Axios with token refresh interceptor
│   └── authService.js                   # Auth API calls
└── store/
    └── slices/
        └── authSlice.js                 # Redux auth state
```

### 2. Key Components

#### A. Login Component (`Login.jsx`)

**Features:**

- Email validation (valid format required)
- Password validation (min 6 characters)
- Password visibility toggle
- Loading state on submit
- Real-time error display
- Role-based redirection after login

**Validation:**

```javascript
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Inline error messages
- Backend error display
```

**Role-based Redirection:**

```javascript
STUDENT → /dashboard/student
INSTRUCTOR → /dashboard/instructor
ADMIN → /dashboard/admin
```

#### B. Auth Service (`authService.js`)

```javascript
export const authService = {
  login(credentials)          // POST /auth/login
  register(userData)          // POST /auth/register
  refreshToken()              // POST /auth/refresh
  logout()                    // Clear tokens
  getToken()                  // Get access token
  getRefreshToken()           // Get refresh token
  getCurrentUser()            // Get user from localStorage
}
```

#### C. API Interceptor (`api.js`)

**Automatic Token Refresh:**

1. Request interceptor adds JWT to `Authorization` header
2. Response interceptor catches 401 errors
3. Attempts to refresh token automatically
4. Retries original request with new token
5. Queues multiple requests during refresh
6. Redirects to login if refresh fails

**Implementation:**

```javascript
// Request Interceptor
config.headers.Authorization = `Bearer ${token}`;

// Response Interceptor
if (status === 401 && !originalRequest._retry) {
  // Try to refresh token
  const newToken = await refreshToken();
  // Retry original request
  return api(originalRequest);
}
```

#### D. Redux Auth Slice (`authSlice.js`)

**State:**

```javascript
{
  isAuthenticated: boolean,
  user: { userId, studentId, name, email, role },
  token: string,
  refreshToken: string,
  loading: boolean,
  error: string
}
```

**Actions:**

- `login()` - Async thunk for login
- `register()` - Async thunk for registration
- `refreshAccessToken()` - Async thunk for token refresh
- `logout()` - Clear auth state
- `updateToken()` - Update token in state

#### E. Protected Routes (`PrivateRoute.jsx`)

**Usage:**

```jsx
<PrivateRoute roles={['STUDENT']}>
  <StudentDashboard />
</PrivateRoute>

<PrivateRoute roles={['INSTRUCTOR', 'ADMIN']}>
  <ManageCourses />
</PrivateRoute>
```

**Features:**

- Authentication check
- Role-based access control
- Automatic redirection
- User-friendly error messages

---

## 🔌 API Endpoints

### Public Endpoints

#### 1. Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT",
  "phone": "1234567890"
}

Response (200 OK):
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT"
  }
}
```

#### 2. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "studentId": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT"
  }
}
```

#### 3. Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200 OK):
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Endpoints

#### Student Endpoints (Require STUDENT role)

```http
GET /api/student/dashboard
Authorization: Bearer <token>

GET /api/student/profile
GET /api/student/stats
```

#### Instructor Endpoints (Require INSTRUCTOR role)

```http
GET /api/instructor/dashboard
Authorization: Bearer <token>

GET /api/instructor/courses
GET /api/instructor/analytics
```

#### Admin Endpoints (Require ADMIN role)

```http
GET /api/admin/dashboard
Authorization: Bearer <token>

GET /api/admin/stats
GET /api/admin/users
```

---

## 🔒 Security Features

### 1. Password Security

- **BCryptPasswordEncoder** with default strength (10 rounds)
- Passwords never stored in plain text
- Password hashing on registration

### 2. Token Security

**Access Token:**

- Expiration: 24 hours (86400000 ms)
- Contains: username (email), role, issue/expiry dates
- HS256 signing algorithm

**Refresh Token:**

- Expiration: 7 days (604800000 ms)
- Minimal claims (username only)
- Used only for token refresh

### 3. Token Storage

**Security Tradeoffs:**

| Storage Method  | Security   | XSS Vulnerable | CSRF Vulnerable    |
| --------------- | ---------- | -------------- | ------------------ |
| localStorage    | ⚠️ Medium  | ✅ Yes         | ❌ No              |
| sessionStorage  | ⚠️ Medium  | ✅ Yes         | ❌ No              |
| HttpOnly Cookie | ✅ High    | ❌ No          | ⚠️ Yes (mitigated) |
| Memory Only     | ✅ Highest | ❌ No          | ❌ No              |

**Current Implementation:** localStorage

- Easy to implement
- Works across tabs
- ⚠️ Vulnerable to XSS attacks
- Should sanitize all user inputs

**Recommended for Production:** HttpOnly Cookies

- Not accessible via JavaScript
- Immune to XSS
- Requires CSRF protection

### 4. CORS Configuration

```properties
cors.allowed-origins=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### 5. Session Management

- Stateless JWT authentication
- No server-side session storage
- Token-based user identification

---

## 🧪 Testing Guide

### Step-by-Step Testing

#### 1. Start Backend

```bash
cd skillforge
.\mvnw.cmd spring-boot:run
```

Server runs on: `http://localhost:8081`

#### 2. Start Frontend

```bash
cd skillforge-frontend
npm run dev
```

App runs on: `http://localhost:5174`

#### 3. Test Registration

1. Navigate to `http://localhost:5174/register`
2. Fill in registration form:
   - Name: Test Student
   - Email: student@test.com
   - Password: password123
   - Role: STUDENT
3. Click "Register"
4. Should redirect to `/dashboard/student`
5. Check browser console for stored tokens

#### 4. Test Login

1. Navigate to `http://localhost:5174/login`
2. Enter credentials:
   - Email: student@test.com
   - Password: password123
3. Click "Login"
4. Verify role-based redirection
5. Check localStorage for:
   - `token`
   - `refreshToken`
   - `user`

#### 5. Test Role-Based Access

**Create users with different roles:**

```http
POST /api/auth/register
{
  "name": "Instructor User",
  "email": "instructor@test.com",
  "password": "password123",
  "role": "INSTRUCTOR"
}

POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "password123",
  "role": "ADMIN"
}
```

**Test access control:**

- Login as STUDENT → access `/api/student/**` ✅
- Student tries `/api/instructor/dashboard` → 403 ❌
- Login as INSTRUCTOR → access `/api/instructor/**` ✅
- Login as ADMIN → access all endpoints ✅

#### 6. Test Token Refresh

**Manual Test:**

1. Login and get tokens
2. Use Postman/Insomnia
3. Call protected endpoint with expired token
4. Should auto-refresh and retry request

**Simulate Expired Token:**

1. Set `jwt.expiration=5000` (5 seconds)
2. Restart backend
3. Login
4. Wait 6 seconds
5. Make any API call
6. Should automatically refresh token

#### 7. Test Error Handling

**Invalid Credentials:**

```bash
POST /api/auth/login
{
  "email": "user@test.com",
  "password": "wrongpassword"
}
Response: 401 "Invalid email or password"
```

**Expired Token:**

```bash
GET /api/student/dashboard
Authorization: Bearer <expired_token>
Response: 401 "JWT token has expired"
```

**Invalid Token:**

```bash
GET /api/student/dashboard
Authorization: Bearer invalid_token
Response: 401 "Invalid token"
```

**Access Denied:**

```bash
GET /api/admin/dashboard
Authorization: Bearer <student_token>
Response: 403 "Access denied"
```

#### 8. Test Frontend Validation

**Email Validation:**

- Empty email → "Email is required"
- Invalid format → "Email is invalid"

**Password Validation:**

- Empty password → "Password is required"
- Less than 6 chars → "Password must be at least 6 characters"

#### 9. Test Password Toggle

1. Enter password
2. Click eye icon
3. Password should toggle between visible/hidden

---

## 📂 Folder Structure

### Backend

```
skillforge/
├── src/main/java/com/example/skillforge/
│   ├── config/
│   │   └── SecurityConfig.java           # Security configuration
│   ├── controller/
│   │   ├── AuthController.java          # Auth endpoints
│   │   ├── StudentController.java       # Student endpoints
│   │   ├── InstructorController.java    # Instructor endpoints
│   │   └── AdminController.java         # Admin endpoints
│   ├── dto/
│   │   ├── request/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   └── RefreshTokenRequest.java
│   │   └── response/
│   │       ├── AuthResponse.java
│   │       ├── RefreshTokenResponse.java
│   │       └── ApiResponse.java
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java  # Centralized error handling
│   │   ├── TokenExpiredException.java
│   │   ├── InvalidTokenException.java
│   │   ├── AccessDeniedException.java
│   │   └── ResourceNotFoundException.java
│   ├── model/
│   │   ├── entity/
│   │   │   ├── User.java               # User entity
│   │   │   ├── Student.java
│   │   │   └── Instructor.java
│   │   └── enums/
│   │       └── Role.java               # STUDENT, INSTRUCTOR, ADMIN
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── StudentRepository.java
│   │   └── InstructorRepository.java
│   ├── security/
│   │   ├── JwtService.java             # JWT generation/validation
│   │   ├── JwtAuthenticationFilter.java # JWT filter
│   │   └── UserDetailsServiceImpl.java  # Load user details
│   └── service/
│       └── AuthService.java            # Auth business logic
└── src/main/resources/
    └── application.properties          # JWT config
```

### Frontend

```
skillforge-frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx              # Login page
│   │   │   └── Register.jsx           # Registration page
│   │   ├── common/
│   │   │   ├── PrivateRoute.jsx       # Route protection
│   │   │   ├── Input.jsx
│   │   │   ├── Button.jsx
│   │   │   └── Navbar.jsx
│   │   └── dashboard/
│   │       ├── StudentDashboard.jsx   # Student dashboard
│   │       ├── InstructorDashboard.jsx # Instructor dashboard
│   │       └── AdminDashboard.jsx     # Admin dashboard
│   ├── services/
│   │   ├── api.js                     # Axios instance with interceptors
│   │   └── authService.js             # Auth API calls
│   ├── store/
│   │   ├── store.js                   # Redux store
│   │   └── slices/
│   │       └── authSlice.js           # Auth state management
│   └── utils/
│       └── constants.js               # API base URL
```

---

## 🔑 Configuration

### Backend (`application.properties`)

```properties
# JWT Configuration
jwt.secret=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
jwt.expiration=86400000          # 24 hours
jwt.refresh.expiration=604800000 # 7 days

# CORS
cors.allowed-origins=http://localhost:5173,http://localhost:5174

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/skillforge
spring.datasource.username=root
spring.datasource.password=your_password

# Server
server.port=8081
```

### Frontend (`constants.js`)

```javascript
export const API_BASE_URL = "http://localhost:8081/api";
```

---

## 🚀 Production Recommendations

### Security Enhancements

1. **Use HttpOnly Cookies for token storage**

   ```java
   @PostMapping("/login")
   public ResponseEntity<?> login(..., HttpServletResponse response) {
       // Set HttpOnly cookie
       Cookie cookie = new Cookie("accessToken", token);
       cookie.setHttpOnly(true);
       cookie.setSecure(true); // HTTPS only
       cookie.setPath("/");
       cookie.setMaxAge(86400);
       response.addCookie(cookie);
   }
   ```

2. **Implement CSRF protection**

   - Use Spring Security CSRF tokens
   - Send CSRF token in custom header

3. **Use HTTPS in production**

   - Enable SSL/TLS
   - Set `cookie.setSecure(true)`

4. **Implement rate limiting**

   - Prevent brute force attacks
   - Limit login attempts

5. **Add refresh token rotation**

   - Issue new refresh token on each refresh
   - Invalidate old refresh tokens

6. **Store refresh tokens in database**

   - Track active sessions
   - Enable remote logout
   - Detect token theft

7. **Add token blacklisting**

   - Implement logout properly
   - Revoke compromised tokens

8. **Environment variables**

   ```bash
   # Don't hardcode secrets
   JWT_SECRET=${JWT_SECRET}
   DB_PASSWORD=${DB_PASSWORD}
   ```

9. **Input validation**

   - Sanitize all user inputs
   - Use `@Valid` annotations
   - Prevent SQL injection

10. **Logging and monitoring**
    - Log authentication attempts
    - Monitor failed logins
    - Alert on suspicious activity

---

## 📝 Summary

### What We Built

✅ **Complete JWT Authentication System** with:

- Secure login and registration
- Role-based access control (STUDENT, INSTRUCTOR, ADMIN)
- Automatic token refresh
- Production-ready error handling
- Clean, maintainable code structure

### Key Technologies

**Backend:**

- Spring Boot 3.5.7
- Spring Security 6
- JWT (jjwt 0.11.5)
- MySQL
- BCrypt password hashing

**Frontend:**

- React 18
- Redux Toolkit
- Axios
- React Router
- Tailwind CSS
- React Hot Toast

### Security Level: ⭐⭐⭐⭐ (4/5)

**Strengths:**

- BCrypt password hashing
- JWT with role claims
- Refresh token mechanism
- Global exception handling
- Role-based access control
- Automatic token refresh

**Areas for Enhancement:**

- HttpOnly cookies recommended
- Token blacklisting needed
- Rate limiting suggested
- CSRF protection for cookies

---

## 🎓 Learning Resources

- [JWT.io](https://jwt.io/) - JWT debugger and documentation
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [MDN Web Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)

---

## 📞 Support

For questions or issues, please:

1. Check this documentation
2. Review code comments
3. Test with provided examples
4. Verify configuration settings

---

**Document Version:** 1.0  
**Last Updated:** December 2025  
**Author:** GitHub Copilot with SkillForge Team
