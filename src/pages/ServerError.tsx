import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/AnimatedButton";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Truck, Home, RefreshCw, Mail, AlertTriangle, Clock, Wrench } from "lucide-react";

export default function ServerError() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl w-full"
      >
        <AnimatedCard className="p-12">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0.8, rotate: 10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Truck className="h-24 w-24 text-destructive" />
              </motion.div>
            </div>
            <motion.h1 
              className="text-6xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              500
            </motion.h1>
            <motion.h2 
              className="text-2xl font-semibold text-foreground mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Server Error
            </motion.h2>
            <motion.p 
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Something went wrong on our end. Our team has been notified and is working to fix this issue. 
              This usually takes just a few minutes.
            </motion.p>
          </div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
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
          </motion.div>

          {/* Status Information */}
          <motion.div 
            className="mt-8 pt-8 border-t border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span>Issue Detected</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <Wrench className="h-4 w-4 text-blue-500" />
                <span>Fixing in Progress</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-green-500" />
                <span>ETA: 5-10 min</span>
              </div>
            </div>
          </motion.div>

          {/* Helpful Links */}
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-sm text-muted-foreground mb-3">While you wait:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/help">
                <Button variant="ghost" size="sm">
                  Help Center
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" size="sm">
                  About RouteIQ
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </motion.div>
        </AnimatedCard>
      </motion.div>
    </div>
  );
}