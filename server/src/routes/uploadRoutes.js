const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/image', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      url: 'https://via.placeholder.com/400',
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload Image Error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

router.post('/document', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      url: 'https://example.com/document.pdf',
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.error('Upload Document Error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

module.exports = router;
