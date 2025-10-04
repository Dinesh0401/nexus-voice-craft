# Quick Start Guide

Get Alumni Nexus running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- OpenRouter API key (free from https://openrouter.ai)

## Setup Steps

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Backend

Edit `server/.env`:

```env
# Get free API key from https://openrouter.ai
OPENROUTER_API_KEY=your_key_here

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_jwt_secret_here
```

### 3. Start Application

**Option A - Use Start Script (Recommended):**
```bash
./start.sh
```

**Option B - Manual Start:**
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 4. Access Application

- **Main App**: http://localhost:8080
- **AI Features**: http://localhost:8080/ai-demo
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## What You Get

✅ **Complete Alumni Networking Platform**
- Real-time chat with WebSocket
- AI-powered recommendations
- Career guidance system
- Event management
- Forum discussions
- Mentorship program
- Mock interviews

✅ **Open-Source AI Integration**
- Meta Llama 3.2 (FREE)
- Conversational AI assistant
- Smart recommendations
- Profile analysis
- Interview preparation

✅ **Production-Ready Backend**
- RESTful API with 40+ endpoints
- JWT authentication
- Real-time WebSocket server
- Redis caching support
- Rate limiting
- Comprehensive error handling

## Key Features

### AI-Powered
- **AI Chat**: Real-time conversational assistant
- **Smart Recommendations**: ML-based alumni/mentor/event suggestions
- **Career Advisor**: Personalized career guidance
- **Profile Analyzer**: AI-driven feedback
- **Smart Search**: Intelligent query processing

### Real-time
- **Live Chat**: WebSocket messaging
- **Typing Indicators**: Real-time status
- **Notifications**: Instant updates
- **Online Presence**: User availability

### Professional
- **Clean Design**: Modern, responsive UI
- **Type Safety**: TypeScript throughout
- **Secure**: JWT auth, rate limiting, input validation
- **Scalable**: Horizontal scaling ready
- **Well-Documented**: Comprehensive docs

## Testing AI Features

Navigate to http://localhost:8080/ai-demo

Try these prompts:
- "Help me find alumni in the technology sector"
- "I need career advice for transitioning to data science"
- "How do I prepare for software engineering interviews?"
- "Connect me with mentors in AI/ML"

## API Examples

**AI Chat:**
```bash
curl -X POST http://localhost:5000/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "How do I network effectively?"}
    ]
  }'
```

**Career Advice:**
```bash
curl -X POST http://localhost:5000/api/v1/ai/career-advice \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What skills for data science?",
    "userContext": {"currentRole": "Student"}
  }'
```

## Troubleshooting

**Port 8080 in use:**
```bash
npx kill-port 8080
```

**AI not responding:**
1. Check OpenRouter API key in `server/.env`
2. Verify internet connection
3. Check backend logs for errors

**Backend not starting:**
1. Ensure all dependencies installed: `cd server && npm install`
2. Check `.env` file exists in server directory
3. Verify JWT_SECRET is set

## Project Structure

```
alumni-nexus/
├── src/                    # Frontend React app
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── services/          # API & WebSocket services
│   └── hooks/             # Custom React hooks
├── server/                # Backend Express.js
│   └── src/
│       ├── routes/        # API routes
│       ├── services/      # Business logic
│       └── middleware/    # Express middleware
├── .env                   # Frontend config
├── server/.env           # Backend config (create this!)
└── start.sh              # Quick start script
```

## Next Steps

1. **Explore the App**: Browse all features at http://localhost:8080
2. **Try AI Features**: Visit http://localhost:8080/ai-demo
3. **Check API**: Review http://localhost:5000/health
4. **Read Docs**: See `SETUP_GUIDE.md` for detailed documentation
5. **Customize**: Modify AI prompts in `server/src/services/aiService.js`

## Deployment

**Free Hosting Options:**
- Frontend: Vercel, Netlify
- Backend: Railway, Render, Heroku
- Database: Supabase (included)
- Cache: Upstash Redis

**Build for Production:**
```bash
npm run build
```

## Key Technologies

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenRouter (Meta Llama 3.2 - FREE)
- **Real-time**: Socket.IO
- **Cache**: Redis (optional)

## Getting Help

1. Check console logs (browser & terminal)
2. Review error messages
3. Verify environment variables
4. See full docs in `SETUP_GUIDE.md`

## Documentation

- 📖 **Setup Guide**: `SETUP_GUIDE.md` - Complete setup instructions
- 📋 **Project Overview**: `PROJECT_OVERVIEW.md` - Architecture & features
- 🔧 **Backend Docs**: `server/README.md` - API documentation
- 📝 **Frontend Docs**: `README.md` - Frontend details

---

**That's it!** You now have a fully functional AI-powered alumni networking platform running locally.

🎉 **Happy coding!**
