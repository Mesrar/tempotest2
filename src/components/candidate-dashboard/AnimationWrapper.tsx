"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface AnimationWrapperProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  className?: string;
}

export function AnimationWrapper({ 
  children, 
  delay = 0, 
  direction = "up", 
  duration = 0.5,
  className = "" 
}: AnimationWrapperProps) {
  const directionVariants = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 }
  };

  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ 
        duration,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1,
  className = "" 
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3,
        delay,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.02 }}
      className="transition-shadow"
    >
      {children}
    </motion.div>
  );
}

interface SlideInProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  className?: string;
}

export function SlideIn({ 
  children, 
  direction = "left", 
  delay = 0,
  className = ""
}: SlideInProps) {
  const slideVariants = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    up: { y: 100, opacity: 0 },
    down: { y: -100, opacity: 0 }
  };

  return (
    <motion.div
      initial={slideVariants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 12
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PulseOnUpdate({ 
  children, 
  trigger 
}: { 
  children: ReactNode; 
  trigger: any 
}) {
  return (
    <motion.div
      key={trigger}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
