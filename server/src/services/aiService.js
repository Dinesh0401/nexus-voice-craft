const axios = require('axios');

class AIService {
  constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.defaultModel = 'meta-llama/llama-3.2-3b-instruct:free';
  }

  async generateChatResponse(messages, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: options.model || this.defaultModel,
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 500,
          top_p: options.topP || 0.9,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openRouterApiKey}`,
            'HTTP-Referer': process.env.APP_URL || 'http://localhost:8080',
            'X-Title': 'Alumni Nexus Platform',
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error.response?.data || error.message);

      return this.getFallbackResponse(messages);
    }
  }

  async generateAlumniRecommendations(userProfile, alumni) {
    const messages = [
      {
        role: 'system',
        content: 'You are an AI assistant specialized in alumni networking. Analyze user profiles and recommend the best alumni connections based on career interests, skills, and goals.',
      },
      {
        role: 'user',
        content: `User Profile: ${JSON.stringify(userProfile)}
Alumni List: ${JSON.stringify(alumni)}

Recommend the top 5 alumni connections with brief reasons why each connection would be valuable.`,
      },
    ];

    return await this.generateChatResponse(messages, { maxTokens: 800 });
  }

  async generateMentorshipSuggestions(studentProfile, mentors) {
    const messages = [
      {
        role: 'system',
        content: 'You are a career counseling AI. Match students with mentors based on career aspirations, skills gaps, and mentor expertise.',
      },
      {
        role: 'user',
        content: `Student Profile: ${JSON.stringify(studentProfile)}
Available Mentors: ${JSON.stringify(mentors)}

Suggest the top 3 mentors and explain how each can help the student's career growth.`,
      },
    ];

    return await this.generateChatResponse(messages, { maxTokens: 600 });
  }

  async generateCareerAdvice(userQuery, userContext) {
    const messages = [
      {
        role: 'system',
        content: 'You are a professional career advisor with expertise in various industries. Provide actionable, personalized career advice.',
      },
      {
        role: 'user',
        content: `User Context: ${JSON.stringify(userContext)}
Question: ${userQuery}

Provide specific, actionable career advice.`,
      },
    ];

    return await this.generateChatResponse(messages);
  }

  async generateEventRecommendations(userProfile, events) {
    const messages = [
      {
        role: 'system',
        content: 'You are an event recommendation AI. Suggest events that align with user interests and career goals.',
      },
      {
        role: 'user',
        content: `User Profile: ${JSON.stringify(userProfile)}
Upcoming Events: ${JSON.stringify(events)}

Recommend the most relevant events and explain why each would be beneficial.`,
      },
    ];

    return await this.generateChatResponse(messages, { maxTokens: 600 });
  }

  async generateInterviewQuestions(jobRole, experience) {
    const messages = [
      {
        role: 'system',
        content: 'You are an interview preparation expert. Generate relevant interview questions based on job role and experience level.',
      },
      {
        role: 'user',
        content: `Job Role: ${jobRole}
Experience Level: ${experience}

Generate 5 technical and 5 behavioral interview questions with sample answers.`,
      },
    ];

    return await this.generateChatResponse(messages, { maxTokens: 1000 });
  }

  async generateNetworkingIceBreakers(user1Profile, user2Profile) {
    const messages = [
      {
        role: 'system',
        content: 'You are a networking coach. Generate conversation starters that help professionals connect meaningfully.',
      },
      {
        role: 'user',
        content: `Person 1: ${JSON.stringify(user1Profile)}
Person 2: ${JSON.stringify(user2Profile)}

Generate 3 conversation starters that highlight common interests or potential collaboration opportunities.`,
      },
    ];

    return await this.generateChatResponse(messages, { maxTokens: 400 });
  }

  async analyzeProfile(profileData) {
    const messages = [
      {
        role: 'system',
        content: 'You are a professional profile analyst. Provide constructive feedback to improve professional profiles.',
      },
      {
        role: 'user',
        content: `Profile: ${JSON.stringify(profileData)}

Analyze this profile and provide:
1. Strengths (2-3 points)
2. Areas for improvement (2-3 points)
3. Specific actionable suggestions`,
      },
    ];

    return await this.generateChatResponse(messages, { maxTokens: 600 });
  }

  async generateSmartSearch(query, context) {
    const messages = [
      {
        role: 'system',
        content: 'You are a search assistant. Understand user intent and provide relevant results with explanations.',
      },
      {
        role: 'user',
        content: `Search Query: ${query}
Context: ${JSON.stringify(context)}

Interpret the search intent and suggest relevant filters or refine the search query.`,
      },
    ];

    return await this.generateChatResponse(messages, { maxTokens: 300 });
  }

  getFallbackResponse(messages) {
    const lastMessage = messages[messages.length - 1].content;

    if (lastMessage.toLowerCase().includes('recommend')) {
      return 'I can help you find relevant connections. Please ensure your profile is complete for better recommendations.';
    } else if (lastMessage.toLowerCase().includes('career')) {
      return 'Career development is a journey. Consider connecting with alumni in your field of interest for personalized advice.';
    } else if (lastMessage.toLowerCase().includes('mentor')) {
      return 'Finding the right mentor is crucial. Browse our mentorship section to find experienced professionals in your area of interest.';
    } else {
      return 'I\'m here to help you navigate your professional journey. How can I assist you today?';
    }
  }

  async streamChatResponse(messages, onChunk, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: options.model || this.defaultModel,
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 500,
          stream: true,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openRouterApiKey}`,
            'HTTP-Referer': process.env.APP_URL || 'http://localhost:8080',
            'X-Title': 'Alumni Nexus Platform',
            'Content-Type': 'application/json',
          },
          responseType: 'stream',
        }
      );

      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
            }
          }
        }
      });

      return new Promise((resolve) => {
        response.data.on('end', () => resolve());
      });
    } catch (error) {
      console.error('Streaming Error:', error.message);
      onChunk(this.getFallbackResponse(messages));
    }
  }
}

module.exports = new AIService();
