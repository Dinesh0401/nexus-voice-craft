# Complete Website Rework Implementation Plan

## Overview
This plan addresses all critical issues identified in the Alumni Nexus platform, starting with database schema and backend infrastructure, then moving to frontend improvements.

---

## Phase 1: Database Schema & Backend Foundation (Week 1-2)

### 1.1 Core Tables Setup

#### Alumni Profiles Extension
```sql
-- Extend profiles table with alumni-specific fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  graduation_year INTEGER,
  major TEXT,
  current_company TEXT,
  current_position TEXT,
  industry TEXT,
  location TEXT,
  linkedin_url TEXT,
  willing_to_mentor BOOLEAN DEFAULT false,
  skills TEXT[],
  interests TEXT[];
```

#### Events System
```sql
-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('workshop', 'networking', 'webinar', 'social', 'career_fair')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  virtual_link TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  image_url TEXT,
  organizer_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event registrations
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  attendance_status TEXT DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'cancelled', 'no_show')),
  UNIQUE(event_id, user_id)
);
```

#### Mentorship System
```sql
-- Mentorship requests
CREATE TABLE mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
  request_message TEXT,
  response_message TEXT,
  areas_of_interest TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mentee_id, mentor_id)
);

-- Mentorship sessions
CREATE TABLE mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentorship_request_id UUID REFERENCES mentorship_requests(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_link TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Forum System
```sql
-- Forum categories (already exists in migrations)
-- Forum posts (already exists in migrations)
-- Forum replies (already exists in migrations)

-- Add reactions to posts
CREATE TABLE post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'helpful', 'insightful')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- Add bookmarks
CREATE TABLE post_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
```

#### Mock Interviews System
```sql
-- Mock interview requests
CREATE TABLE mock_interview_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES profiles(id),
  job_role TEXT NOT NULL,
  company_name TEXT,
  interview_type TEXT CHECK (interview_type IN ('technical', 'behavioral', 'case', 'system_design')),
  preferred_dates TIMESTAMPTZ[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mock interview sessions
CREATE TABLE mock_interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES mock_interview_requests(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_link TEXT,
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  strengths TEXT[],
  areas_for_improvement TEXT[],
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### User Roles System (SECURITY CRITICAL)
```sql
-- Create role enum
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'alumni', 'student');

-- User roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES profiles(id),
  UNIQUE(user_id, role)
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT has_role(_user_id, 'admin'::app_role)
$$;
```

### 1.2 Row Level Security (RLS) Policies

#### Profiles RLS
```sql
-- Already has basic RLS, keep existing policies
```

#### Events RLS
```sql
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Everyone can view public events
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Authenticated users can create events
CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

-- Organizers can update their events
CREATE POLICY "Organizers can update their events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id);

-- Admins can delete events
CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));
```

#### Event Registrations RLS
```sql
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Users can view their own registrations
CREATE POLICY "Users can view own registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Users can register for events
CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can cancel their registrations
CREATE POLICY "Users can cancel own registrations"
  ON event_registrations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

#### Mentorship RLS
```sql
ALTER TABLE mentorship_requests ENABLE ROW LEVEL SECURITY;

-- Users can view requests they're part of
CREATE POLICY "Users can view own mentorship requests"
  ON mentorship_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = mentee_id OR auth.uid() = mentor_id);

-- Mentees can create requests
CREATE POLICY "Mentees can create requests"
  ON mentorship_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = mentee_id);

-- Mentors can update request status
CREATE POLICY "Mentors can update request status"
  ON mentorship_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = mentor_id);

-- Similar policies for mentorship_sessions
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
-- (Add similar policies based on mentorship_requests)
```

#### Forum RLS
```sql
-- Forum posts already have RLS from migrations
-- Add RLS for reactions and bookmarks

ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all reactions"
  ON post_reactions FOR SELECT
  USING (true);

CREATE POLICY "Users can add own reactions"
  ON post_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON post_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Similar for post_bookmarks
