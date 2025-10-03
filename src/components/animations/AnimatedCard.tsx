
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'tilt' | 'scale';
  delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className, 
  hoverEffect = 'lift',
  delay = 0
}) => {
  const hoverEffects = {
    lift: {
      y: -8,
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    },
    glow: {
      boxShadow: '0 0 20px rgba(40, 167, 69, 0.3)'
    },
    tilt: {
      rotateY: -10,
      rotateX: 5,
      scale: 1.05,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    scale: {
      scale: 1.05
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: 'spring',
        damping: 25,
        stiffness: 300
      }}
      whileHover={hoverEffects[hoverEffect]}
      className={cn("cursor-pointer h-full", className)}
      style={{ perspective: '1000px' }}
    >
      <Card className="hover:border-primary/50 overflow-hidden h-full">
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
