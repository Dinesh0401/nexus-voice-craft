const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { messages, options } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await aiService.generateChatResponse(messages, options);

    res.json({ response, success: true });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

router.post('/chat/stream', authMiddleware, async (req, res) => {
  try {
    const { messages, options } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await aiService.streamChatResponse(
      messages,
      (chunk) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      },
      options
    );

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('AI Stream Error:', error);
    res.status(500).json({ error: 'Failed to stream response' });
  }
});

router.post('/recommendations/alumni', authMiddleware, async (req, res) => {
  try {
    const { userProfile, alumni } = req.body;

    const recommendations = await aiService.generateAlumniRecommendations(
      userProfile,
      alumni
    );

    res.json({ recommendations, success: true });
  } catch (error) {
    console.error('Alumni Recommendations Error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

router.post('/recommendations/mentors', authMiddleware, async (req, res) => {
  try {
    const { studentProfile, mentors } = req.body;

    const suggestions = await aiService.generateMentorshipSuggestions(
      studentProfile,
      mentors
    );

    res.json({ suggestions, success: true });
  } catch (error) {
    console.error('Mentor Suggestions Error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

router.post('/recommendations/events', authMiddleware, async (req, res) => {
  try {
    const { userProfile, events } = req.body;

    const recommendations = await aiService.generateEventRecommendations(
      userProfile,
      events
    );

    res.json({ recommendations, success: true });
  } catch (error) {
    console.error('Event Recommendations Error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

router.post('/career-advice', authMiddleware, async (req, res) => {
  try {
    const { query, userContext } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const advice = await aiService.generateCareerAdvice(query, userContext);

    res.json({ advice, success: true });
  } catch (error) {
    console.error('Career Advice Error:', error);
    res.status(500).json({ error: 'Failed to generate advice' });
  }
});

router.post('/interview-prep', authMiddleware, async (req, res) => {
  try {
    const { jobRole, experience } = req.body;

    if (!jobRole || !experience) {
      return res.status(400).json({ error: 'Job role and experience are required' });
    }

    const questions = await aiService.generateInterviewQuestions(jobRole, experience);

    res.json({ questions, success: true });
  } catch (error) {
    console.error('Interview Prep Error:', error);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
});

router.post('/networking/icebreakers', authMiddleware, async (req, res) => {
  try {
    const { user1Profile, user2Profile } = req.body;

    const icebreakers = await aiService.generateNetworkingIceBreakers(
      user1Profile,
      user2Profile
    );

    res.json({ icebreakers, success: true });
  } catch (error) {
    console.error('Icebreakers Error:', error);
    res.status(500).json({ error: 'Failed to generate icebreakers' });
  }
});

router.post('/profile/analyze', authMiddleware, async (req, res) => {
  try {
    const { profileData } = req.body;

    if (!profileData) {
      return res.status(400).json({ error: 'Profile data is required' });
    }

    const analysis = await aiService.analyzeProfile(profileData);

    res.json({ analysis, success: true });
  } catch (error) {
    console.error('Profile Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze profile' });
  }
});

router.post('/search/smart', authMiddleware, async (req, res) => {
  try {
    const { query, context } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchResult = await aiService.generateSmartSearch(query, context);

    res.json({ result: searchResult, success: true });
  } catch (error) {
    console.error('Smart Search Error:', error);
    res.status(500).json({ error: 'Failed to process search' });
  }
});

module.exports = router;
