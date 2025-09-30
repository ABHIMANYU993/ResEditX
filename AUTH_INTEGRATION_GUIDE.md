# ResEditX Authentication Integration Setup

This guide explains how to set up the authentication integration between your Google Apps Script add-on and your backend server.

## Overview

The integration works as follows:
1. User opens the ResEditX add-on in Google Docs
2. If not authenticated, the add-on shows an authentication required overlay
3. User clicks "Login" and is redirected to an external authentication website
4. User logs in/signs up on the external website
5. Upon successful authentication, the user returns to the add-on with full access

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/reseditx
JWT_SECRET_TOKEN=your-super-secret-jwt-token-here
SALTROUNDS=10

# Server
PORT=5000
```

### 3. Start the Backend Server

```bash
cd backend
npm start
```

The backend will be available at `http://localhost:5000`

### 4. Authentication Page

The authentication page is available at: `http://localhost:5000/auth.html`

## Google Apps Script Setup

### 1. Update Configuration

In `Code.gs`, update the backend URLs if needed:

```javascript
const BACKEND_BASE_URL = 'http://localhost:5000'; // Change to your deployed URL
const AUTH_WEBSITE_URL = 'http://localhost:5000/auth.html'; // Change to your deployed URL
```

### 2. Deploy the Add-on

1. Open Google Apps Script editor
2. Paste the contents of `Code.gs` and `Interface.html`
3. Save and deploy as a web app or add-on

## How Authentication Works

### 1. Authentication Check
When the add-on loads, it calls `getAuthStatus()` which:
- Checks for stored JWT token in user properties
- Validates the token with the backend
- Returns authentication status

### 2. Login Flow
When user clicks login:
1. `openAuthWindow()` opens the external auth page
2. User enters credentials on the auth page
3. Backend validates credentials and returns JWT token
4. Auth page stores token temporarily
5. Add-on polls for authentication status
6. Once authenticated, overlays are hidden and features are enabled

### 3. Protected Functions
All main add-on functions are wrapped with `requireAuth()`:
- `extractKeywordsWithGemini()`
- `analyzeResumeWithGemini()`
- `generateBulletWithGemini()`
- `generateNewBulletFromKeyword()`
- `optimizeResumeSectionWithGemini()`
- `suggestImprovementsWithGemini()`

## Backend API Endpoints

### Authentication Endpoints
- `POST /api/user/signup` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/validate` - Token validation

### Protected Endpoints
- `GET /pricing/*` - Subscription routes (require JWT)

## Frontend Interface Changes

### 1. Authentication UI Elements
- Authentication status indicator in header
- Login/logout buttons
- Authentication required overlays on feature tabs
- User panel showing logged-in user

### 2. Authentication Methods
- `checkAuthStatus()` - Check current auth status
- `openAuthWindow()` - Open external login page
- `logout()` - Clear authentication data
- `requireAuthentication()` - Check auth before feature use

## Security Features

### 1. JWT Token Validation
- Tokens are validated with the backend on each request
- Expired tokens are automatically cleared
- Secure token storage in Google Apps Script user properties

### 2. CORS Configuration
- Backend allows cross-origin requests for the auth flow
- Authentication data is transmitted securely

### 3. User Session Management
- Automatic polling for authentication status
- Session cleanup on logout
- Secure token storage

## Deployment Considerations

### 1. Production URLs
Update these URLs when deploying to production:
```javascript
// In Code.gs
const BACKEND_BASE_URL = 'https://your-production-backend.com';
const AUTH_WEBSITE_URL = 'https://your-production-backend.com/auth.html';

// In auth.html
const API_BASE_URL = 'https://your-production-backend.com/api';
```

### 2. Environment Variables
Set production environment variables:
- Database connection string
- JWT secret key
- CORS origins

### 3. HTTPS Requirements
- Use HTTPS for all production URLs
- Ensure SSL certificates are valid
- Configure secure cookie settings

## Testing the Integration

### 1. Start Backend
```bash
cd backend
npm start
```

### 2. Test Authentication Page
Visit `http://localhost:5000/auth.html` and test login/signup

### 3. Test Add-on
1. Open Google Docs
2. Open the ResEditX add-on
3. Verify authentication flow works
4. Test that features require authentication

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Ensure frontend URLs are allowed

2. **Token Validation Fails**
   - Verify JWT secret is consistent
   - Check token expiration settings

3. **Authentication Window Issues**
   - Ensure popup blockers are disabled
   - Check that auth URL is accessible

4. **Database Connection Issues**
   - Verify MongoDB is running
   - Check connection string in .env

### Debug Logs
Enable debug logging in:
- Google Apps Script console
- Browser developer tools
- Backend server logs

## Security Best Practices

1. **Never expose API keys in client-side code**
2. **Use HTTPS in production**
3. **Implement proper token expiration**
4. **Validate all user inputs**
5. **Use secure JWT secrets**
6. **Implement rate limiting**
7. **Log security events**

## Next Steps

1. Deploy backend to production server
2. Update URLs in add-on code
3. Test end-to-end authentication flow
4. Implement additional security measures
5. Add user subscription management
6. Monitor authentication metrics