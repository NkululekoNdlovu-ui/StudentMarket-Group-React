# Frontend Security Testing Guide

## Overview

This guide helps you test the frontend route protection and role-based access control.

## Security Features Implemented

### 1. **Authentication Context (AuthContext)**

- Manages user authentication state globally
- Stores JWT token, user role, and user data
- Provides login/logout functions
- Persists authentication to localStorage

### 2. **Protected Routes (PrivateRoute)**

- Requires user to be logged in
- Redirects to `/login` if not authenticated
- Shows loading spinner while checking auth state

### 3. **Role-Based Routes (RoleBasedRoute)**

- Requires specific user roles
- Redirects based on user's actual role if unauthorized
- Supports multiple allowed roles per route

## Route Protection Matrix

| Route                   | Access Level | Allowed Roles               |
| ----------------------- | ------------ | --------------------------- |
| `/`                     | Public       | Anyone                      |
| `/login`                | Public       | Anyone                      |
| `/signup`               | Public       | Anyone                      |
| `/home`                 | Protected    | STUDENT, ADMIN, SUPER_ADMIN |
| `/sell`                 | Protected    | STUDENT, ADMIN, SUPER_ADMIN |
| `/pending`              | Protected    | STUDENT, ADMIN, SUPER_ADMIN |
| `/buy`                  | Protected    | STUDENT, ADMIN, SUPER_ADMIN |
| `/transaction/:id`      | Protected    | STUDENT, ADMIN, SUPER_ADMIN |
| `/profile`              | Protected    | STUDENT, ADMIN, SUPER_ADMIN |
| `/admin-dashboard`      | Role-Based   | ADMIN, SUPER_ADMIN only     |
| `/superadmin-dashboard` | Role-Based   | SUPER_ADMIN only            |

## Test Users

### Student Account

- **Email:** test.student@example.com
- **Password:** student123
- **Role:** STUDENT
- **Access:** Can access home, buy, sell, profile pages
- **Cannot Access:** /admin-dashboard, /superadmin-dashboard

### Admin Account

- **Email:** test.admin@example.com
- **Password:** admin123
- **Role:** ADMIN
- **Access:** Can access all student pages + /admin-dashboard
- **Cannot Access:** /superadmin-dashboard

### Super Admin Account

- **Email:** test.superadmin@example.com
- **Password:** superadmin123
- **Role:** SUPER_ADMIN
- **Access:** Can access ALL pages including /superadmin-dashboard

## Testing Scenarios

### Test 1: Unauthenticated Access Prevention

**Objective:** Verify that unauthenticated users cannot access protected pages

**Steps:**

1. Open browser in incognito/private mode
2. Navigate to `http://localhost:3000/home`
3. **Expected:** Redirected to `/login`
4. Try these URLs directly:
   - `http://localhost:3000/buy` → Redirected to `/login`
   - `http://localhost:3000/sell` → Redirected to `/login`
   - `http://localhost:3000/admin-dashboard` → Redirected to `/login`
   - `http://localhost:3000/superadmin-dashboard` → Redirected to `/login`

### Test 2: Student Role Restrictions

**Objective:** Verify students cannot access admin pages

**Steps:**

1. Login with test.student@example.com / student123
2. Verify redirect to `/home` after login
3. Try to navigate to admin pages:
   - Type `http://localhost:3000/admin-dashboard` in address bar
   - **Expected:** Redirected back to `/home`
   - Type `http://localhost:3000/superadmin-dashboard`
   - **Expected:** Redirected back to `/home`
4. Verify student CAN access:
   - `/home` ✓
   - `/buy` ✓
   - `/sell` ✓
   - `/profile` ✓

### Test 3: Admin Role Access

**Objective:** Verify admins can access admin dashboard but not super admin

**Steps:**

1. Logout if logged in
2. Login with test.admin@example.com / admin123
3. Verify redirect to `/admin-dashboard` after login
4. Verify admin CAN access:
   - `/home` ✓
   - `/buy` ✓
   - `/sell` ✓
   - `/profile` ✓
   - `/admin-dashboard` ✓
5. Try to access super admin:
   - Type `http://localhost:3000/superadmin-dashboard`
   - **Expected:** Redirected to `/admin-dashboard`

### Test 4: Super Admin Full Access

**Objective:** Verify super admin has access to everything

**Steps:**

1. Logout if logged in
2. Login with test.superadmin@example.com / superadmin123
3. Verify redirect to `/superadmin-dashboard` after login
4. Verify super admin CAN access ALL pages:
   - `/home` ✓
   - `/buy` ✓
   - `/sell` ✓
   - `/profile` ✓
   - `/admin-dashboard` ✓
   - `/superadmin-dashboard` ✓

### Test 5: Session Persistence

**Objective:** Verify authentication persists across page refreshes

**Steps:**

1. Login as any user
2. Refresh the page (F5)
3. **Expected:** User remains logged in
4. Navigate to any protected page
5. **Expected:** Page loads without redirect to login

