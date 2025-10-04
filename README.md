# Alumni Nexus - AI-Powered Alumni Networking Platform

🚀 **Live Demo**: [kiotalumni](https://kiotalumnimeet.netlify.app/)

## 🎯 Quick Start

Get started in 5 minutes! See **[QUICK_START.md](./QUICK_START.md)** for instant setup.

For detailed setup instructions, see **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**

## About Alumni Nexus

Alumni Nexus is a comprehensive, production-ready networking platform that combines modern web technologies with cutting-edge AI capabilities. Connect students with alumni through intelligent recommendations, real-time communication, and personalized career guidance powered by open-source AI.

### ✨ New: AI-Powered Features

- **AI Chat Assistant**: Real-time conversational AI for career guidance
- **Smart Recommendations**: ML-based alumni, mentor, and event suggestions
- **Career Advisor**: Personalized career insights powered by Meta Llama 3.2
- **Profile Analyzer**: AI-driven feedback and optimization
- **Interview Prep**: AI-generated interview questions and tips

## Key Features

- **Mentorship Connections**: Book 1:1 sessions with alumni who are leaders in your field
- **Mock Interviews**: Practice interviews with industry professionals and receive feedback
- **Subject Hubs**: Join specialized communities for your major or area of interest
- **Career Resources**: Access resume reviews, interview prep, and industry insights
- **Networking Events**: Virtual and in-person events to expand your professional circle

## Brand Voice & UX Guidelines

### Core Principles

1. **Clarity & Simplicity**: Direct language, clear steps, no jargon
2. **Warmth & Community**: Friendly, conversational tone emphasizing shared success
3. **Trust & Professionalism**: Highlight credentials and maintain consistent voice
4. **Delight & Engagement**: Micro-interactions and subtle animations for positive feedback
5. **Satisfaction & Feedback**: Clear next steps and positive reinforcement

### Brand Elements

- **Primary Color**: #28a745 (green accent)
- **Typography**: Clean, modern sans-serif (Inter, Montserrat)
- **Iconography**: Simple line icons with accent highlights

### Microcopy Examples

- "Your path to success, together."
- "Join our community of 2,500+ alumni and 10,000+ students"
- "Your data is yours—always encrypted and never shared."

## Technologies Used

### Frontend
- React 18 with TypeScript
- Vite 5.4 (Build tool)
- Tailwind CSS 3.4 + shadcn/ui
- React Router v6
- Framer Motion (Animations)
- Socket.IO Client (Real-time)
- Axios (HTTP Client)

### Backend
- Express.js 4.18
- Node.js 18+
- Supabase (PostgreSQL)
- JWT Authentication
- Socket.IO (WebSocket)
- OpenRouter API (AI Integration)
- Redis (Caching)

### AI Integration
- **Provider**: OpenRouter
- **Model**: Meta Llama 3.2 (3B parameters, FREE)
- **Features**: Chat, recommendations, career advice, profile analysis

## Animation & Interaction Patterns

- Subtle fade-ins for content sections
- Smooth transitions between onboarding steps
- Success toasts with emoji reinforcement
- Hover effects for interactive elements

## Getting Started

### Option 1: Quick Start (Recommended)

```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Configure backend (see QUICK_START.md)
# Edit server/.env with your OpenRouter API key

# Start both servers
./start.sh
```

### Option 2: Manual Setup

**Frontend:**
```bash
npm install
npm run dev
```

**Backend:**
```bash
cd server
npm install
npm run dev
```

### Access the Application

- **Main App**: http://localhost:8080
- **AI Features Demo**: http://localhost:8080/ai-demo
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Architecture & features
- **[server/README.md](./server/README.md)** - Backend API documentation

## 🚀 Production Build

```bash
npm run build
```

Deploy the `dist/` folder to any static hosting service (Vercel, Netlify, etc.)
