# SkillForge - Test Login Credentials

## Backend Status

✅ **Backend is running on port 8081**
✅ **Frontend is running on port 5174**

## Sample User for Testing

Use these credentials to login to your application:

### Test User

- **Email:** `test@test.com`
- **Password:** `test123`
- **Role:** STUDENT
- **User ID:** 4
- **Student ID:** 3

## How to Login

1. Open your browser and go to: http://localhost:5174
2. Navigate to the Login page
3. Enter the credentials above
4. Click Login

The system will:

- Authenticate you via JWT
- Store the access token and refresh token
- Redirect you to the Student Dashboard
- Display your name "Test User" in the navbar

## API Endpoints

### Login

```
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "test123"
}
```

### Register New User

```
POST http://localhost:8081/api/auth/register
Content-Type: application/json

{
  "email": "newemail@test.com",
  "password": "password123",
  "name": "User Name",
  "role": "STUDENT"
}
```

### Refresh Token

```
POST http://localhost:8081/api/auth/refresh
Authorization: Bearer {refreshToken}
```

## User's Original Email

If you want to register your own email instead:

- **Email:** yadavhimanshu8272@gmail.com
- **Password:** (choose your password)
- Use the Register page on the frontend

## Token Information

- **Access Token:** Valid for 24 hours
- **Refresh Token:** Valid for 7 days
- Both tokens are stored in localStorage
- Tokens include role-based authorization

## Troubleshooting

If you see "Network Error":

1. Check backend is running: `netstat -ano | Select-String ":8081"`
2. Restart backend if needed: Go to `c:\aaaa\SkillForge-Intern\skillforge` and run `.\mvnw.cmd spring-boot:run`

If login fails:

- Verify credentials are correct
- Check browser console for error messages
- Verify backend logs in the PowerShell window

## Next Steps

1. ✅ Login with test@test.com / test123
2. Explore the Student Dashboard
3. View enrolled courses
4. Take quizzes
5. Track your progress
6. Register your own account if needed

---

**Note:** The sample user "test@test.com" already exists in the database. You can use it immediately for testing.
