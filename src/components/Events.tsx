import React from 'react';
import { Calendar, MapPin, Users, Clock, ArrowRight, Star, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast } from '@/components/SuccessToast';
import { Badge } from '@/components/ui/badge';
type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Workshop' | 'Networking' | 'Panel' | 'Program' | 'Mentoring' | 'Career Fair';
  featured?: boolean;
  alumni?: boolean;
  spotsLeft?: number;
  image?: string;
  tags?: string[];
};
const events: Event[] = [{
  id: 1,
  title: "Alumni Mentorship Program Kickoff",
  date: "April 20, 2025",
  time: "3:00 PM - 5:00 PM",
  location: "Main Campus, Johnson Hall",
  type: "Mentoring",
  featured: true,
  alumni: true,
  spotsLeft: 15,
  image: "/lovable-uploads/55f04ec5-8a46-435f-bfc6-06b4f7389672.png",
  tags: ["mentorship", "networking", "career development"]
}, {
  id: 2,
  title: "Tech Industry Alumni Panel",
  date: "May 4, 2025",
  time: "6:00 PM - 8:00 PM",
  location: "Virtual Event",
  type: "Panel",
  alumni: true,
  spotsLeft: 50,
  image: "/lovable-uploads/87030a39-6fa7-425b-99f4-05b0abb9ded1.png",
  tags: ["tech", "career insights", "q&a"]
}, {
  id: 3,
  title: "Annual Alumni Reunion",
  date: "May 15, 2025",
  time: "12:00 PM - 5:00 PM",
  location: "Campus Green",
  type: "Networking",
  featured: true,
  alumni: true,
  spotsLeft: 200,
  image: "/lovable-uploads/24f2d64b-472c-43e4-b881-f772a1d0e057.png",
  tags: ["reunion", "celebration", "networking"]
}, {
  id: 4,
  title: "Alumni-Led Resume Workshop",
  date: "June 1, 2025",
  time: "2:00 PM - 4:00 PM",
  location: "Business School, Room 305",
  type: "Workshop",
  alumni: true,
  spotsLeft: 25,
  image: "/lovable-uploads/1cf21656-76ea-4e9e-8f14-fb51ef8a84f7.png",
  tags: ["resume", "job search", "career prep"]
}, {
  id: 5,
  title: "Summer Career Fair",
  date: "June 15, 2025",
  time: "10:00 AM - 3:00 PM",
  location: "Student Center",
  type: "Career Fair",
  spotsLeft: 500,
  tags: ["job opportunities", "networking", "internships"]
}];
const Events = () => {
  const navigate = useNavigate();
  const handleLearnMore = (eventId: number) => {
    navigate(`/events/${eventId}`);
  };
  const handleRegister = (eventId: number, eventTitle: string) => {
    showSuccessToast({
      message: `You've registered for ${eventTitle}!`,
      emoji: "🎉"
    });
  };

  // Filter alumni events
  const alumniEvents = events.filter(event => event.alumni);

  // Get featured events
  const featuredEvents = events.filter(event => event.featured);
  return <section className="relative py-20 px-4 md:px-8 bg-gradient-to-br from-background via-accent/5 to-primary/5 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-accent/40 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-primary/40 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Events and Programs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with the alumNexus community through our upcoming events and programs. 
            From mentorship sessions to networking opportunities, there's something for everyone.
          </p>
        </div>
        
        {/* Featured Events */}
        {featuredEvents.length > 0 && <div className="mb-12 bg-gray-100">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              Featured Events
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredEvents.map(event => <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative flex flex-col md:flex-row">
                  {event.image && <div className="md:w-2/5">
                      <img src={event.image} alt={event.title} className="h-48 md:h-full w-full object-cover" />
                    </div>}
                  <div className={`p-6 flex flex-col justify-between ${event.image ? 'md:w-3/5' : 'w-full'}`}>
                    <div>
                      <div className={`
                        absolute top-0 right-0 px-3 py-1 text-xs font-medium text-white rounded-bl-md
                        ${event.type === 'Workshop' ? 'bg-blue-500' : event.type === 'Networking' ? 'bg-purple-500' : event.type === 'Panel' ? 'bg-amber-500' : event.type === 'Mentoring' ? 'bg-green-500' : event.type === 'Career Fair' ? 'bg-pink-500' : 'bg-nexus-primary'}
                      `}>
                        {event.type}
                      </div>
                      
                      <h3 className="font-semibold text-xl mb-3">{event.title}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-nexus-primary" />
                          {event.date}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="h-4 w-4 mr-2 text-nexus-primary" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-nexus-primary" />
                          {event.location}
                        </div>
                      </div>
                      
                      {event.tags && <div className="flex flex-wrap gap-2 mb-4">
                          {event.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs bg-gray-50">
                              #{tag}
                            </Badge>)}
                        </div>}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <Button variant="default" className="bg-nexus-primary hover:bg-nexus-primary/90" onClick={() => handleRegister(event.id, event.title)}>
                        Register Now
                      </Button>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{event.spotsLeft} spots left</span>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>}
        
        {/* Alumni-Led Events */}
        <div className="mb-12 my-0 mx-[17px] px-[5px] py-[3px]">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Tag className="h-5 w-5 text-nexus-primary mr-2" />
            Alumni-Led Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-100 my-0 py-0 mx-0 px-0">
            {alumniEvents.map(event => <div key={event.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6 relative hover:translate-y-[-5px] duration-300 bg-slate-50 rounded-sm mx-0 px-0 my-0 py-0">
                <div className={`
                  absolute top-0 right-6 px-3 py-1 text-xs font-medium text-white rounded-b-md
                  ${event.type === 'Workshop' ? 'bg-blue-500' : event.type === 'Networking' ? 'bg-purple-500' : event.type === 'Panel' ? 'bg-amber-500' : event.type === 'Mentoring' ? 'bg-green-500' : event.type === 'Career Fair' ? 'bg-pink-500' : 'bg-nexus-primary'}
                `}>
                  {event.type}
                </div>
                
                <div className="pt-6 mx-0 px-0 py-0 my-0">
                  <h3 className="font-semibold text-xl mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-nexus-primary" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="h-4 w-4 mr-2 text-nexus-primary" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-nexus-primary" />
                      {event.location}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Button variant="outline" className="border-nexus-primary text-nexus-primary hover:bg-nexus-primary/10" onClick={() => handleLearnMore(event.id)}>
                      Learn more
                    </Button>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{event.spotsLeft} spots left</span>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        
        {/* Calendar View CTA */}
        <div className="p-8 rounded-lg text-center bg-zinc-100">
          <h3 className="text-xl font-bold mb-3">View Full Event Calendar</h3>
          <p className="text-gray-600 mb-4">
            Browse all upcoming events, filter by event type, and add them to your personal calendar.
          </p>
          <Button onClick={() => navigate('/events')} className="bg-nexus-primary hover:bg-nexus-primary/90">
            View All Events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>;
};
export default Events;