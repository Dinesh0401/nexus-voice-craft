
import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Thanks to alumNexus, I landed my dream job at Microsoft. The mock interviews were incredibly realistic and the feedback was invaluable.",
    name: "Maya Patel",
    role: "Software Engineer",
    company: "Microsoft",
    avatar: "/lovable-uploads/8ee7877a-cbd3-4121-a549-d044b60c6f6f.png"
  },
  {
    quote: "The mentorship I received through alumNexus guided me through a career pivot into data science. My mentor still checks in with me!",
    name: "James Wilson",
    role: "Data Scientist",
    company: "Spotify",
    avatar: "/lovable-uploads/4bededbc-dba6-4e4a-a676-75063a634759.png"
  },
  {
    quote: "The subject hubs are incredible. I was able to connect with alumni in my specific field who provided insights I couldn't find anywhere else.",
    name: "Sophia Lee",
    role: "UX Designer",
    company: "Adobe",
    avatar: "/lovable-uploads/24f2d64b-472c-43e4-b881-f772a1d0e057.png"
  }
];

const Testimonials = () => {
  return (
    <section className="relative py-20 px-4 md:px-8 bg-gradient-to-br from-background via-secondary/5 to-primary/5 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-secondary/30 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Success stories from our community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how alumNexus has helped students and alumni build meaningful connections and advance their careers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group relative bg-white/80 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute -top-4 -left-4 bg-gradient-to-br from-primary to-secondary rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform">
                <Quote className="h-6 w-6 text-white" />
              </div>
              
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
              
              <p className="relative text-muted-foreground mb-6 pt-4 leading-relaxed">"{testimonial.quote}"</p>
              
              <div className="relative flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="h-14 w-14 rounded-full mr-4 object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                />
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
