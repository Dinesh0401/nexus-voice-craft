# Nexus Voice Craft – AI Backend Scaffold

This branch provides:
- Node.js (Express + MongoDB + JWT auth)
- Flask AI microservice (echo + dummy transcription)
- Docker Compose for API + AI + Mongo

## Structure
backend/              Node.js API
  routes/             Auth + AI proxy
  models/             Mongoose models
  middleware/         (auth middleware)
  config/             db connection helper
  package.json
  Dockerfile
  .env.example

aio_service/
  server.py
  requirements.txt
  Dockerfile

docker-compose.yml

## Quick Start (Local, no Docker)
1. cd backend
2. cp .env.example .env
3. Set MONGO_URI, JWT_SECRET (long random), AI_SERVICE_URL=http://127.0.0.1:5001
4. npm install
5. npm run dev
6. In new terminal:
   cd ../ai_service
   python -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   python server.py

Health:
- API: GET http://localhost:8000/api/health
- AI:  GET http://localhost:5001/health

## Docker
```bash
docker compose up --build
```

Services:
- API:  http://localhost:8000
- AI:   http://localhost:5001
- Mongo: mongodb://localhost:27017

## Auth Endpoints
```http
POST /api/auth/register { name, email, password }
POST /api/auth/login    -> { token, user }
GET  /api/auth/me       (Bearer token)
```

## AI Endpoints (require auth)
```http
POST /api/ai/echo        { text }
POST /api/ai/transcribe  { audioBase64 }
```

## Next Ideas
- Refresh tokens & roles
- Rate limiting & security headers
- OpenAPI docs
- Real STT + intent models
- Observability (logging, metrics, tracing)