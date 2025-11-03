import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import CallToAction from '@/components/CallToAction';
import AIAssistant from '@/components/AIAssistant';
import EnhancedRecentPosts from '@/components/EnhancedRecentPosts';
import AIRecommendations from '@/components/AIRecommendations';
import Events from '@/components/Events';
import { useToast } from '@/hooks/use-toast';
import AIPersonalizedConnections from '@/components/AIPersonalizedConnections';
// Remove unused imports
import AlumniSpotlight from '@/components/AlumniSpotlight';
import EnhancedPageTransition from '@/components/animations/EnhancedPageTransition';
import StatisticsCounter from '@/components/StatisticsCounter';
import LoadingCard from '@/components/animations/LoadingCard';
import TextReveal from '@/components/animations/TextReveal';

// Import these to make sure they're available
import { showSuccessToast, toastTypes } from '@/components/SuccessToast';
import { TooltipProvider } from '@/components/ui/tooltip';
const Index = () => {
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Show a welcome toast when the page loads
    toast({
      title: "Welcome to Knowledge Institute of Technology",
      description: "Connect with alumni mentors to boost your career journey."
    });
  }, [toast]);
  return <EnhancedPageTransition>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        
        <main className="flex-grow">
          <Hero />
          <StatisticsCounter />
          <div className="container mx-auto px-4 py-8">
            {/* Wrap components that use Tooltip with TooltipProvider */}
            <TooltipProvider>
              <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                  <AIPersonalizedConnections />
                </div>
              </div>
            </TooltipProvider>
          </div>
          <Features />
          <Testimonials />
          <EnhancedRecentPosts />
          <Events />
          <CallToAction />
        </main>
        
        <Footer />
        <AIAssistant />
      </div>
    </EnhancedPageTransition>;
};
export default Index;