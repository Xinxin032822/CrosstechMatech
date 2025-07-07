export const pageVariants = {
  initial: {
    opacity: 0,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    filter: "blur(8px)",
  },
};

export const pageTransition = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1],
};
