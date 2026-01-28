# 🚀 NEXORA OTP FLOW - TESTING GUIDE

## Fixed Issues ✅
- ✅ Provider model file paths made optional (with defaults)
- ✅ Improved error logging in signup endpoint
- ✅ File path handling now more robust
- ✅ Backend restart complete

---

## How to Test the Complete Flow

### Step 1: Registration Screen

1. Start the app and navigate to **Registration**
2. Fill in all required fields:
   - **Name:** Your full name
   - **Email:** Any valid email (will receive OTP later)
   - **Contact Number:** 10 digits
   - **CNIC Number:** Format like 12345-6789012-3
   - **Password:** Min 6 characters

3. Upload all required documents:
   - ✅ Profile Photo (PNG/JPG)
   - ✅ CNIC Front (PNG/JPG)
   - ✅ CNIC Back (PNG/JPG)
   - ⭕ Criminal Clearance (Optional)

4. Click **"Submit & Continue"**

**Expected Result:**
- Screen shows "Registration successful"
- Navigates to Skills Selection screen

---

### Step 2: Skills & Certifications

1. Select your skills/categories
2. Click continue to Certifications screen
3. Upload certification documents (optional but recommended)
4. Click **"Finish Registration"**

**Expected Result:**
- Success alert: "Certifications uploaded successfully. Now let's secure your account."
- Automatically navigates to **Password Setup Screen**

---

### Step 3: Password Setup (Step 1 - Set Password)

**Screen:** password-setup.tsx

1. Your registered email should be auto-filled
2. Enter **New Password** (min 6 characters)
3. Confirm the password in the next field
4. Click **"Continue to OTP"**

**Expected Result:**
- Loading spinner appears
- Success alert: "OTP has been sent to your email. Please check your inbox."
- Screen transitions to Step 2 (OTP Entry)
- **Check your email** - You should receive an OTP email from nexora@gmail.com

---

### Step 4: Password Setup (Step 2 - Verify OTP)

**Screen:** password-setup.tsx (Step 2)

1. Email address is displayed for confirmation
2. Copy the 6-digit OTP from your email
3. Paste it into the OTP input field
4. Click **"Verify OTP"**

**Features:**
- 10-minute countdown timer visible
- If timer expires, click "Resend OTP" button
- Invalid OTP shows error alert

**Expected Result:**
- Loading spinner appears
- Success message (OTP verified)
- Screen transitions to Step 3

---

### Step 5: Password Setup (Step 3 - Confirm)

**Screen:** password-setup.tsx (Step 3)

Display:
- ✓ Success checkmark
- "OTP Verified Successfully!"
- "Your email has been verified."

Action:
- Click **"Complete Setup & Login"**

**Expected Result:**
- Password is saved to database
- AsyncStorage is cleaned up
- Success notification: "Password set successfully! Please login with your new password."
- Navigates to **Login Screen**

---

### Step 6: Login Screen

**Screen:** login.tsx

1. **Email:** Enter the email you registered with
2. **Password:** Enter the **NEW PASSWORD** you just set (NOT the original registration password)
3. Click **"Sign In"**

**Features:**
- Loading spinner shown during authentication
- Input fields disabled during loading
- Success notification displayed

**Expected Result:**
- Success alert: "You are now logged in!"
- Session saved to AsyncStorage
- Navigates to **Dashboard**
- User is now fully logged in ✅

---

## Expected Email Template

When you request OTP, you'll receive an email like:

```
From: nexora@gmail.com
Subject: Your OTP for Account Verification

─────────────────────────────────────
Account Verification

Your OTP code is:

[000000]    (in green styling)

This OTP will expire in 10 minutes.

If you didn't request this, please ignore this email.
─────────────────────────────────────
```

---

## Troubleshooting

### Issue: "Failed to load resource: 500"
**Solution:** 
- Backend model fields are now optional with defaults
- Server has been restarted
- Try signup again

### Issue: "Email already registered"
**Solution:** 
- The email already exists in database
- Use a different email address
- Or clear database: `POST http://localhost:5004/api/dev/reset-database`

### Issue: "OTP not received"
**Solution:**
- Check spam/junk folder
- Verify email address is correct
- Check Gmail credentials in backend `.env`:
  - `GMAIL_USER=mahnoorasif237@gmail.com`
  - `GMAIL_PASS=bamxpvq`

### Issue: "Invalid OTP"
**Solution:**
- Ensure you copied the 6-digit code correctly
- OTP expires after 10 minutes
- Click "Resend OTP" to get a new code

### Issue: "Login fails with correct password"
**Solution:**
- Make sure you're using the **NEW PASSWORD** from Step 5
- NOT the original registration password
- Check email spelling matches exactly

---

## Complete Data Flow

```
FRONTEND REQUEST CHAIN:
├── Registration (role-selection → registration → skills-selection → certifications)
│   └── POST /api/signup (with files)
│       └── Creates Provider in database
│
├── Password Setup Screen
│   ├── Step 1: Set Password
│   │   └── POST /api/send-otp { email }
│   │       └── Generates & emails 6-digit OTP
│   │
│   ├── Step 2: Verify OTP
│   │   └── POST /api/verify-otp { email, otp }
│   │       └── Validates OTP & sets otpVerified flag
│   │
│   └── Step 3: Confirm
│       └── POST /api/change-password { email, newPassword }
│           └── Hashes password & updates database
│
└── Login Screen
    └── POST /api/login { email, password }
        └── Returns session → AsyncStorage → Dashboard
```

---

## Backend Endpoints Reference

```
✅ POST /api/signup
   Accepts: FormData with files (multipart/form-data)
   Returns: { success, message, providerId, email }

✅ POST /api/send-otp
   Body: { email }
   Returns: { success, message, expiresIn: 600 }

✅ POST /api/verify-otp
   Body: { email, otp }
   Returns: { success, message }

✅ POST /api/change-password
   Body: { email, newPassword }
   Returns: { success, message }

✅ POST /api/login
   Body: { email, password }
   Returns: { success, provider: { id, name, email, isComplete } }
```

---

## Success Criteria

✅ All steps completed successfully when:
1. Registration completes without errors
2. OTP email is received within seconds
3. OTP verification works with correct code
4. Password is saved successfully
5. Login succeeds with new password
6. Dashboard is accessible after login
7. Session persists in AsyncStorage

---

## Current Status

- ✅ Backend: Running on http://localhost:5004
- ✅ Database: MongoDB connected
- ✅ OTP Endpoints: All 3 implemented & tested
- ✅ Email Service: Gmail SMTP configured
- ✅ Frontend: All 3 screens updated
- ✅ Error Handling: Enhanced with better logging
- ✅ File Upload: Optimized with fallback defaults

**Ready for Testing! 🚀**

