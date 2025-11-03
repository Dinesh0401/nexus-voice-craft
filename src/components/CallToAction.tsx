import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast } from '@/components/SuccessToast';
const CallToAction = () => {
  const navigate = useNavigate();
  const handleStudentJoin = () => {
    showSuccessToast({
      message: "Welcome to alumNexus!",
      emoji: "🎓"
    });
    // For now, just show a toast and navigate
    setTimeout(() => navigate('/mentorship'), 1000);
  };
  const handleAlumniJoin = () => {
    showSuccessToast({
      message: "Welcome back!",
      emoji: "🤝"
    });
    // For now, just show a toast and navigate
    setTimeout(() => navigate('/mentorship'), 1000);
  };
  return <section className="relative py-20 px-4 md:px-8 bg-gradient-to-br from-primary via-secondary to-primary overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-white/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
          Ready to connect and grow?
        </h2>
        <p className="text-lg md:text-xl text-white/95 mb-10 leading-relaxed drop-shadow">
          Join our community of 2,500+ alumni and 10,000+ students already building meaningful relationships.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            variant="gradient"
            size="lg"
            className="bg-white text-primary hover:bg-white/90 hover:scale-105 text-lg px-10 py-7 shadow-2xl font-semibold" 
            onClick={handleStudentJoin}
          >
            Join as a Student
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleAlumniJoin} 
            className="border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-7 text-lg font-semibold bg-transparent shadow-xl hover:scale-105 transition-all"
          >
            Join as an Alumni
          </Button>
        </div>
      </div>
    </section>;
};
export default CallToAction;