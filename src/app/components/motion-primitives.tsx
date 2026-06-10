import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState, ReactNode } from "react";

const EASE = [0.2, 0, 0, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "p" | "h1" | "h2" | "h3" | "span";
  once?: boolean;
  amount?: number;
};

export function Reveal({
  children,
  delay = 0,
  y = 16,
  duration = 0.5,
  className,
  as = "div",
  once = true,
  amount = 0.1,
}: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

type SlideInProps = RevealProps & { from?: "left" | "right" };

export function SlideIn({
  children,
  from = "left",
  delay = 0,
  duration = 0.5,
  className,
  amount = 0.15,
}: SlideInProps) {
  const x = from === "left" ? -16 : 16;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.8,
  className,
  amount = 0.3,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

type CounterProps = {
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
};

export function Counter({ to, duration = 1.2, delay = 0, suffix = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => Math.round(v).toString());
  const [showSuffix, setShowSuffix] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration,
      delay,
      ease: EASE,
      onComplete: () => setShowSuffix(true),
    });
    return controls.stop;
  }, [inView, to, duration, delay, value]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{rounded}</motion.span>
      {suffix && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: showSuffix ? 1 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          {suffix}
        </motion.span>
      )}
    </span>
  );
}

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
};

export function FadeIn({ children, className, delay = 0, duration = 0.5, y = 0 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function PageFade({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
