// Framer Motion variants – medical theme with 3D animations
export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const stagger = {
  animate: (delay = 0.05) => ({
    transition: { staggerChildren: delay },
  }),
}

export const pageTransition = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
  transition: { duration: 0.25 },
}

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4 },
  tap: { scale: 0.98 },
}

export const cardHoverElevation = {
  rest: { boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' },
  hover: { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
}

export const float = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const pulseSoft = {
  animate: {
    opacity: [1, 0.7, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
}

// ——— 3D animations ———
export const card3D = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    z: 0,
    transition: { duration: 0.3 },
  },
  hover: {
    rotateX: 2,
    rotateY: 2,
    scale: 1.02,
    z: 8,
    transition: { duration: 0.3 },
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  tap: {
    scale: 0.98,
    z: 0,
    transition: { duration: 0.1 },
  },
}

export const flipInY = {
  initial: {
    opacity: 0,
    rotateY: -15,
    transformPerspective: 1000,
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    rotateY: 10,
    transition: { duration: 0.25 },
  },
}

export const tilt3D = {
  rest: { rotateX: 0, rotateY: 0 },
  hover: (x = 5, y = 5) => ({
    rotateX: x,
    rotateY: y,
    transition: { duration: 0.3 },
  }),
}

export const float3D = {
  animate: {
    y: [0, -8, 0],
    rotateY: [0, 5, 0],
    rotateX: [0, 2, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const scaleIn3D = {
  initial: {
    opacity: 0,
    scale: 0.9,
    rotateX: 10,
    transformPerspective: 800,
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export const button3D = {
  rest: {
    scale: 1,
    rotateX: 0,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  },
  hover: {
    scale: 1.02,
    rotateX: -3,
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.15)',
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    rotateX: 0,
    transition: { duration: 0.1 },
  },
}
