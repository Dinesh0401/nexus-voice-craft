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
  return <section className="relative py-20 px-4 md:px-8 bg-white overflow-hidden">

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            How alumNexus helps you succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with alumni mentors through our comprehensive platform designed for your career success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="p-8 h-full flex flex-col bg-white border border-border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Icon Container */}
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground flex-grow leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>)}
        </div>

      </div>
    </section>;
};
export default Features;