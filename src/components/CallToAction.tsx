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
  return <section className="relative py-20 px-4 md:px-8 bg-gradient-to-r from-primary to-secondary overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to connect and grow?
        </h2>
        <p className="text-lg md:text-xl text-white/95 mb-10 leading-relaxed max-w-2xl mx-auto">
          Join 10,000+ students and alumni building meaningful relationships.
        </p>
        <Button 
          size="lg"
          className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-7 shadow-xl font-semibold" 
          onClick={handleStudentJoin}
        >
          Get Started Today
        </Button>
      </div>
    </section>;
};
export default CallToAction;