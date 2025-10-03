import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Star, ExternalLink, BookmarkPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import AnimatedButton from '@/components/animations/AnimatedButton';

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

interface EnhancedEventCardProps {
  event: Event;
  onRegister: (event: Event) => void;
  variant?: 'featured' | 'standard';
}

export function EnhancedEventCard({ event, onRegister, variant = 'standard' }: EnhancedEventCardProps) {
  const isFeatured = variant === 'featured';
  
  const typeColors = {
    'Hackathon': 'bg-purple-500',
    'Workshop': 'bg-blue-500',
    'Networking': 'bg-indigo-500',
    'Panel': 'bg-amber-500',
    'Competition': 'bg-red-500',
    'Career Fair': 'bg-pink-500',
    'Mentoring': 'bg-green-500',
    'Program': 'bg-primary'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard 
        className={`
          overflow-hidden h-full
          ${isFeatured ? 'lg:flex lg:flex-row' : 'flex flex-col'}
        `}
        intensity={isFeatured ? 'medium' : 'light'}
      >
        {/* Event Image */}
        {event.image && (
          <div className={`
            ${isFeatured ? 'lg:w-2/5 h-48 lg:h-auto' : 'h-48'}
            relative overflow-hidden
          `}>
            <motion.img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Featured Badge */}
            {event.featured && (
              <motion.div
                className="absolute top-4 left-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-yellow-500 text-yellow-900 gap-1">
                  <Star className="h-3 w-3" />
                  Featured
                </Badge>
              </motion.div>
            )}
            
            {/* Bookmark Button */}
            <motion.button
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <BookmarkPlus className="h-4 w-4 text-white" />
            </motion.button>
          </div>
        )}

        {/* Event Content */}
        <div className={`
          p-6 flex flex-col justify-between flex-1
          ${isFeatured && event.image ? 'lg:w-3/5' : 'w-full'}
        `}>
          <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className={`
                  font-bold mb-2 line-clamp-2
                  ${isFeatured ? 'text-xl lg:text-2xl' : 'text-lg'}
                `}>
                  {event.title}
                </h3>
              </div>
              <Badge className={`ml-2 ${typeColors[event.type]} text-white`}>
                {event.type}
              </Badge>
            </div>

            {/* Description */}
            {event.description && (
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {event.description}
              </p>
            )}

            {/* Event Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                {event.date}
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                {event.time}
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                {event.location}
              </div>
            </div>

            {/* Sponsored By */}
            {event.sponsoredBy && (
              <div className="text-sm text-muted-foreground italic mb-3">
                Sponsored by: {event.sponsoredBy}
              </div>
            )}

            {/* Tags */}
            {event.tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <AnimatedButton
                onClick={() => onRegister(event)}
                variant={isFeatured ? "default" : "outline"}
                className={isFeatured ? "bg-primary hover:bg-primary/90" : ""}
              >
                Register Now
              </AnimatedButton>
              
              <motion.button
                className="p-2 hover:bg-accent rounded-md transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink className="h-4 w-4" />
              </motion.button>
            </div>

            {event.spotsLeft && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                <span className={event.spotsLeft < 10 ? 'text-red-500 font-medium' : ''}>
                  {event.spotsLeft} spots left
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar for Limited Spots */}
          {event.spotsLeft && event.spotsLeft < 50 && (
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    event.spotsLeft < 10 ? 'bg-red-500' : 
                    event.spotsLeft < 25 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(10, (event.spotsLeft / 100) * 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}