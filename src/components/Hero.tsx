import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { showSuccessToast } from '@/components/SuccessToast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AnimatedButton from '@/components/animations/AnimatedButton';
import TextReveal from '@/components/animations/TextReveal';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

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
    showSuccessToast({
      message: "Welcome to the community!",
      emoji: "👋"
    });
    setTimeout(() => navigate('/mentorship'), 1000);
  };

  const handleExploreMentorship = () => {
    navigate('/mentorship');
  };

  return (
    <section className="bg-emerald-50">
      {/* Hero carousel */}
      <div className="w-full">
        <Carousel className="w-full relative">
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative">
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-[500px] object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-lg text-sm font-semibold">
                    {index + 1}/{heroImages.length}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4" />
          <CarouselNext className="absolute right-4" />
        </Carousel>
      </div>
      
      {/* Mission statement */}
      <div className="max-w-7xl mx-auto py-16 px-4 md:px-8">
        <TextReveal 
          variant="slideUp" 
          delay={0.2}
          className="text-4xl md:text-5xl font-bold text-center text-green-800 mb-12 block"
        >
          Our Mission
        </TextReveal>
        
        <TextReveal 
          variant="fadeIn" 
          delay={0.6}
          className="text-xl md:text-2xl text-gray-700 text-center max-w-4xl mx-auto leading-relaxed block mb-12"
        >
          At Knowledge Institute of Technology, we are dedicated to fostering a strong and lasting bond between 
          students and alumni, creating a network where knowledge, experience, and 
          opportunities flow seamlessly. Our mission is to empower students by providing 
          direct access to mentorship, career guidance, and professional development through 
          our alumni community.
        </TextReveal>
        
        <div className="flex justify-center mt-12 gap-4 flex-wrap">
          <AnimatedButton
            animation="pulse"
            size="lg"
            className="bg-primary text-white text-lg px-8 py-6 rounded-lg flex items-center"
            onClick={handleJoinCommunity}
          >
            Join our community today
            <ArrowRight className="ml-2 h-5 w-5" />
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
};

export default Hero;
