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
  const heroImages = [{
    src: "/lovable-uploads/ec8f2a48-2d56-4532-82f0-ec1ecb10ea9d.png",
    alt: "Aerial view of the campus complex"
  }, {
    src: "/lovable-uploads/681b8611-5081-4d74-9a73-6c535d892f2f.png",
    alt: "Campus building with landscaped gardens"
  }, {
    src: "/lovable-uploads/181717b9-41b3-44d5-99a2-941c42a2b7d9.png",
    alt: "Main entrance gate of Knowledge Institute of Technology"
  }, {
    src: "/lovable-uploads/ab858792-d735-4fc0-a440-d2e156796358.png",
    alt: "Modern classroom with students and lecturer"
  }];
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
  return <section className="bg-gradient-to-br from-primary-light/30 via-background to-secondary/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiM5ZWZjYzYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-40"></div>
      {/* Hero carousel */}
      <div className="w-full relative z-10">
        <Carousel className="w-full relative">
          <CarouselContent>
            {heroImages.map((image, index) => <CarouselItem key={index}>
                <div className="relative">
                  <img src={image.src} alt={image.alt} className="w-full h-[500px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
                    {index + 1}/{heroImages.length}
                  </div>
                </div>
              </CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious className="absolute left-6 bg-white/90 backdrop-blur-md hover:bg-white shadow-xl" />
          <CarouselNext className="absolute right-6 bg-white/90 backdrop-blur-md hover:bg-white shadow-xl" />
        </Carousel>
      </div>
      
      {/* Mission statement */}
      <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 relative z-10">
        <TextReveal variant="slideUp" delay={0.2} className="text-5xl md:text-6xl font-bold text-center mb-12 block gradient-text">
          Our Mission
        </TextReveal>
        
        <TextReveal variant="fadeIn" delay={0.6} className="text-xl md:text-2xl text-foreground/80 text-center max-w-4xl mx-auto leading-relaxed block mb-12 font-light">
          At Knowledge Institute of Technology, we are dedicated to fostering a strong and lasting bond between 
          students and alumni, creating a network where knowledge, experience, and 
          opportunities flow seamlessly. Our mission is to empower students by providing 
          direct access to mentorship, career guidance, and professional development through 
          our alumni community.
        </TextReveal>
        
        <div className="flex justify-center mt-12 gap-4 flex-wrap">
          <AnimatedButton animation="pulse" size="lg" className="bg-gradient-to-r from-primary via-secondary to-accent text-white text-lg px-10 py-7 rounded-xl flex items-center shadow-2xl hover:shadow-[0_0_40px_rgba(158,252,198,0.4)] hover:scale-105 transition-all duration-300" onClick={handleJoinCommunity}>
            Join our community today
            <ArrowRight className="ml-2 h-6 w-6" />
          </AnimatedButton>
        </div>
      </div>
    </section>;
};
export default Hero;