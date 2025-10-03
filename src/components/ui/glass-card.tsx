import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

export function GlassCard({ 
  children, 
  className, 
  hoverEffect = true,
  intensity = 'medium'
}: GlassCardProps) {
  const intensityClasses = {
    light: 'bg-white/30 backdrop-blur-sm border-white/20',
    medium: 'bg-white/50 backdrop-blur-md border-white/30',
    heavy: 'bg-white/70 backdrop-blur-lg border-white/40'
  };

  const darkIntensityClasses = {
    light: 'dark:bg-black/20 dark:border-white/10',
    medium: 'dark:bg-black/40 dark:border-white/20',
    heavy: 'dark:bg-black/60 dark:border-white/30'
  };

  return (
    <motion.div
      className={cn(
        "rounded-lg border transition-all duration-300",
        intensityClasses[intensity],
        darkIntensityClasses[intensity],
        className
      )}
      whileHover={hoverEffect ? { y: -5, scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}