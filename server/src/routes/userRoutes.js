const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    res.json({
      success: true,
      user: {
        id: userId,
        ...req.user
      }
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: { id: userId, ...updates }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      stats: {
        connections: 0,
        mentorships: 0,
        events: 0,
        posts: 0
      }
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
