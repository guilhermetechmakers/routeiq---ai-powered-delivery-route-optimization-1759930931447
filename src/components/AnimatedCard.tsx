import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends ComponentProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function AnimatedCard({ 
  children, 
  className, 
  hover = true,
  ...props 
}: AnimatedCardProps) {
  // Filter out conflicting props
  const { onDrag, onDragStart, onDragEnd, ...motionProps } = props;
  
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "transition-smooth",
        hover && "card-hover",
        className
      )}
      {...(motionProps as any)}
    >
      {children}
    </motion.div>
  );
}