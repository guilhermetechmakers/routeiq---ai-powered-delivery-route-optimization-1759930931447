import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/AnimatedButton";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Truck, Home, RefreshCw, Mail } from "lucide-react";

export default function ServerError() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <AnimatedCard className="p-12 max-w-md">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <Truck className="h-24 w-24 text-destructive" />
            </div>
            <h1 className="text-6xl font-bold text-foreground mb-4">500</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Server Error
            </h2>
            <p className="text-muted-foreground">
              Something went wrong on our end. We're working to fix this issue.
            </p>
          </div>

          <div className="space-y-4">
            <AnimatedButton 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </AnimatedButton>
            <Link to="/">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button variant="ghost" className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </AnimatedCard>
      </motion.div>
    </div>
  );
}