ALTER TABLE post_bookmarks ENABLE ROW LEVEL SECURITY;
-- (Add similar policies)
```

#### Mock Interviews RLS
```sql
ALTER TABLE mock_interview_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interview requests"
  ON mock_interview_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = interviewer_id);

CREATE POLICY "Students can create interview requests"
  ON mock_interview_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- Similar for mock_interview_sessions
ALTER TABLE mock_interview_sessions ENABLE ROW LEVEL SECURITY;
-- (Add similar policies)
```

### 1.3 Database Functions & Triggers

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_mentorship_requests_updated_at
  BEFORE UPDATE ON mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to increment event attendees
CREATE OR REPLACE FUNCTION increment_event_attendees()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events
  SET current_attendees = current_attendees + 1
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_attendees_on_registration
  AFTER INSERT ON event_registrations
  FOR EACH ROW EXECUTE FUNCTION increment_event_attendees();

-- Function to decrement event attendees
CREATE OR REPLACE FUNCTION decrement_event_attendees()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events
  SET current_attendees = current_attendees - 1
  WHERE id = OLD.event_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_attendees_on_cancellation
  AFTER DELETE ON event_registrations
  FOR EACH ROW EXECUTE FUNCTION decrement_event_attendees();
```

---

## Phase 2: Edge Functions & API Layer (Week 2-3)

### 2.1 Event Management Functions

**`supabase/functions/events/index.ts`**
- GET `/events` - List events with filters (date, type, status)
- POST `/events` - Create new event (authenticated)
- PUT `/events/:id` - Update event (organizer only)
- DELETE `/events/:id` - Cancel event (admin only)

**`supabase/functions/event-registration/index.ts`**
- POST `/event-registration` - Register for event
- DELETE `/event-registration/:id` - Cancel registration
- GET `/event-registration/my-events` - Get user's registered events

### 2.2 Mentorship Functions

**`supabase/functions/mentorship/index.ts`**
- POST `/mentorship/request` - Create mentorship request
- PUT `/mentorship/request/:id` - Update request status (accept/decline)
- POST `/mentorship/session` - Schedule session
- GET `/mentorship/my-requests` - Get user's mentorship requests (as mentee/mentor)

### 2.3 Mock Interview Functions

**`supabase/functions/mock-interviews/index.ts`**
- POST `/mock-interviews/request` - Create interview request
- PUT `/mock-interviews/request/:id/assign` - Assign interviewer
- POST `/mock-interviews/session` - Schedule session
- PUT `/mock-interviews/session/:id/feedback` - Submit feedback

### 2.4 Forum Functions

**`supabase/functions/forum/index.ts`**
- POST `/forum/posts/:id/react` - Add reaction to post
- POST `/forum/posts/:id/bookmark` - Bookmark post
- GET `/forum/trending` - Get trending posts
- GET `/forum/bookmarks` - Get user's bookmarked posts

### 2.5 Dashboard Analytics Function

**`supabase/functions/dashboard-stats/index.ts`**
- GET `/dashboard-stats` - Get real dashboard metrics
  - Total connections count
  - Upcoming events count
  - Active mentorship sessions
  - Forum activity stats
  - Recent achievements

### 2.6 Connection Recommendations

**`supabase/functions/recommendations/index.ts`**
- GET `/recommendations/alumni` - Get recommended alumni based on:
  - Shared interests
  - Industry match
  - Skills alignment
  - Location proximity

---

## Phase 3: Frontend Fixes & Improvements (Week 3-4)

### 3.1 Critical Style Fixes

**Files to fix:**
1. `src/components/Events.tsx`
   - Remove `mx-0 px-0 my-0 py-0` classes
   - Add proper spacing: `py-16 px-4`
   - Fix responsive grid layout
   - Add proper card padding

2. `src/index.css`
   - Already improved, ensure consistency
   - Verify all color tokens are used

