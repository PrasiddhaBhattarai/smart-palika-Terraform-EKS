# Smart-Palika
# 🏙️ Civic Complaint Management System – Backend

A RESTful backend API for managing civic complaints in municipalities and wards. Built using Node.js, Express, PostgreSQL with PostGIS for geolocation, and Redis for caching.

---

## 🚀 Features

### 📌 Complaints
- File complaints with:
  - Description
  - Tags
  - Location (lat/lng via PostGIS)
  - Photo upload
- Store and serve complaint images
- Automatically detect duplicate/nearby complaints
- View complaints by user, ward, or municipality
- Pagination and status filtering
- Support existing complaints (one per user)
- Submit feedback and rating (one per supporter)
- Track supporter count

### 👤 Users
- Signup/Login with role-based access (`user`, `ward_admin`, `palika_admin`)
- Get user profile info
- Authentication via JWT (stored in cookies)

### 🧑‍💼 Admin Features
- Admins can:
  - View complaints for their ward or municipality
  - Filter by status and tags
  - Access feedback submitted by users
- Mean rating of each admin (based on complaint resolution) is:
  - Calculated from supporter ratings
  - Cached in Redis and retrievable via secure cron route

---

## 🏗️ Tech Stack

- **Language**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL + PostGIS
- **Cache**: Redis
- **Authentication**: JWT (via cookie)
- **Image Upload**: Multer
- **Geo Queries**: ST_DWithin, ST_Point, ST_SetSRID
- **Pagination & Filtering**: Query-based

---

## 📁 Folder Structure

```bash
backend/
├── src/
│   ├── controllers/
│   │   ├── complaint_file_controller.js
│   │   ├── complaint_view_controller.js
│   │   ├── user_controller.js
│   │   └── rating_controller.js
│   ├── routes/
│   │   ├── complaints.js
│   │   ├── users.js
│   │   └── ratings.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   ├── db.js
│   │   └── redis.js
│   ├── app.js
├── index.js
├── .env
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/civic-complaint-system.git
cd civic-complaint-system/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the `backend/` folder with:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgres://user:password@localhost:5432/your_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
CRON_SECRET=your_secure_cron_secret
CLOUDINARY_CLOUD_NAME=....
CLOUDINARY_API_KEY=....
CLOUDINARY_API_SECRET=....
EMAIL_USER=....{for smtp}
EMAIL_PASS=....
```

### 4. Run Database Migrations

Assuming you're using `node-pg-migrate`:

```bash
npm run migrate up
```

### 5. Start the Server

```bash
npm run dev
```

---

## 🔐 Authentication

- JWT-based authentication using cookies.
- Use middleware `auth.js` to protect routes.
- Admin roles determined by `users.role`.

---

## 🧠 Redis Caching

- Mean rating for each `ward_admin` is cached in Redis.
- A secure route (with `x-cron-secret` header) updates Redis every hour.

---

## 🧪 Sample API Endpoints

| Method | Endpoint                           | Description                          |
|--------|------------------------------------|--------------------------------------|
| POST   | `/api/complaints`                  | File a new complaint                 |
| GET    | `/api/complaints/user/:id`         | Get complaints by user               |
| GET    | `/api/complaints/:id`              | Get single complaint with details    |
| POST   | `/api/complaints/:id/support`      | Support an existing complaint        |
| POST   | `/api/complaints/:id/rate`         | Rate and give feedback               |
| GET    | `/api/ratings/cache/:id`           | Get cached average rating            |
| POST   | `/api/ratings/cache/update`        | Update Redis cache (CRON only)       |

---

## 🧼 Notes

- Location is stored as `geometry(Point, 4326)` using PostGIS.
- Images are stored in a `uploads/` directory.
- Tags are stored in a `text[]` array column in PostgreSQL.
- Use PostGIS functions like `ST_DWithin`, `ST_AsGeoJSON` for geo queries.

---