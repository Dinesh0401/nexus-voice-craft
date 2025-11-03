import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardEnhancedProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowEffect?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

export function GlassCardEnhanced({ 
  children, 
  className, 
  hoverEffect = true,
  glowEffect = false,
  intensity = 'medium'
}: GlassCardEnhancedProps) {
  const intensityClasses = {
    light: 'bg-white/40 backdrop-blur-sm border-white/20',
    medium: 'bg-white/60 backdrop-blur-md border-white/30',
    heavy: 'bg-white/80 backdrop-blur-lg border-white/40'
  };

  const darkIntensityClasses = {
    light: 'dark:bg-black/30 dark:border-white/10',
    medium: 'dark:bg-black/50 dark:border-white/20',
    heavy: 'dark:bg-black/70 dark:border-white/30'
  };

  return (
    <motion.div
      className={cn(
        "rounded-xl border transition-all duration-300 relative overflow-hidden",
        intensityClasses[intensity],
        darkIntensityClasses[intensity],
        glowEffect && "shadow-lg hover:shadow-2xl",
        className
      )}
      whileHover={hoverEffect ? { y: -5, scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Gradient overlay on hover */}
      {glowEffect && (
        <motion.div 
          className="absolute inset-0 opacity-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 pointer-events-none"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
