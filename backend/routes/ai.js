const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

router.post('/echo', auth, async (req, res) => {
  try {
    const { data } = await axios.post(`${process.env.AI_SERVICE_URL}/nlp/echo`, req.body);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

router.post('/transcribe', auth, async (req, res) => {
  try {
    const { data } = await axios.post(`${process.env.AI_SERVICE_URL}/voice/transcribe`, req.body);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

module.exports = router;