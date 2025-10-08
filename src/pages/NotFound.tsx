import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/AnimatedButton";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Truck, Home, ArrowLeft, Search, HelpCircle, MapPin } from "lucide-react";

export default function NotFound() {
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
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Truck className="h-24 w-24 text-primary" />
              </motion.div>
            </div>
            <motion.h1 
              className="text-6xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              404
            </motion.h1>
            <motion.h2 
              className="text-2xl font-semibold text-foreground mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Page Not Found
            </motion.h2>
            <motion.p 
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              The page you're looking for doesn't exist or has been moved. 
              Don't worry, even the best routes sometimes lead to unexpected destinations!
            </motion.p>
          </div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/">
              <AnimatedButton className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </AnimatedButton>
            </Link>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="mt-8 pt-8 border-t border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <p className="text-sm text-muted-foreground mb-4">Quick Links:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/help">
                <Button variant="ghost" size="sm" className="w-full">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help Center
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" size="sm" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  About
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatedCard>
      </motion.div>
    </div>
  );
}