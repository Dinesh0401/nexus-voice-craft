const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/categories', async (req, res) => {
  try {
    res.json({
      success: true,
      categories: [
        { id: 1, name: 'Career Advice', posts: 45 },
        { id: 2, name: 'Networking', posts: 32 },
        { id: 3, name: 'Job Opportunities', posts: 28 },
        { id: 4, name: 'Mentorship', posts: 19 }
      ]
    });
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/posts', async (req, res) => {
  try {
    const { category, limit = 10, offset = 0 } = req.query;

    res.json({
      success: true,
      posts: [],
      total: 0
    });
  } catch (error) {
    console.error('Get Posts Error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const postData = req.body;

    res.json({
      success: true,
      message: 'Post created successfully',
      post: { id: Date.now(), ...postData, author: req.user }
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

module.exports = router;