3. `src/components/Header.tsx`
   - Already improved
   - Test notification dropdown
   - Fix mobile menu

### 3.2 Remove Mock Data & Connect Real APIs

**Priority files:**

1. **`src/components/Events.tsx`**
   - Remove hardcoded events array
   - Create `useEvents` hook with Supabase query
   - Add loading/error states
   - Connect registration button to real API

2. **`src/components/AIPersonalizedConnections.tsx`**
   - Remove `getRecommendedAlumni` mock function
   - Create `useRecommendedAlumni` hook
   - Connect to recommendations API
   - Fix carousel speed (change from 1s to 3s)

3. **`src/pages/dashboard/index.tsx`**
   - Remove hardcoded metrics
   - Create `useDashboardStats` hook
   - Fetch real data from dashboard-stats API
   - Add real-time updates

4. **`src/pages/forum/index.tsx`** & related
   - Remove mock data
   - Connect to real forum posts from database
   - Add pagination
   - Connect reactions/bookmarks

5. **`src/pages/mentorship/index.tsx`**
   - Connect to real mentorship requests
   - Add booking flow
   - Integrate with mentorship API

6. **`src/pages/chat/index.tsx`**
   - Already has some Supabase integration
   - Ensure real-time updates work
   - Add file upload functionality
   - Add typing indicators

### 3.3 Code Cleanup

**For each component:**
1. Remove unused imports (LoadingCard, TextReveal, etc. from Index.tsx)
2. Replace `any` types with proper TypeScript interfaces
3. Add proper error boundaries
4. Add loading skeletons
5. Add empty states

**Create new hooks in `src/hooks/`:**
- `useEvents.ts` - Event management
- `useEventRegistration.ts` - Event registration
- `useMentorship.ts` - Mentorship system
- `useMockInterviews.ts` - Mock interviews
- `useForumPosts.ts` - Forum posts
- `useDashboardStats.ts` - Dashboard analytics
- `useRecommendedAlumni.ts` - Alumni recommendations

### 3.4 Remove Annoying Features

1. `src/pages/Index.tsx`
   - Remove or delay the welcome toast
   - Make it appear only once per session
   - Add user preference to disable it

2. `src/components/AIPersonalizedConnections.tsx`
   - Change Autoplay delay from 1000ms to 3000ms
   - Add manual navigation controls
   - Add pause on hover

### 3.5 Add Loading & Error States

**Pattern to follow:**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['events'],
  queryFn: fetchEvents
});

if (isLoading) return <SkeletonLoader />;
if (error) return <ErrorState message={error.message} />;
if (!data?.length) return <EmptyState />;
```

### 3.6 Image Optimization

1. Replace all stock images with proper placeholders
2. Add lazy loading to all images
3. Use Next.js Image optimization patterns
4. Add proper alt text for accessibility

### 3.7 TypeScript Improvements

**Fix type issues in:**
- `src/components/AIPersonalizedConnections.tsx` - Replace `any[]` with proper interface
- `src/components/Events.tsx` - Add Event interface
- `src/pages/dashboard/index.tsx` - Add DashboardStats interface
- All API calls - Add response types

**Create types file:**
`src/types/index.ts`
```typescript
export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: 'workshop' | 'networking' | 'webinar' | 'social' | 'career_fair';
  start_date: string;
  end_date: string;
  location: string;
  is_virtual: boolean;
  virtual_link?: string;
  max_attendees: number;
  current_attendees: number;
  image_url?: string;
  organizer_id: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface MentorshipRequest {
  id: string;
  mentee_id: string;
  mentor_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  request_message: string;
  response_message?: string;
  areas_of_interest: string[];
  created_at: string;
  updated_at: string;
}

