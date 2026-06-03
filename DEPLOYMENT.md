# InterviewAce AI — Production Deployment Guide

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key
- Cloudinary account

---

## 1. Clone & Setup

```bash
git clone <your-repo>
cd Newproject
```

---

## 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` with your credentials:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interviewace
JWT_SECRET=your_32_char_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

---

## 3. Frontend Setup

```bash
cd client
npm install
```

Edit `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 4. Create Admin Account

After starting the server, register normally then run in MongoDB:
```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## 🌐 Production Deployment

### Frontend → Vercel

1. Push `client/` folder to GitHub
2. Connect repo to Vercel
3. Set **Framework Preset**: Vite
4. Set **Root Directory**: `client`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
6. Deploy!

### Backend → Render

1. Push `server/` folder to GitHub
2. Create a **Web Service** on Render
3. Set **Root Directory**: `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add all environment variables from `.env`
7. Deploy!

### Database → MongoDB Atlas

1. Create free cluster on [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist all IPs: `0.0.0.0/0`
4. Copy connection string to `MONGODB_URI`

### Storage → Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Copy Cloud Name, API Key, API Secret to `.env`

### AI → Google Gemini

1. Go to [makersuite.google.com](https://makersuite.google.com)
2. Create API key
3. Set `GEMINI_API_KEY` in `.env`

---

## 📁 Project Structure

```
Newproject/
├── client/                 ← React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/          ← All page components
│   │   ├── components/     ← Reusable UI components
│   │   ├── layouts/        ← Page layouts
│   │   ├── context/        ← Auth context
│   │   ├── services/       ← API service layer
│   │   └── utils/          ← Helper utilities
│   ├── public/
│   └── vite.config.js
│
└── server/                 ← Node.js + Express + MongoDB
    ├── config/             ← DB, Cloudinary, Gemini configs
    ├── controllers/        ← Business logic
    ├── middleware/         ← Auth, error handling
    ├── models/             ← Mongoose schemas
    ├── routes/             ← Express routes
    ├── services/           ← AI & Email services
    └── app.js              ← Express entry point
```

---

## 🔒 Security Notes

- Never commit `.env` files to git
- Use strong JWT secrets (32+ chars)
- Enable MongoDB Atlas IP whitelist for production
- Use Cloudinary signed uploads in production
- Enable rate limiting (already configured)

---

## 📞 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/forgot-password | Send reset email |
| POST | /api/auth/reset-password/:token | Reset password |
| GET | /api/user/profile | Get user profile + stats |
| PUT | /api/user/profile | Update profile |
| PUT | /api/user/password | Change password |
| POST | /api/user/profile-picture | Upload photo |
| GET | /api/user/analytics | Get analytics data |
| POST | /api/interview/start | Start interview + generate questions |
| POST | /api/interview/answer | Submit answer + get AI evaluation |
| POST | /api/interview/complete/:id | Finalize interview |
| GET | /api/interview/history | Get interview list |
| GET | /api/interview/report/:id | Get full report |
| POST | /api/resume/upload | Upload + analyze resume |
| GET | /api/resume/history | Get resume list |
| GET | /api/resume/report/:id | Get resume analysis |
| GET | /api/admin/stats | Admin stats |
| GET | /api/admin/users | All users |
| DELETE | /api/admin/user/:id | Delete user |
| GET | /api/admin/export/users | Export CSV |
