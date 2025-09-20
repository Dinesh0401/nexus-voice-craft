const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Connect DB
connectDB(process.env.MONGO_URI);

// Health Endpoint
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'api', time: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
