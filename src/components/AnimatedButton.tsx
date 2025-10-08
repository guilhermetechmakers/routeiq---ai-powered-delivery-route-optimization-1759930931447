import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ComponentProps<"button"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  className?: string;
}

export function AnimatedButton({ 
  children, 
  className, 
  variant = "default",
  size = "default",
  ...props 
}: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn("transition-smooth", className)}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}