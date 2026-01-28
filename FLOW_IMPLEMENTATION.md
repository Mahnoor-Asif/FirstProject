# Complete User Flow Implementation - Certifications → Password Setup → OTP → Login

## Overview
This document describes the complete user flow from certifications upload through successful login with OTP verification.

---

## 1. **Certifications Screen** (`certifications.tsx`)
### What happens:
- User uploads certification documents (optional)
- User completes certifications and clicks "Finish Registration"

### Flow:
1. Upload certificate files to backend
2. Finalize registration on backend
3. Navigate to Change Password screen
4. Store user's email in AsyncStorage for the next step

### Key Changes:
```tsx
// Navigate to change password after successful upload
router.push('/changepassword');
await AsyncStorage.setItem('registrationEmail', email);
```

---

## 2. **Change Password Screen** (`changepassword.tsx`) - NEW IMPLEMENTATION
### Multi-Step Flow:

#### Step 1: Set Password
- User enters new password and confirms it
- Validates password (min 6 characters, matching)
- Sends OTP to user's email
- Transitions to OTP verification step

#### Step 2: OTP Verification
- User receives OTP (6-digit code) via email
- Enter OTP in the input field
- 10-minute expiration timer with resend capability
- Shows email address for confirmation

#### Step 3: Confirm & Login
- After OTP verification succeeds
- Shows success message (✓)
- User clicks "Confirm & Login" button
- Password is saved to database
- User is redirected to login screen

### Backend Integration:
```
1. POST /api/send-otp { email }
   - Generates 6-digit OTP
   - Saves OTP to database (10 min expiry)
   - Sends OTP via Gmail

2. POST /api/verify-otp { email, otp }
   - Verifies OTP matches and hasn't expired
   - Sets otpVerified flag to true
   - Clears OTP from database

3. POST /api/change-password { email, newPassword }
   - Checks otpVerified flag
   - Hashes new password with bcrypt
   - Updates password in database
```

---

## 3. **Login Screen** (`login.tsx`) - ENHANCED
### What happens:
- User enters email and password
- System validates credentials against database
- On successful login:
  - Shows "You are now logged in!" success message
  - Stores session in AsyncStorage
  - Redirects to dashboard

### Key Features:
- Loading state during authentication
- Input fields disabled during login
- Error handling for invalid credentials
- Success notification before redirect

---

## Email Integration

### OTP Email Template
```html
Account Verification
Your OTP code is:
000000  (6-digit code)

This OTP will expire in 10 minutes.
If you didn't request this, please ignore this email.
```

### Email Service
- Uses Nodemailer with Gmail SMTP
- Configured in backend: `routes/auth.js`
- Gmail credentials from `.env` or hardcoded fallback

---

## Database Schema Updates

### Provider Model (`models/Provider.js`)
Added three new fields:
```javascript
otp: { type: String, default: undefined }           // 6-digit OTP code
otpExpiry: { type: Date, default: undefined }       // OTP expiration time
otpVerified: { type: Boolean, default: false }      // OTP verification status
```

---

## Complete Flow Diagram

```
┌─────────────────────┐
│  Certifications     │
│  Upload Screen      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Change Password    │
│  Step 1: Password   │
│  Input              │
└──────────┬──────────┘
           │
           ├─► [API: /send-otp]
           │   └─► Email OTP
           │
           ▼
┌─────────────────────┐
│  Change Password    │
│  Step 2: OTP Entry  │
│  (6 digits)         │
└──────────┬──────────┘
           │
           ├─► [API: /verify-otp]
           │   └─► Verify & Store
           │
           ▼
┌─────────────────────┐
│  Change Password    │
│  Step 3: Success    │
│  Confirmation       │
└──────────┬──────────┘
           │
           ├─► [API: /change-password]
           │   └─► Hash & Save
           │
           ▼
┌─────────────────────┐
│  Login Screen       │
│  Email + Password   │
└──────────┬──────────┘
           │
           ├─► [API: /login]
           │   └─► Verify Credentials
           │
           ▼
┌─────────────────────┐
│  Dashboard          │
│  (Successful Login) │
└─────────────────────┘
```

---

## API Endpoints Summary

### Backend Endpoints Added/Modified

#### 1. Send OTP
```bash
POST /api/send-otp
Body: { email }
Response: { success, message, expiresIn }
```

#### 2. Verify OTP
```bash
POST /api/verify-otp
Body: { email, otp }
Response: { success, message }
```

#### 3. Change Password
```bash
POST /api/change-password
Body: { email, newPassword }
Response: { success, message }
```

#### 4. Login (Existing)
```bash
POST /api/login
Body: { email, password }
Response: { success, provider, message }
```

---

## Testing Checklist

- [ ] **Certifications Upload**: Successfully upload files and navigate to password screen
- [ ] **Set Password**: Enter password, validate matching, trigger OTP send
- [ ] **Email Received**: Check Gmail for OTP email (sent to user's registered email)
- [ ] **OTP Verification**: Enter correct OTP and verify successfully
- [ ] **Password Change**: Confirm password is saved to database
- [ ] **Login Success**: Login with new password
- [ ] **Dashboard Access**: Successfully redirect to dashboard after login
- [ ] **OTP Expiry**: Try expired OTP after 10 minutes
- [ ] **Invalid OTP**: Try wrong OTP code, get error message
- [ ] **Resend OTP**: Test resend functionality with countdown timer

---

## Environment Variables

Ensure your backend `.env` has:
```
MONGO_URI=mongodb://127.0.0.1:27017/serviceProviderDB
GMAIL_USER=mahnoorasif237@gmail.com
GMAIL_PASS=bamxpvq (or use app-specific password)
```

---

## Files Modified

1. **Frontend**
   - `apps/service-provider/sp v(2)/project/app/certifications.tsx` - Updated navigation
   - `apps/service-provider/sp v(2)/project/app/changepassword.tsx` - Complete rewrite with OTP flow
   - `apps/service-provider/sp v(2)/project/app/login.tsx` - Enhanced with loading state & success feedback

2. **Backend**
   - `backend/service-pp-backend/routes/auth.js` - Added OTP endpoints (send, verify, change-password)
   - `backend/service-pp-backend/models/Provider.js` - Added OTP fields to schema

---

## Notes

- OTP expires after 10 minutes
- Password must be at least 6 characters
- All email communications go through Gmail SMTP
- Session is stored in AsyncStorage after successful login
- OTP is cleared from database after successful verification

