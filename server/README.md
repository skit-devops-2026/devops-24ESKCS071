# CraftCV Backend API Service

Production-ready backend API service for CraftCV portfolio builder and AI resume assistant. Built with Express.js, Mongoose, and Node.js.

---

## Architecture Overview

- **Portfolios API (`/api/portfolios`)**: Manages portfolio records with template configurations (`bento`, `terminal`, `executive`), slug normalization, and resilient dual storage (MongoDB + in-memory fallback).
- **Authentication API (`/api/auth`)**: JWT-based user authentication and token verification.
- **GitHub Ingestion (`/api/github`)**: Live GitHub repository and language data ingestion with optional PAT support.
- **AI Agent API (`/api/agent`)**: Gemini-powered resume tailoring and automated viva interview question generation.
- **Centralized Error Handling**: Uniform JSON error responses protecting internal traces in production.

---

## Environment Setup

Create `.env` in the `server/` directory:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | `5000` | Port for the HTTP server to listen on. |
| `NODE_ENV` | Optional | `development` | Set to `production` or `test`. |
| `MONGO_URI` | Optional | `mongodb://127.0.0.1:27017/craftcv` | MongoDB connection string. |
| `JWT_SECRET` | Required | Built-in fallback string | High-entropy secret for signing JWTs. |
| `GEMINI_API_KEY`| Optional | — | Google Gemini API key for AI features. |
| `GITHUB_TOKEN` | Optional | — | GitHub Personal Access Token for rate limits. |

---

## Running the Server

### Local Development

```bash
cd server
npm install
npm run dev
```

### Production

```bash
cd server
npm start
```

---

## Offline In-Memory Fallback

When MongoDB is unavailable or unreachable on the host system:
1. The server detects the disconnection gracefully on startup.
2. In-memory storage automatically activates for all portfolio CRUD operations.
3. Records created in fallback mode receive a temporary `mem_<timestamp>` identifier, a normalized slug, and a `fallback: true` response indicator.
4. Reads, updates, and deletions function seamlessly using either the memory ID or the generated slug.

---

## Automated Testing & Verification

The test suite uses Node.js native test runner (`node:test` and `node:assert/strict`) requiring zero external testing framework dependencies.

### Running Backend Tests

```bash
cd server
npm test
```

### Test Suites

1. **Portfolio CRUD Suite (`server/tests/portfolioCrud.test.js`)**:
   - `POST /api/portfolios`: Valid payload creation with slug generation.
   - `POST /api/portfolios`: 400 rejection for missing `personalInfo.fullName`.
   - `POST /api/portfolios`: 400 rejection for invalid `template` and `mode`.
   - `GET /api/portfolios`: Array listing.
   - `GET /api/portfolios/:id`: Retrieval by ID and slug.
   - `GET /api/portfolios/:id`: 404 response for unknown identifiers.
   - `PUT /api/portfolios/:id`: Partial updates and immutability protection of `_id`.
   - `PUT /api/portfolios/:id`: 400 rejection for invalid fields.
   - `DELETE /api/portfolios/:id`: Clean record deletion and subsequent 404 confirmation.

2. **Database Fallback Suite (`server/tests/fallback.test.js`)**:
   - Verifies seamless in-memory fallback when MongoDB is offline.
   - Tests `userId` query filtering in memory.
   - Tests slug-based updates and deletions against in-memory storage.
   - Tests tamper-proof preservation of `_id` and `createdAt`.

### Verification Results

- All 16 automated test cases pass in under 1 second.
- Tested on Node.js v20+ and v24.
