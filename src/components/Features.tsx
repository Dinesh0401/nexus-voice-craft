import React from 'react';
import { Users, Calendar, PenTool, BookOpen, MessageCircle, Award } from 'lucide-react';
import AnimatedCard from '@/components/animations/AnimatedCard';
import TextReveal from '@/components/animations/TextReveal';
import { motion } from 'framer-motion';
const features = [{
  icon: <Users className="h-6 w-6 text-nexus-primary" />,
  title: "Connect with Mentors",
  description: "Book 1:1 sessions with alumni who are leaders in your field of interest."
}, {
  icon: <Calendar className="h-6 w-6 text-nexus-primary" />,
  title: "Mock Interviews",
  description: "Practice with real industry professionals and receive actionable feedback."
}, {
  icon: <BookOpen className="h-6 w-6 text-nexus-primary" />,
  title: "Subject Hubs",
  description: "Join specialized communities for your major or interest area."
}, {
  icon: <MessageCircle className="h-6 w-6 text-nexus-primary" />,
  title: "Discussion Forums",
  description: "Ask questions and share insights with peers and alumni."
}, {
  icon: <PenTool className="h-6 w-6 text-nexus-primary" />,
  title: "Career Resources",
  description: "Access resume reviews, interview tips, and industry insights."
}, {
  icon: <Award className="h-6 w-6 text-nexus-primary" />,
  title: "Networking Events",
  description: "Attend virtual and in-person events to expand your professional circle."
}];
const Features = () => {
  return (
    <section className="relative py-20 px-4 md:px-8 bg-gradient-to-br from-background via-ai-surface/20 to-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-ai-primary/30 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-ai-secondary/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-ai-accent/40 to-transparent rounded-full blur-xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <TextReveal variant="slideUp" className="text-4xl md:text-5xl font-bold font-display mb-6 bg-gradient-to-r from-ai-primary via-ai-secondary to-ai-accent bg-clip-text text-transparent block">
            How alumNexus helps you succeed
          </TextReveal>
          <TextReveal variant="fadeIn" delay={0.3} className="text-xl text-muted-foreground max-w-3xl mx-auto block">
            We've designed an AI-powered platform that makes connecting with alumni mentors 
            intuitive, meaningful, and tailored to your unique career journey.
          </TextReveal>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedCard key={index} hoverEffect="tilt" delay={index * 0.1} className="h-full group">
              <motion.div 
                className="p-8 h-full flex flex-col bg-gradient-to-br from-background to-ai-surface/30 border-2 border-ai-border backdrop-blur-sm"
                whileHover={{ 
                  background: "linear-gradient(135deg, hsl(var(--background)), hsl(var(--ai-surface)))"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated Icon Container */}
                <motion.div 
                  className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-ai-primary/20 to-ai-secondary/20 flex items-center justify-center mb-6 border border-ai-border"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    background: "linear-gradient(135deg, hsl(var(--ai-primary)), hsl(var(--ai-secondary)))"
                  }}
                  transition={{
                    type: 'spring',
                    damping: 15,
                    stiffness: 300
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, color: "white" }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-ai-primary to-ai-secondary opacity-0 blur-xl"
                    whileHover={{ opacity: 0.3 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Content */}
                <motion.h3 
                  className="text-xl font-bold mb-3 text-foreground group-hover:text-ai-primary transition-colors"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p 
                  className="text-muted-foreground flex-grow leading-relaxed"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {feature.description}
                </motion.p>

                {/* Decorative Element */}
                <motion.div
                  className="mt-6 h-1 w-0 bg-gradient-to-r from-ai-primary to-ai-secondary rounded-full"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </motion.div>
            </AnimatedCard>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ai-primary/10 to-ai-secondary/10 rounded-full border border-ai-border">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Award className="w-5 h-5 text-ai-primary" />
            </motion.div>
            <span className="text-sm font-medium text-ai-primary">
              Trusted by 10,000+ students and alumni worldwide
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default Features;