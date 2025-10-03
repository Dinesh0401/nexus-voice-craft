import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import EventRegistrationDialog from '@/components/EventRegistrationDialog';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { EventHero } from '@/components/events/EventHero';
import { EventFilters, EventType } from '@/components/events/EventFilters';
import { EnhancedEventCard } from '@/components/events/EnhancedEventCard';
type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Workshop' | 'Networking' | 'Panel' | 'Program' | 'Mentoring' | 'Career Fair' | 'Hackathon' | 'Competition';
  featured?: boolean;
  alumni?: boolean;
  sponsoredBy?: string;
  spotsLeft?: number;
  image?: string;
  tags?: string[];
  description?: string;
};
const events: Event[] = [{
  id: 1,
  title: "Annual Alumni Meet 2025",
  date: "April 20, 2025",
  time: "10:00 AM - 4:00 PM",
  location: "KIOT Main Auditorium",
  type: 'Networking',
  featured: true,
  alumni: true,
  spotsLeft: 150,
  description: "Reconnect with classmates and faculty members at our biggest annual event. Includes lunch and special presentations from notable alumni.",
  image: "/lovable-uploads/55a35922-2575-4117-8ce8-42400a57c572.png",
  tags: ["networking", "reunion", "awards"]
}, {
  id: 2,
  title: "Tech Innovations Hackathon",
  date: "May 15, 2025",
  time: "9:00 AM - 6:00 PM",
  location: "KIOT Engineering Block",
  type: 'Hackathon',
  featured: true,
  sponsoredBy: "TechCorp & Alumni Association",
  spotsLeft: 75,
  description: "24-hour coding challenge sponsored by our alumni at leading tech companies. Open to all KIOT students.",
  image: "/lovable-uploads/7afe8910-5163-4ff9-a8ca-172e708ea716.png",
  tags: ["coding", "prizes", "industry-mentors"]
}, {
  id: 3,
  title: "Alumni-Led Resume Workshop",
  date: "May 22, 2025",
  time: "2:00 PM - 5:00 PM",
  location: "Virtual Event",
  type: 'Workshop',
  alumni: true,
  spotsLeft: 100,
  description: "Get your resume reviewed by alumni working at top companies. Bring your current resume and receive personalized feedback.",
  image: "/lovable-uploads/37d7e541-5805-4da1-9d74-ffa5f38c017e.png",
  tags: ["career-prep", "job-search"]
}, {
  id: 4,
  title: "Industry 4.0 Conference",
  date: "June 5, 2025",
  time: "10:00 AM - 5:00 PM",
  location: "KIOT Convention Center",
  type: 'Panel',
  alumni: true,
  featured: true,
  spotsLeft: 200,
  description: "Explore the future of manufacturing and automation with industry experts and our distinguished alumni panel.",
  image: "/lovable-uploads/3a6e2123-4764-4b3c-91f5-4e68ee7d156b.png",
  tags: ["industry4.0", "automation", "IoT"]
}, {
  id: 5,
  title: "Summer Career Fair",
  date: "June 15, 2025",
  time: "10:00 AM - 3:00 PM",
  location: "KIOT Student Center",
  type: 'Career Fair',
  sponsoredBy: "KIOT Alumni Association",
  spotsLeft: 300,
  description: "Connect with recruiters from over 50 companies, including many with KIOT alumni working there.",
  tags: ["recruitment", "internships", "jobs"]
}, {
  id: 6,
  title: "Entrepreneurship Bootcamp",
  date: "July 10, 2025",
  time: "9:00 AM - 4:00 PM",
  location: "KIOT Business School",
  type: 'Workshop',
  alumni: true,
  spotsLeft: 50,
  description: "Three-day intensive bootcamp led by successful alumni entrepreneurs. Learn how to build and scale your startup.",
  tags: ["startup", "business", "mentorship"]
}];
const EventsPage = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
    setIsRegistrationOpen(true);
  };
  const handleCloseRegistration = () => {
    setIsRegistrationOpen(false);
    setSelectedEvent(null);
  };
  const handleTypeToggle = (type: EventType) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
  };

  // Filter events based on search and type filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description?.toLowerCase().includes(searchQuery.toLowerCase()) || event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(event.type);
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedTypes]);

  // Filter featured events
  const featuredEvents = filteredEvents.filter(event => event.featured);
  // Filter upcoming events (non-featured)
  const upcomingEvents = filteredEvents.filter(event => !event.featured);
  return <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-primary-light/20 via-background to-secondary/10 relative">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiM5ZWZjYzYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        <div className="relative z-10">
        {/* Hero Section */}
        <EventHero />
        
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Filters */}
          <EventFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedTypes={selectedTypes} onTypeToggle={handleTypeToggle} onClearFilters={handleClearFilters} />
          
          {/* Featured Events Section */}
          {featuredEvents.length > 0 && <motion.section className="mb-16" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
              <motion.h2 className="text-4xl md:text-5xl font-display font-bold mb-12 text-center gradient-text" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.2
          }}>
                🌟 Featured Events
              </motion.h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatePresence>
                  {featuredEvents.map((event, index) => <motion.div key={event.id} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: index * 0.1
              }}>
                      <EnhancedEventCard event={event} onRegister={handleRegister} variant="featured" />
                    </motion.div>)}
                </AnimatePresence>
              </div>
            </motion.section>}
          
          {/* All Upcoming Events Section */}
          <motion.section initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }}>
            <motion.h2 className="text-4xl md:text-5xl font-display font-bold mb-12 text-center gradient-text" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.5
          }}>
              📅 All Upcoming Events
            </motion.h2>
            
            {upcomingEvents.length === 0 ? <motion.div className="text-center py-12" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.6
          }}>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear Filters
                </Button>
              </motion.div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {upcomingEvents.map((event, index) => <motion.div key={event.id} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: index * 0.05
              }} layout className="mx-[2px] my-[2px] px-0 py-px">
                      <EnhancedEventCard event={event} onRegister={handleRegister} variant="standard" />
                    </motion.div>)}
                </AnimatePresence>
              </div>}
            
            {/* Calendar CTA */}
            <motion.div className="mt-12" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.8
          }}>
              <div className="bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 p-10 rounded-3xl text-center border-2 border-primary/20 shadow-2xl backdrop-blur-sm">
                <motion.div className="text-4xl mb-4" animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }} transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}>
                  💡
                </motion.div>
                <h3 className="text-3xl font-bold mb-4">Want to propose an event?</h3>
                <p className="text-foreground/70 mb-8 max-w-2xl mx-auto text-lg">
                  Are you an alumnus interested in organizing an event, workshop, or mentorship program? 
                  We welcome your ideas and initiatives to strengthen our community.
                </p>
                <Button onClick={() => navigate('/contact')} className="gap-2 shadow-xl hover:shadow-2xl" size="lg" variant="gradient">
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.section>
        </div>
      </main>
      
      <Footer />
      <ChatBot />
      
      {/* Registration Dialog */}
      <EventRegistrationDialog event={selectedEvent} isOpen={isRegistrationOpen} onClose={handleCloseRegistration} />
    </div>;
};
export default EventsPage;