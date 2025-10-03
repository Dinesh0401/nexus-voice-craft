import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
  gradient?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  hoverEffect = true,
  intensity = 'medium',
  gradient = false
}: GlassCardProps) {
  const intensityClasses = {
    light: 'bg-white/10 backdrop-blur-sm border-white/20 shadow-lg',
    medium: 'bg-white/20 backdrop-blur-md border-white/30 shadow-xl',
    heavy: 'bg-white/30 backdrop-blur-lg border-white/40 shadow-2xl'
  };

  const darkIntensityClasses = {
    light: 'dark:bg-black/20 dark:border-white/10 dark:shadow-[0_0_20px_rgba(158,252,198,0.1)]',
    medium: 'dark:bg-black/30 dark:border-white/20 dark:shadow-[0_0_30px_rgba(158,252,198,0.15)]', 
    heavy: 'dark:bg-black/40 dark:border-white/30 dark:shadow-[0_0_40px_rgba(158,252,198,0.2)]'
  };

  return (
    <motion.div
      className={cn(
        "rounded-2xl border shadow-lg",
        intensityClasses[intensity],
        darkIntensityClasses[intensity],
        "transition-all duration-500",
        hoverEffect && "hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-2",
        gradient && "bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5",
        className
      )}
      whileHover={hoverEffect ? { y: -6, scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}