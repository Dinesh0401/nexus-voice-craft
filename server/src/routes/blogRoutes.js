const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0, category } = req.query;

    res.json({
      success: true,
      posts: [],
      total: 0
    });
  } catch (error) {
    console.error('Get Blog Posts Error:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      post: {
        id,
        title: 'Sample Post',
        content: 'Sample content',
        author: 'John Doe',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get Blog Post Error:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const postData = req.body;

    res.json({
      success: true,
      message: 'Blog post created successfully',
      post: { id: Date.now(), ...postData, author: req.user }
    });
  } catch (error) {
    console.error('Create Blog Post Error:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

module.exports = router;
