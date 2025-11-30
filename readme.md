**Project**: Karykrm — GBU Events (Event_Planner)

**Overview**:
- Full-stack event management app (Node/Express + MongoDB backend, React + Redux frontend).
- Features: user auth (JWT), admin event management, Cloudinary poster uploads, Razorpay payment integration, ticketing with unique ticket pass codes and QR downloads.

**Repository layout**:
- `backend/` — Express API, Mongoose models, payment and ticket controllers.
- `frontend/` — React + Vite app, Redux Toolkit slices, components and pages.

**Project Screenshots**:
- `payment/` — <img src="./asset/Screenshot 2025-11-29 014248.png">
- `Home page/` — <img src="./asset/Screenshot 2025-11-29 014325.png">

**Prerequisites**
- Node.js 18+ (or latest LTS)
- npm (or yarn)
**Project**: Karykrm — GBU Events (Event_Planner)

**Overview**:
- Full-stack event management app (Node/Express + MongoDB backend, React + Redux frontend).
- Features: user auth (JWT), admin event management, Cloudinary poster uploads, Razorpay payment integration, ticketing with unique ticket pass codes and QR downloads.

**Repository layout**:
- `backend/` — Express API, Mongoose models, payment and ticket controllers.
- `frontend/` — React + Vite app, Redux Toolkit slices, components and pages.

**Prerequisites**
- Node.js 18+ (or latest LTS)
- npm (or yarn)
- MongoDB connection (Atlas or local)

**Environment variables**
Create a `.env` file in `backend/` containing at least the following keys:

```
MONGO_URI=mongodb+srv://<user>:<pw>@cluster0.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
PORT=5001

# Cloudinary (for event poster uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_key
CLOUDINARY_API_SECRET=your_cloud_secret

# Razorpay (test keys recommended)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Frontend currently uses `http://localhost:5001/api` as the API base URL in `frontend/src/api/axiosConfig.js`. If you prefer an env-backed base URL, update `axiosConfig.js` or add a `VITE_API_URL` and wire it into the axios instance.

**Install & Run (development)**
1. Backend

```powershell
cd backend
npm install
npm run dev    # starts server (nodemon) on port defined in .env (default 5001)
```

2. Frontend

```powershell
cd frontend
npm install
npm run dev    # Vite dev server (default http://localhost:5173)
```

Open the frontend in a browser (usually `http://localhost:5173`).

**Seeding an admin**
- If you removed admin self-signup, use the provided seed script `backend/src/seedAdmin.js` (if present) to create an initial admin.

Example (from backend):
```powershell
node src/seedAdmin.js
```

**Key flows**
- Authentication: JWT stored in `localStorage` under `token` and sent in `Authorization` header.
- Event creation: Admin creates events (optionally with `price`) and uploads a poster image — backend uploads to Cloudinary and stores `imageUrl`.
- Registration and tickets:
  - Free events: frontend calls POST `/api/tickets` (protected). Backend creates a unique `ticketCode` and stores a `ticket` record with status `free`.
  - Paid events: frontend creates a Razorpay order via POST `/api/payments/order`, opens Razorpay checkout with public `key_id`. After payment, frontend posts the verification to `/api/payments/verify`. On verification success, server creates a ticket (with `ticketCode`) and returns it.
- Tickets: each ticket includes a unique `ticketCode` (e.g., `GBU-...`) and appears in `My Tickets`. The UI shows a QR image (downloadable) generated from the ticket code.

**API endpoints (summary)**
- Auth: `POST /api/auth/register`, `POST /api/auth/login` (JWT)
- Events: `GET /api/events`, `POST /api/events` (admin), `PUT /api/events/:id/publish` etc.
- Payments: `POST /api/payments/order` (create order), `POST /api/payments/verify` (verify signature)
- Tickets: `POST /api/tickets` (create ticket — protected), `GET /api/tickets/my` (get current user's tickets)

**Troubleshooting**
- Razorpay signature errors: verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env` (test vs live). Remove whitespace around keys. Backend logs signature mismatches for debugging.
- Free registration "nothing happens": Ensure the frontend sends a valid JWT (check `localStorage.token`) and `POST /api/tickets` returns 201. Check browser DevTools -> Network.
- Cloudinary uploads failing: confirm `CLOUDINARY_*` vars and account status.
- If CORS or axios baseURL issues occur, check `frontend/src/api/axiosConfig.js` and backend CORS middleware.

**Testing**
- Manual: use the UI to register for a free event and a paid event (with Razorpay test keys). Check `My Tickets` and QR download.
- Backend: add unit tests as needed (not included).

**Security & Notes**
- Do NOT commit `.env` or credentials to source control.
- Razorpay test keys should be used when developing; switch to live keys only in production.
- Consider rate-limiting and server-side validation for production readiness.

**Contributing**
- Fork, create a branch, implement changes, and open a PR.
- Keep changes focused and update this README with any new env variables or scripts.

**License**
- Add a license file if you intend to open-source this project (e.g., `MIT`).

**Included images**
- `asset/Screenshot 2025-11-29 014248.png` — login page screenshot
- `asset/Screenshot 2025-11-29 014325.png` — signup page screenshot

**Push to GitHub**
When you're ready to push these final changes to your remote repository, run:

Notes:
- Make sure your `.gitignore` excludes `.env`.
- If you use a different branch name, replace `main` with your branch.

