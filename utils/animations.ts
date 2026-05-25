/**
 * Animation Presets
 * Reusable Framer Motion animation configurations
 * Following enterprise motion design principles for cybersecurity UI
 */

import type { Variants, Transition } from 'framer-motion';

// ============================================================
// TRANSITION PRESETS
// ============================================================

/** Smooth spring transition for natural motion */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30
};

/** Fast transition for micro-interactions */
export const fastTransition: Transition = {
  duration: 0.15,
  ease: 'easeOut'
};

/** Standard transition for UI elements */
export const standardTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1]
};

/** Slow transition for emphasis */
export const slowTransition: Transition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1]
};

// ============================================================
// FADE VARIANTS
// ============================================================

/** Simple fade in/out */
export const fadeInOut: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: standardTransition
  },
  exit: { 
    opacity: 0,
    transition: fastTransition
  }
};

/** Fade in from bottom */
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: standardTransition
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: fastTransition
  }
};

/** Fade in from top */
export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: standardTransition
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: fastTransition
  }
};

/** Fade in from left */
export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -30 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: standardTransition
  },
  exit: { 
    opacity: 0, 
    x: 30,
    transition: fastTransition
  }
};

/** Fade in from right */
export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 30 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: standardTransition
  },
  exit: { 
    opacity: 0, 
    x: -30,
    transition: fastTransition
  }
};

// ============================================================
// SCALE VARIANTS
// ============================================================

/** Scale from center */
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springTransition
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: fastTransition
  }
};

/** Scale with bounce */
export const scaleBounce: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0,
    transition: fastTransition
  }
};

// ============================================================
// STAGGER CONTAINER VARIANTS
// ============================================================

/** Container for staggered children animation */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

/** Faster stagger for lists */
export const staggerFast: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05
    }
  }
};

// ============================================================
// CYBERPUNK-SPECIFIC ANIMATIONS
// ============================================================

/** Glitch effect for text */
export const glitchText: Variants = {
  hidden: { 
    opacity: 0,
    x: 0
  },
  visible: {
    opacity: 1,
    x: [0, -2, 2, -1, 0],
    transition: {
      x: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: 'mirror'
      }
    }
  }
};

/** Pulse glow effect */
export const pulseGlow: Variants = {
  hidden: { 
    opacity: 0.5,
    scale: 1
  },
  visible: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

/** Scanning line effect */
export const scanLine: Variants = {
  hidden: { 
    y: -100
  },
  visible: {
    y: '100%',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

/** Data stream animation */
export const dataStream: Variants = {
  hidden: { 
    opacity: 0,
    y: 10
  },
  visible: (i: number) => ({
    opacity: [0, 1, 1, 0],
    y: [-10, 0, 0, 10],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      delay: i * 0.1
    }
  })
};

// ============================================================
// LAYOUT ANIMATIONS
// ============================================================

/** Sidebar collapse/expand */
export const sidebarAnimation = {
  closed: { 
    width: '64px',
    transition: standardTransition
  },
  open: { 
    width: '260px',
    transition: standardTransition
  }
};

/** Panel slide */
export const panelSlide = {
  closed: {
    x: '100%',
    opacity: 0
  },
  open: {
    x: 0,
    opacity: 1,
    transition: standardTransition
  }
};

// ============================================================
// HOVER & INTERACTION VARIANTS
// ============================================================

/** Interactive card hover effect */
export const cardHover = {
  rest: { 
    scale: 1,
    transition: standardTransition
  },
  hover: { 
    scale: 1.02,
    transition: standardTransition
  },
  tap: { 
    scale: 0.98,
    transition: fastTransition
  }
};

/** Button press effect */
export const buttonPress = {
  rest: { 
    scale: 1,
    y: 0
  },
  hover: { 
    scale: 1.02,
    y: -1
  },
  tap: { 
    scale: 0.98,
    y: 1
  }
};

// ============================================================
// LIST ANIMATIONS
// ============================================================ */

/** List item animation */
export const listItem: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: standardTransition
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: fastTransition
  }
};

/** Notification slide in */
export const notificationSlide: Variants = {
  hidden: { 
    opacity: 0,
    x: 100,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springTransition
  },
  exit: { 
    opacity: 0,
    x: 100,
    scale: 0.95,
    transition: fastTransition
  }
};