// ... more types
```

---

## Phase 4: Performance Optimization (Week 4)

### 4.1 Image Optimization
- Compress all images
- Add lazy loading
- Use modern formats (WebP)
- Add responsive images with srcset

### 4.2 Code Splitting
- Lazy load heavy components
- Split routes with React.lazy()
- Optimize bundle size

### 4.3 Caching Strategy
- Add React Query cache
- Implement stale-while-revalidate
- Add optimistic updates

### 4.4 Animation Performance
- Use CSS transforms instead of layout properties
- Add will-change hints
- Debounce scroll animations

---

## Phase 5: Testing & QA (Week 5)

### 5.1 Database Testing
- Test all RLS policies
- Verify data integrity
- Load test with sample data

### 5.2 API Testing
- Test all edge functions
- Verify authentication flows
- Test error handling

### 5.3 Frontend Testing
- Component testing with React Testing Library
- E2E testing with Playwright
- Accessibility testing
- Mobile responsiveness testing

### 5.4 Security Audit
- Verify RLS policies prevent unauthorized access
- Test role-based access control
- Check for SQL injection vulnerabilities
- Verify file upload security

---

## Implementation Checklist

### Week 1: Database Foundation
- [ ] Create all database tables
- [ ] Set up RLS policies
- [ ] Create database functions and triggers
- [ ] Set up user roles system
- [ ] Test all policies with sample data

### Week 2: Backend APIs
- [ ] Create event management functions
- [ ] Create mentorship functions
- [ ] Create mock interview functions
- [ ] Create forum functions
- [ ] Create dashboard analytics function
- [ ] Create recommendation engine

### Week 3: Frontend Integration
- [ ] Fix critical styling issues (Events.tsx, etc.)
- [ ] Create all custom hooks
- [ ] Replace mock data with real API calls
- [ ] Add loading states everywhere
- [ ] Add error boundaries
- [ ] Clean up unused imports and types

### Week 4: Polish & Performance
- [ ] Remove annoying toast/fix carousel speed
- [ ] Optimize images
- [ ] Add lazy loading
- [ ] Improve mobile responsiveness
- [ ] Add accessibility features
- [ ] Optimize bundle size

### Week 5: Testing
- [ ] Write unit tests for hooks
- [ ] Test all API endpoints
- [ ] E2E testing for critical flows
- [ ] Security audit
- [ ] Performance testing
- [ ] User acceptance testing

---

## Success Metrics

### Backend
✅ All tables created with proper relationships
✅ All RLS policies tested and working
✅ Edge functions respond in < 500ms
✅ Zero SQL injection vulnerabilities

### Frontend
✅ All pages load in < 2s
✅ No mock data remaining
✅ All TypeScript errors resolved
✅ 100% mobile responsive
✅ Lighthouse score > 90

### Functionality
✅ Event registration works end-to-end
✅ Connection requests work properly
✅ Chat has real-time updates
✅ Dashboard shows real data
✅ Mentorship booking flow complete
✅ Forum fully functional

### User Experience
✅ No annoying auto-play/toasts
✅ Smooth animations (60fps)
✅ Clear loading states
✅ Helpful error messages
✅ Accessible to screen readers

---

## Risk Mitigation

### Database Changes
- Create backup before migrations
- Test RLS policies in staging first
- Use transactions for complex migrations

### API Changes
- Version APIs to avoid breaking changes
- Add deprecation warnings
- Maintain backward compatibility

### Frontend Changes
- Feature flags for major changes
- A/B test new UI components
- Progressive rollout to users

---

## Notes

- All database migrations should be in `supabase/migrations/` directory
- All edge functions should be in `supabase/functions/` directory
- Use TypeScript strictly - no `any` types
- Follow the existing design system from `src/index.css`
- Test on mobile devices regularly
- Keep security as top priority (especially role checks)
- Document all API endpoints
- Add JSDoc comments to all functions

---

## Quick Start Commands

```bash
# Database setup
supabase db reset
supabase db push

# Deploy edge functions
supabase functions deploy

# Run frontend
npm run dev

# Run tests
npm run test
```

---

This plan provides a complete roadmap to transform the Alumni Nexus platform from a prototype with mock data into a production-ready application with real functionality, security, and performance.