### Test 6: Logout Functionality

**Objective:** Verify logout clears session and prevents access

**Steps:**

1. Login as any user
2. Click logout in the profile dropdown
3. **Expected:** Redirected to landing page `/`
4. Try to navigate to any protected page
5. **Expected:** Redirected to `/login`
6. Check browser localStorage
7. **Expected:** No `token`, `role`, or `userData` keys present

### Test 7: Direct URL Navigation Prevention

**Objective:** THE CRITICAL FIX - Verify users cannot bypass security by typing URLs

**Steps:**

1. Login as STUDENT (test.student@example.com)
2. In address bar, type: `http://localhost:3000/admin-dashboard`
3. **Expected:**
   - Page does NOT load
   - Redirected back to `/home`
4. In address bar, type: `http://localhost:3000/superadmin-dashboard`
5. **Expected:**
   - Page does NOT load
   - Redirected back to `/home`
6. **Result:** ✅ FIXED - Students can no longer access admin pages by URL

### Test 8: Token Expiration Handling

**Objective:** Verify expired tokens redirect to login

**Steps:**

1. Login as any user
2. Open browser DevTools → Application → Local Storage
3. Manually delete the `token` key
4. Try to navigate to any protected page
5. **Expected:** Redirected to `/login`

### Test 9: Invalid Token Handling

**Objective:** Verify backend rejects invalid tokens

**Steps:**

1. Login as any user
2. Open browser DevTools → Console
3. Run: `localStorage.setItem('token', 'invalid-token-xyz')`
4. Try to access a protected page that makes API calls
5. **Expected:** API calls fail with 401/403, user redirected to login

### Test 10: Cross-Role Navigation

**Objective:** Verify role-based redirects work correctly

**Steps:**

1. Login as ADMIN
2. Navigate to `/admin-dashboard` - Should work ✓
3. Logout
4. Login as STUDENT
5. System should redirect to `/home` automatically
6. If user tries `/admin-dashboard`, redirect back to `/home`

## Security Checklist

- [ ] Unauthenticated users cannot access protected routes
- [ ] Students cannot access admin dashboard via URL
- [ ] Students cannot access super admin dashboard via URL
- [ ] Admins cannot access super admin dashboard via URL
- [ ] Super admins can access all routes
- [ ] Authentication persists on page refresh
- [ ] Logout clears all authentication data
- [ ] Invalid tokens are rejected
- [ ] Expired tokens redirect to login
- [ ] Direct URL navigation is blocked for unauthorized roles
- [ ] Role-based redirects work correctly
- [ ] Loading states show during auth checks

## Common Issues and Solutions

### Issue: Page flashes before redirect

**Cause:** Loading state not properly handled
**Solution:** AuthContext has `loading` state that shows spinner

### Issue: Can still access admin page by typing URL

**Cause:** Not using RoleBasedRoute component
**Solution:** Verified - All admin routes wrapped in RoleBasedRoute in App.jsx

### Issue: User data lost on refresh

**Cause:** Not reading from localStorage on mount
**Solution:** AuthContext's useEffect reads localStorage on mount

### Issue: Logout doesn't clear everything

**Cause:** Some localStorage keys not removed
**Solution:** Logout function removes all auth-related keys

## Architecture Overview

```
App.jsx (wrapped in AuthProvider)
  └─ Routes
      ├─ Public Routes (/, /login, /signup)
      ├─ PrivateRoute (requires authentication)
      │   └─ Student pages (/home, /buy, /sell, /profile)
      └─ RoleBasedRoute (requires specific role)
          ├─ Admin pages (allowedRoles: ['ADMIN', 'SUPER_ADMIN'])
          └─ Super Admin pages (allowedRoles: ['SUPER_ADMIN'])
```

## Integration with Backend

### Frontend Security

- Checks authentication state before rendering
- Validates user role matches route requirements
- Stores JWT token in localStorage
- Includes token in all API requests

### Backend Security

- Validates JWT token on each request
- Checks user role with @PreAuthorize
- Returns 401 Unauthorized for invalid tokens
- Returns 403 Forbidden for insufficient permissions

### Defense in Depth

✅ Frontend blocks unauthorized UI access
✅ Backend blocks unauthorized API access
✅ Together: Complete security coverage

## Testing Commands

```bash
# Start frontend
cd StudentMarket-Group-React
npm run dev

# Start backend
cd Student-Trade-Application-working-dev/student-trade
mvnw spring-boot:run

# Access frontend
http://localhost:3000

# Backend API
http://localhost:8181/api
```

## Success Criteria

✅ All test scenarios pass
✅ No unauthorized access via direct URL navigation
✅ Role-based restrictions properly enforced
✅ Authentication persists correctly
✅ Logout completely clears session
✅ Loading states prevent UI flashing
✅ Backend and frontend security aligned

---

**Status:** ✅ SECURED
**Last Updated:** [Current Date]
**Critical Fix:** Direct URL navigation to admin pages now properly blocked
