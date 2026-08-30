#  Backend Completed Tasks

### 1. Database & Models (PostgreSQL + Sequelize)
- [x] **User Model** (`users` table, UUIDs, roles: `user`/`admin`, `is_verified` / `is_actived` flags)
- [x] **OTP Model** (`otps` table, 6-digit code, expiration, status tracking)
- [x] **Token Blocklist Model** (`token_blocklist` table, token revocation by `jti`)
- [x] **Associations** (`User` 1:1 `Otp`) & Sequelize connection/sync

### 2.  Authentication & Security
- [x] **Register**: Bcrypt password hashing, validation, auto-sends OTP email
- [x] **Login**: Credential verification, blocks unverified users, issues HTTP-only JWT cookie
- [x] **Logout**: Revokes JWT via `jti` blocklisting & clears auth cookie
- [x] **State**: `GET /api/auth/state` to check account verification/completion flags
- [x] **Middleware**: `isAuthenticated` (JWT + Blocklist check), `isAdmin` (Role check), `rateLimiter` (100 req/min)

### 3.  Email & OTP Verification
- [x] **OTP Generator**: 6-digit HMAC-SHA256 generator
- [x] **Email Service**: Nodemailer Gmail SMTP dispatch
- [x] **Verify & Resend**: Validates code, activates user (`is_verified: true`), supports resending

### 4.  Admin Features
- [x] `GET /api/admin/dashboard` - Admin dashboard metadata
- [x] `GET /api/admin/users` - List all registered users (passwords excluded)

### 5.  Utilities & Helpers
- [x] **Loaders** (`utils/loaders/`):
  - `eager.loader.js` (`eagerLoad`, `eagerLoadOne`) - Upfront batch relations
  - `lazy.loader.js` (`lazyLoad`, `lazyLoadRelation`) - On-demand relations
  - `hybrid.loader.js` (`hybridLoad`) - Eager relations with pagination & limits
- [x] **JWT Services** (`services/jwt/`):
  - `genToken.service.js` (7-day session token with `jti`)
  - `verifyToken.service.js` (Token verification)
  - `accessToken.service.js` (15-min access token helper)
- [x] **General Utils**: Password hashing/compare, cookie setter, in-memory cache, validators

---

###  All Implemented Endpoints
- `POST /api/auth/register` (Public)
- `POST /api/auth/signup` (Public)
- `POST /api/auth/login` (Public)
- `POST /api/auth/logout` (Authenticated)
- `POST /api/auth/verify-otp` (Public)
- `POST /api/auth/resend-otp` (Public)
- `GET  /api/auth/state` (Public)
- `GET  /api/admin/dashboard` (🔒 Admin Only)
- `GET  /api/admin/users` (🔒 Admin Only)

