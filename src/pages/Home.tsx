import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedButton } from "@/components/AnimatedButton";
import { 
  Truck, 
  MapPin, 
  Clock, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  Star
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "AI-Powered Route Optimization",
    description: "Advanced algorithms analyze traffic, weather, and delivery patterns to create the most efficient routes."
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description: "Live tracking and automatic re-optimization as conditions change throughout the day."
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Comprehensive reports and insights to help you improve delivery efficiency and reduce costs."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with role-based access control and data encryption."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimize thousands of routes in seconds with our high-performance cloud infrastructure."
  },
  {
    icon: Truck,
    title: "Fleet Management",
    description: "Complete visibility into your delivery operations with driver and vehicle tracking."
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Operations Manager",
    company: "QuickDeliver Inc.",
    content: "RouteIQ reduced our delivery time by 30% and fuel costs by 25%. The AI optimization is incredible!",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Fleet Director",
    company: "Metro Logistics",
    content: "The real-time updates and performance reports have transformed how we manage our operations.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "CEO",
    company: "City Express",
    content: "RouteIQ's simulation tools helped us plan for peak season perfectly. Highly recommended!",
    rating: 5
  }
];

const stats = [
  { label: "Routes Optimized", value: "1M+" },
  { label: "Fuel Saved", value: "500K+ Gallons" },
  { label: "Time Saved", value: "2M+ Hours" },
  { label: "Happy Customers", value: "10K+" }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">RouteIQ</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/signup">
                <AnimatedButton>Get Started</AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              AI-Powered Delivery
              <br />
              <span className="text-primary">Route Optimization</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Maximize delivery efficiency with intelligent route planning, real-time optimization, 
              and comprehensive analytics for logistics companies.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/signup">
                <AnimatedButton size="lg" className="text-lg px-8 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </AnimatedButton>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Modern Logistics
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to optimize your delivery operations and reduce costs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <AnimatedCard className="p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers say about RouteIQ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <AnimatedCard className="p-6 h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard className="bg-primary text-primary-foreground p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Optimize Your Routes?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of logistics companies already using RouteIQ to improve efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <AnimatedButton 
                  size="lg" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary-hover"
                >
                  Start Free Trial
                </AnimatedButton>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">RouteIQ</span>
              </div>
              <p className="text-muted-foreground">
                AI-powered delivery route optimization for modern logistics companies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">Features</Link></li>
                <li><Link to="/about" className="hover:text-foreground">Pricing</Link></li>
                <li><Link to="/about" className="hover:text-foreground">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">About</Link></li>
                <li><Link to="/about" className="hover:text-foreground">Contact</Link></li>
                <li><Link to="/about" className="hover:text-foreground">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">Help Center</Link></li>
                <li><Link to="/about" className="hover:text-foreground">Documentation</Link></li>
                <li><Link to="/about" className="hover:text-foreground">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 RouteIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}