const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      interviews: []
    });
  } catch (error) {
    console.error('Get Interviews Error:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const interviewData = req.body;

    res.json({
      success: true,
      message: 'Interview scheduled successfully',
      interview: { id: Date.now(), ...interviewData }
    });
  } catch (error) {
    console.error('Create Interview Error:', error);
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
});

module.exports = router;
