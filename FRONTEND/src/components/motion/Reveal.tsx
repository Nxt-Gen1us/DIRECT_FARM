import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const variants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.7, ease } },
  },
  up: {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  },
  left: {
    hidden: { opacity: 0, x: -24 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
  },
  right: {
    hidden: { opacity: 0, x: 24 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
  },
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: keyof typeof variants;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={variants[direction]}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className = "",
  delay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.35, ease } },
  whileTap: { scale: 0.99 },
};
