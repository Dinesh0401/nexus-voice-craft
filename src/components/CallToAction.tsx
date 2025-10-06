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
  return <section className="py-16 px-4 md:px-8 bg-nexus-primary">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to connect and grow?</h2>
        <p className="text-lg text-white/90 mb-8">
          Join our community of 2,500+ alumni and 10,000+ students already building meaningful relationships.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-white text-nexus-primary hover:bg-gray-100 text-lg px-8 py-6" onClick={handleStudentJoin}>
            Join as a Student
          </Button>
          <Button variant="outline" onClick={handleAlumniJoin} className="border-white px-8 py-6 text-lg bg-zinc-100 text-green-600 text-center">
            Join as an Alumni
          </Button>
        </div>
      </div>
    </section>;
};
export default CallToAction;