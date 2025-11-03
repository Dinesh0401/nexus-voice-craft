import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();

  const heroImages = [
    {
      src: "/lovable-uploads/ec8f2a48-2d56-4532-82f0-ec1ecb10ea9d.png",
      alt: "Aerial view of the campus complex"
    },
    {
      src: "/lovable-uploads/681b8611-5081-4d74-9a73-6c535d892f2f.png",
      alt: "Campus building with landscaped gardens"
    },
    {
      src: "/lovable-uploads/181717b9-41b3-44d5-99a2-941c42a2b7d9.png",
      alt: "Main entrance gate of Knowledge Institute of Technology"
    },
    {
      src: "/lovable-uploads/ab858792-d735-4fc0-a440-d2e156796358.png",
      alt: "Modern classroom with students and lecturer"
    }
  ];

  const handleJoinCommunity = () => {
    navigate('/mentorship');
  };

  const handleExploreMentorship = () => {
    navigate('/alumni');
  };

  return <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Hero Background Carousel */}
      <div className="absolute inset-0">
        <Carousel 
          opts={{ loop: true }} 
          plugins={[Autoplay({ delay: 5000 })]}
          className="h-full"
        >
          <CarouselContent className="h-full">
            {heroImages.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative h-full w-full">
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-full object-cover" 
                  />
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      
      {/* Hero Content Overlay */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight text-white">
              Connect with Alumni.
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Advance Your Career.
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
              Join 10,000+ students building meaningful connections with accomplished alumni mentors.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleJoinCommunity}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-7 shadow-xl group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={handleExploreMentorship}
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-7 bg-transparent"
              >
                <Users className="mr-2 h-5 w-5" />
                Explore Alumni
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};

export default Hero;
