# Alumni Nexus - Complete Setup Guide

This guide will help you set up and run the complete Alumni Nexus platform with backend API and AI integration.

## Overview

The Alumni Nexus platform consists of:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js with REST API
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenRouter API with Meta Llama 3.2 (Free Open-Source LLM)
- **Real-time**: Socket.IO for WebSocket connections

## Prerequisites

Before you begin, make sure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier)
- An OpenRouter API key (free tier)

## Part 1: Frontend Setup

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Configure Frontend Environment

The `.env` file is already configured with:
```env
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Run Frontend Development Server

```bash
npm run dev
```

The frontend will be available at http://localhost:8080

## Part 2: Backend Setup

### 1. Navigate to Backend Directory

```bash
cd server
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Configure Backend Environment

Edit `server/.env` file:

```env
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Allow requests from frontend
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# App URL
APP_URL=http://localhost:8080

# OpenRouter API Key - GET YOUR FREE KEY
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Supabase Configuration
SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT for authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

### 4. Get OpenRouter API Key (FREE)

1. Visit https://openrouter.ai
2. Click "Sign Up" (No credit card required)
3. Go to "Keys" section
4. Create a new API key
5. Copy the key and add it to `server/.env` as `OPENROUTER_API_KEY`

**Free Tier Includes:**
- Meta Llama 3.2 (3B parameters) - FREE
- Reasonable rate limits for development
- No credit card required
- Multiple open-source models available

### 5. Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and add it to `server/.env` as `JWT_SECRET`

### 6. Run Backend Server

```bash
npm run dev
```

The backend API will be available at http://localhost:5000

## Part 3: Running the Complete Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```

### Option 2: Use Process Manager (PM2)

Install PM2 globally:
```bash
npm install -g pm2
```

Start both servers:
```bash
# Start backend
cd server
pm2 start src/server.js --name "alumni-backend"

# Start frontend (from root directory)
cd ..
pm2 start npm --name "alumni-frontend" -- run dev
```

View logs:
```bash
pm2 logs
```

Stop all:
```bash
pm2 stop all
```

## Part 4: Accessing the Application

Once both servers are running:

1. **Main Application**: http://localhost:8080
2. **AI Features Demo**: http://localhost:8080/ai-demo
3. **Backend API**: http://localhost:5000
4. **Health Check**: http://localhost:5000/health
5. **API Metrics**: http://localhost:5000/metrics

## Part 5: Testing AI Features

### 1. Navigate to AI Demo Page

Open http://localhost:8080/ai-demo

### 2. Available AI Features

**AI Chat Assistant:**
- Real-time conversational AI
- Career guidance
- Alumni networking advice
- Streaming responses

**Smart Recommendations:**
- AI-powered alumni connections
- Mentor suggestions
- Event recommendations

**Career Advisor:**
- Personalized career advice
- Industry insights
- Skill development guidance

**Profile Analyzer:**
- AI-driven profile feedback
- Improvement suggestions
- Optimization tips

### 3. Example API Calls

**AI Chat:**
```bash
curl -X POST http://localhost:5000/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "How do I transition to a tech career?"}
    ]
  }'
```

**Career Advice:**
```bash
curl -X POST http://localhost:5000/api/v1/ai/career-advice \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What skills do I need for AI/ML roles?",
    "userContext": {
      "currentRole": "Student",
      "interests": ["AI", "Machine Learning"]
    }
  }'
```

## Part 6: Key Features

### Frontend Features
- Responsive design with Tailwind CSS
- Real-time chat with WebSocket
- AI-powered recommendations
- Alumni directory and profiles
- Event management
- Forum discussions
- Mentorship program
- Mock interview system

### Backend Features
- RESTful API with Express.js
- JWT authentication
- WebSocket real-time communication
- AI integration with OpenRouter
- Redis caching (optional)
- Rate limiting
- Input validation
- Comprehensive error handling

### AI Capabilities
- **Conversational AI**: Natural language interactions
- **Recommendations**: Personalized suggestions using ML
- **Career Guidance**: Industry-specific advice
- **Profile Analysis**: AI-driven feedback
- **Smart Search**: Intelligent query understanding
- **Interview Prep**: AI-generated questions
- **Networking**: Icebreaker suggestions

## Part 7: API Documentation

### Core Endpoints

**Authentication:**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile

**AI Services:**
- `POST /api/v1/ai/chat` - AI chat (with streaming support)
- `POST /api/v1/ai/recommendations/alumni` - Alumni recommendations
- `POST /api/v1/ai/recommendations/mentors` - Mentor suggestions
- `POST /api/v1/ai/recommendations/events` - Event recommendations
- `POST /api/v1/ai/career-advice` - Career guidance
- `POST /api/v1/ai/interview-prep` - Interview preparation
- `POST /api/v1/ai/profile/analyze` - Profile analysis
- `POST /api/v1/ai/search/smart` - Smart search

**Alumni:**
- `GET /api/v1/alumni` - Get all alumni
- `GET /api/v1/alumni/:id` - Get alumni by ID
- `GET /api/v1/alumni/search` - Search alumni

**Events:**
- `GET /api/v1/events` - Get all events
- `POST /api/v1/events/:id/register` - Register for event

**Forum:**
- `GET /api/v1/forum/categories` - Get categories
- `GET /api/v1/forum/posts` - Get posts
- `POST /api/v1/forum/posts` - Create post

## Part 8: Troubleshooting

### Frontend Issues

**Port already in use:**
```bash
# Kill process on port 8080
npx kill-port 8080
```

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Issues

**Port 5000 in use:**
```bash
# Change PORT in server/.env to 5001 or another port
# Update VITE_API_BASE_URL in frontend .env
```

**AI not working:**
1. Verify OpenRouter API key is correct
2. Check internet connection
3. Review API rate limits on OpenRouter dashboard

**Database connection issues:**
1. Verify Supabase URL and keys
2. Check Supabase dashboard for service status

### Common Errors

**CORS Error:**
- Ensure backend ALLOWED_ORIGINS includes frontend URL
- Check both servers are running

**WebSocket Connection Failed:**
- Verify Socket.IO server is running
- Check VITE_SOCKET_URL matches backend URL

**AI Timeout:**
- OpenRouter free tier may have rate limits
- Check API key is valid
- Ensure stable internet connection

## Part 9: Production Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build for production
npm run build

# Deploy dist/ folder to hosting service
```

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables in hosting dashboard
2. Ensure all required secrets are configured
3. Set `NODE_ENV=production`
4. Deploy from GitHub repository

### Environment Variables for Production

Update these for production:
- Use production Supabase instance
- Set secure JWT_SECRET
- Configure production CORS origins
- Set up Redis for caching
- Add monitoring and logging

## Part 10: Development Tips

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Hot Reload
Both frontend and backend support hot reload in development mode.

### Debugging
- Frontend: Use React DevTools browser extension
- Backend: Use Node.js debugger or console.log
- Network: Use browser DevTools Network tab

## Support

For issues or questions:
1. Check console logs (both frontend and backend)
2. Review API responses in Network tab
3. Verify environment variables are set correctly
4. Check OpenRouter dashboard for API usage

## Next Steps

1. Customize the AI prompts for your use case
2. Add authentication to protect AI endpoints
3. Implement user profiles
4. Add more AI features
5. Set up monitoring and analytics
6. Deploy to production

---

**Congratulations!** You now have a fully functional AI-powered alumni networking platform with real-time features and open-source LLM integration.

For more information, see:
- Frontend README: `/README.md`
- Backend README: `/server/README.md`
- OpenRouter Docs: https://openrouter.ai/docs
