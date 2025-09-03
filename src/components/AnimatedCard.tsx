'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  onClick?: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.2 } },
};

export const AnimatedCard = ({ children, delay = 0, className, onClick }: AnimatedCardProps) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={{
        ...cardVariants,
        visible: { 
          ...cardVariants.visible, 
          transition: { 
            ...(cardVariants.visible.transition as object), 
            delay 
          } 
        },
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};