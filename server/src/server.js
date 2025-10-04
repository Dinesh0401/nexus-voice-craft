
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');

require('dotenv').config();

const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const eventRoutes = require('./routes/eventRoutes');
const forumRoutes = require('./routes/forumRoutes');
const chatRoutes = require('./routes/chatRoutes');
const blogRoutes = require('./routes/blogRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Import services
const NotificationService = require('./services/notificationService');
const PresenceService = require('./services/presenceService');
const cacheService = require('./services/cacheService');

const app = express();
const server = createServer(app);

// Socket.IO setup for real-time features
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'],
    methods: ['GET', 'POST']
  }
});

// Initialize services
const notificationService = new NotificationService(io);
const presenceService = new PresenceService(io);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Make io and services accessible to routes
app.use((req, res, next) => {
  req.io = io;
  req.notificationService = notificationService;
  req.presenceService = presenceService;
  req.cacheService = cacheService;
  next();
});

// Health check endpoint with cache info
app.get('/health', async (req, res) => {
  const onlineUsers = presenceService.getTotalOnlineUsers();
  
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    cache: {
      connected: cacheService.isConnected,
      type: cacheService.client ? 'Redis' : 'Memory'
    },
    realtime: {
      onlineUsers
    }
  });
});

// Performance monitoring endpoint
app.get('/metrics', (req, res) => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  res.json({
    timestamp: new Date().toISOString(),
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)} MB`
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system
    },
    uptime: process.uptime(),
    onlineUsers: presenceService.getTotalOnlineUsers()
  });
});

// API Routes
const apiVersion = process.env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/users`, userRoutes);
app.use(`/api/${apiVersion}/alumni`, alumniRoutes);
app.use(`/api/${apiVersion}/mentorship`, mentorshipRoutes);
app.use(`/api/${apiVersion}/interviews`, interviewRoutes);
app.use(`/api/${apiVersion}/events`, eventRoutes);
app.use(`/api/${apiVersion}/forum`, forumRoutes);
app.use(`/api/${apiVersion}/chat`, chatRoutes);
app.use(`/api/${apiVersion}/blog`, blogRoutes);
app.use(`/api/${apiVersion}/upload`, uploadRoutes);
app.use(`/api/${apiVersion}/notifications`, notificationRoutes);
app.use(`/api/${apiVersion}/search`, searchRoutes);
app.use(`/api/${apiVersion}/ai`, aiRoutes);

// Enhanced Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user authentication and presence
  socket.on('authenticate', async (data) => {
    try {
      const { userId, token } = data;
      // Here you would verify the token
      if (userId) {
        socket.userId = userId;
        await presenceService.userConnected(socket.id, userId);
        
        // Send initial notifications count
        const unreadCount = await notificationService.getUnreadCount(userId);
        socket.emit('unread-notifications-count', unreadCount);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('auth-error', { message: 'Authentication failed' });
    }
  });

  // Join user to their personal room for notifications
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined personal room`);
  });

  // Handle chat room joining
  socket.on('join-chat', (chatId) => {
    socket.join(`chat-${chatId}`);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  // Handle new messages with real-time notifications
  socket.on('send-message', async (data) => {
    try {
      socket.to(`chat-${data.chatId}`).emit('new-message', data);
      
      // Create notifications for other chat participants
      // This would be implemented based on your chat participants logic
      console.log('Message sent:', data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(`chat-${data.chatId}`).emit('user-typing', data);
  });

  socket.on('stop-typing', (data) => {
    socket.to(`chat-${data.chatId}`).emit('user-stop-typing', data);
  });

  // Handle real-time activity feeds
  socket.on('activity-update', (data) => {
    // Broadcast activity updates to relevant users
    io.emit('activity-feed-update', data);
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    await presenceService.userDisconnected(socket.id);
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Metrics: http://localhost:${PORT}/metrics`);
});

module.exports = app;
