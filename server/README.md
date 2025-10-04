# Alumni Nexus Backend API

A comprehensive backend API for the Alumni Networking Platform built with Node.js, Express, and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Student and alumni profiles with detailed information
- **Mentorship System**: Request, accept, and manage mentorship relationships
- **Mock Interviews**: Schedule and manage interview practice sessions
- **Events Management**: Create, register, and manage alumni events
- **Forum System**: Discussion categories, posts, and replies
- **Real-time Chat**: WebSocket-based messaging system
- **Blog Platform**: Content management for alumni stories and insights
- **File Uploads**: Image and document upload capabilities
- **Notifications**: Real-time notification system

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js ORM / Supabase
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **AI Integration**: OpenRouter API (Meta Llama 3.2)
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Caching**: Redis
- **Validation**: Joi & express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 12 or higher
- Redis (optional, for caching)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
# Create database
createdb alumni_nexus

# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Alumni Endpoints

#### Get All Alumni
```http
GET /api/v1/alumni?page=1&limit=20&industry=Technology&graduation_year=2020
```

#### Get Featured Alumni
```http
GET /api/v1/alumni/featured
```

#### Create Alumni Profile
```http
POST /api/v1/alumni/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "graduation_year": "2020",
  "degree": "Computer Science",
  "current_role": "Software Engineer",
  "current_company": "Tech Corp",
  "industry": "Technology",
  "location": "San Francisco, CA",
  "willing_to_mentor": true,
  "expertise_tags": ["JavaScript", "React", "Node.js"]
}
```

### Mentorship Endpoints

#### Create Mentorship Request
```http
POST /api/v1/mentorship/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "mentor_id": "uuid-here",
  "message": "I would like to learn about your career path in tech...",
  "goals": ["Learn about software engineering", "Career guidance"]
}
```

#### Get Mentorship Requests
```http
GET /api/v1/mentorship/requests?type=sent&status=pending
Authorization: Bearer <token>
```

#### Respond to Mentorship Request
```http
PUT /api/v1/mentorship/requests/:id/respond
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted",
  "response": "I'd be happy to mentor you!"
}
```

### Events Endpoints

#### Get All Events
```http
GET /api/v1/events?page=1&limit=20&type=workshop&upcoming=true
```

#### Register for Event
```http
POST /api/v1/events/:id/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "dietary_requirements": "Vegetarian",
  "additional_info": "Looking forward to the event!"
}
```

### Forum Endpoints

#### Get Forum Categories
```http
GET /api/v1/forum/categories
```

#### Create Forum Post
```http
POST /api/v1/forum/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "category_id": "uuid-here",
  "title": "Tips for networking with alumni",
  "content": "I'm looking for advice on how to effectively network...",
  "tags": ["networking", "career-advice"]
}
```

## Database Schema

### Key Tables

- **users**: Core user information and authentication
- **alumni_profiles**: Extended profile information for alumni
- **mentorship_requests**: Mentorship relationship requests
- **mentorship_sessions**: Scheduled mentorship sessions
- **mock_interviews**: Mock interview sessions
- **events**: Alumni events and programs
- **event_registrations**: Event registration tracking
- **forum_categories**: Discussion forum categories
- **forum_posts**: Forum discussion posts
- **forum_replies**: Replies to forum posts
- **chat_conversations**: Chat conversation metadata
- **chat_messages**: Individual chat messages
- **notifications**: User notifications

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Security headers
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries

## Real-time Features

The API includes Socket.IO for real-time functionality:

- **Chat Messaging**: Instant messaging between users
- **Typing Indicators**: Real-time typing status
- **Notifications**: Live notification delivery
- **Presence**: User online/offline status

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required",
      "value": ""
    }
  ]
}
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Deployment

### Environment Variables

Ensure all required environment variables are set:

- `NODE_ENV`: production
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Strong secret for JWT signing
- `CLOUDINARY_*`: Cloudinary configuration for file uploads
- `SMTP_*`: Email service configuration

### Production Considerations

1. **Database**: Use connection pooling and read replicas for scale
2. **Caching**: Implement Redis for session storage and caching
3. **Monitoring**: Add application monitoring (e.g., New Relic, DataDog)
4. **Logging**: Structured logging with log aggregation
5. **Load Balancing**: Use multiple server instances behind a load balancer

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.