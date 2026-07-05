# � URL Shortener Service

A modern and practical URL shortener built with Node.js, Express, PostgreSQL, Drizzle ORM, and JWT authentication. This project is designed to be lightweight, secure, and developer-friendly while also serving as a strong portfolio-ready backend service.

---

## ✨ What makes this project impressive

This service goes beyond a basic shortener by combining:

- Secure user authentication with JWT
- Password hashing and salted storage
- Input validation using Zod
- Custom short-code support
- Protected personal URL management
- Dockerized PostgreSQL for easy local setup
- Clean modular architecture with routes, services, models, and middleware

---

## 🚀 Features

- Create short URLs from long links
- Generate random short codes automatically with Nano ID
- Allow users to choose their own custom short code
- Register and log in users securely
- Protect private routes with JWT-based authentication
- List all URLs created by the logged-in user
- Delete links owned by the authenticated user
- Redirect short codes to their original destinations
- Use PostgreSQL via Docker for reliable local development

---

## 🛠 Tech Stack

| Category | Technology | Purpose |
| --- | --- | --- |
| Backend | Node.js + Express | REST API development |
| Database | PostgreSQL | Persistent storage |
| ORM | Drizzle ORM | Type-safe SQL and schema management |
| Authentication | JWT | Secure user sessions |
| Validation | Zod | Request body validation |
| Password Security | Custom hashing utilities | Safer user credential handling |
| Containerization | Docker Compose | Easy PostgreSQL setup |
| ID Generation | Nano ID | Short and unique URL codes |

---

## 📁 Project Structure

```bash
├── db/                  # Database connection setup
├── middlewares/         # Auth middleware
├── models/              # Drizzle table definitions
├── routes/              # Express route handlers
├── services/            # Business logic
├── utils/               # Token and hashing helpers
├── validations/         # Zod validation schemas
├── index.js             # App entry point
├── docker-compose.yml   # PostgreSQL container config
└── package.json         # Scripts and dependencies
```

---

## ✅ Prerequisites

Make sure you have the following installed:

- Node.js 18+
- Docker Desktop
- Postman or Insomnia (optional for testing)
- VS Code or any modern code editor

---

## ⚙️ Setup Instructions

1. Install dependencies

```bash
npm install
```

2. Create a environment file

Create a .env file in the project root with values like:

```env
PORT=8000
DATABASE_URL=postgres://postgres:admin@localhost:5433/postgres
JWT_SECRET_KEY=your_super_secret_key
```

3. Start the PostgreSQL container

```bash
docker compose up -d
```

4. Push the Drizzle schema to the database

```bash
npm run db:push
```

5. Start the server

```bash
npm run dev
```

The app should now be running on http://localhost:8000.

---

## 🗄 Database Notes

- PostgreSQL runs locally through Docker on port 5433
- The database is initialized and managed using Drizzle ORM
- You can inspect the database with:

```bash
npm run db:studio
```

---

## 🌐 API Endpoints

### Auth Routes

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | /user/signup | Register a new user | No |
| POST | /user/login | Login and receive a JWT | No |

### URL Routes

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | /shorten | Create a short URL | Yes |
| GET | /codes | Get all URLs owned by the authenticated user | Yes |
| DELETE | /:id | Delete a URL by ID | Yes |
| GET | /:shortCode | Redirect to the original target URL | No |

---

## 🧪 Example Requests

### Register a user

```bash
curl -X POST http://localhost:8000/user/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"secret123"}'
```

### Login

```bash
curl -X POST http://localhost:8000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'
```

### Create a short URL

```bash
curl -X POST http://localhost:8000/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"url":"https://example.com","code":"demo123"}'
```

---

## 🔐 Security Highlights

- Passwords are hashed before being stored
- JWTs are used to protect private routes
- Request validation ensures malformed input is rejected early
- Each URL is tied to the authenticated user for ownership-based access

---

## 💡 Developer Notes

This project is a strong example of a production-style backend service structure with:

- clear separation of concerns
- reusable services
- schema-driven database design
- clean route organization
- easy extension for analytics, expiration dates, or QR codes in the future

If you want, this project can be expanded into a full SaaS-style link management platform with dashboards, analytics, and admin controls.
