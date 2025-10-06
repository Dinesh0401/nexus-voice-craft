import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: 'slideUp' | 'fadeIn' | 'typewriter' | 'wave';
}
const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.8,
  variant = 'slideUp'
}) => {
  const words = children.split(' ');
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: variant === 'typewriter' ? 0.05 : 0.1,
        delayChildren: delay
      }
    }
  };
  const itemVariants = {
    slideUp: {
      hidden: {
        y: 20,
        opacity: 0
      },
      visible: {
        y: 0,
        opacity: 1
      }
    },
    fadeIn: {
      hidden: {
        opacity: 0
      },
      visible: {
        opacity: 1
      }
    },
    typewriter: {
      hidden: {
        opacity: 0
      },
      visible: {
        opacity: 1
      }
    },
    wave: {
      hidden: {
        y: 20,
        opacity: 0
      },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          damping: 10,
          stiffness: 200
        }
      }
    }
  };
  if (variant === 'typewriter') {
    return <motion.span className={cn("inline-block", className)} variants={containerVariants} initial="hidden" animate="visible">
        {children.split('').map((char, index) => <motion.span key={index} variants={itemVariants[variant]} className="inline-block">
            {char === ' ' ? '\u00A0' : char}
          </motion.span>)}
      </motion.span>;
  }
  return <motion.span className={cn("inline-block", className)} variants={containerVariants} initial="hidden" animate="visible">
      {words.map((word, index) => <motion.span key={index} variants={itemVariants[variant]} className="inline-block mr-1 text-green-300 text-center font-semibold mx-[168px]">
          {word}
        </motion.span>)}
    </motion.span>;
};
export default TextReveal;