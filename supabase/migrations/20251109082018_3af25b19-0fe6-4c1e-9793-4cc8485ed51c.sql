-- Create app_role enum for user roles
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'alumni', 'student');

-- Create user_roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

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

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('workshop', 'networking', 'panel', 'program', 'mentoring', 'career_fair', 'hackathon', 'competition')) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  meeting_link TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  price DECIMAL(10, 2) DEFAULT 0,
  image_url TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  alumni_only BOOLEAN DEFAULT false,
  sponsored_by TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_featured ON events(featured);
CREATE INDEX idx_events_status ON events(status);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id);

CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Event registrations table
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  dietary_requirements TEXT,
  additional_info TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their registrations"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Mentorship requests table
CREATE TABLE mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mentor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
  message TEXT,
  mentor_response TEXT,
  goals JSONB,
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mentorship_requests_mentee ON mentorship_requests(mentee_id);
CREATE INDEX idx_mentorship_requests_mentor ON mentorship_requests(mentor_id);
CREATE INDEX idx_mentorship_requests_status ON mentorship_requests(status);

ALTER TABLE mentorship_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mentorship requests"
  ON mentorship_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = mentee_id OR auth.uid() = mentor_id);

CREATE POLICY "Mentees can create requests"
  ON mentorship_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Mentors can update request status"
  ON mentorship_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = mentor_id);

-- Mentorship sessions table
CREATE TABLE mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentorship_id UUID REFERENCES mentorship_requests(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  feedback JSONB,
  meeting_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mentorship_sessions_mentorship ON mentorship_sessions(mentorship_id);
CREATE INDEX idx_mentorship_sessions_scheduled ON mentorship_sessions(scheduled_at);
CREATE INDEX idx_mentorship_sessions_status ON mentorship_sessions(status);

ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sessions for their mentorships"
  ON mentorship_sessions FOR SELECT
  TO authenticated
  USING (mentorship_id IN (
    SELECT id FROM mentorship_requests 
    WHERE mentee_id = auth.uid() OR mentor_id = auth.uid()
  ));

CREATE POLICY "Users can create sessions for their mentorships"
  ON mentorship_sessions FOR INSERT
  TO authenticated
  WITH CHECK (mentorship_id IN (
    SELECT id FROM mentorship_requests 
    WHERE mentee_id = auth.uid() OR mentor_id = auth.uid()
  ));

CREATE POLICY "Users can update their mentorship sessions"
  ON mentorship_sessions FOR UPDATE
  TO authenticated
  USING (mentorship_id IN (
    SELECT id FROM mentorship_requests 
    WHERE mentee_id = auth.uid() OR mentor_id = auth.uid()
  ));

-- Mock interviews table
CREATE TABLE mock_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('technical', 'behavioral', 'case_study', 'virtual', 'executive')) NOT NULL,
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  questions JSONB,
  feedback JSONB,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  meeting_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mock_interviews_student ON mock_interviews(student_id);
CREATE INDEX idx_mock_interviews_interviewer ON mock_interviews(interviewer_id);
CREATE INDEX idx_mock_interviews_type ON mock_interviews(type);
CREATE INDEX idx_mock_interviews_status ON mock_interviews(status);
CREATE INDEX idx_mock_interviews_scheduled ON mock_interviews(scheduled_at);

ALTER TABLE mock_interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interview requests"
  ON mock_interviews FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = interviewer_id);

CREATE POLICY "Students can create interview requests"
  ON mock_interviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Interviewers can update interviews"
  ON mock_interviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = interviewer_id OR auth.uid() = student_id);

-- Triggers for updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_registrations_updated_at
  BEFORE UPDATE ON event_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentorship_requests_updated_at
  BEFORE UPDATE ON mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentorship_sessions_updated_at
  BEFORE UPDATE ON mentorship_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mock_interviews_updated_at
  BEFORE UPDATE ON mock_interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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