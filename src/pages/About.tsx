import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/AnimatedButton";
import { AnimatedCard } from "@/components/AnimatedCard";
import { 
  Truck, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin,
  Users,
  Award,
  Shield
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "AI-Powered Optimization",
    description: "Advanced algorithms analyze traffic, weather, and delivery patterns to create the most efficient routes."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamless communication between dispatchers, drivers, and management with real-time updates."
  },
  {
    icon: Award,
    title: "Proven Results",
    description: "Our customers see 30% reduction in delivery time and 25% savings in fuel costs on average."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with role-based access control, data encryption, and compliance standards."
  }
];

const faqs = [
  {
    question: "How does RouteIQ optimize delivery routes?",
    answer: "RouteIQ uses advanced AI algorithms that analyze real-time traffic data, weather conditions, delivery time windows, and historical patterns to create the most efficient routes for your drivers."
  },
  {
    question: "Can RouteIQ integrate with our existing systems?",
    answer: "Yes, RouteIQ offers comprehensive APIs and integrations with popular fleet management systems, CRMs, and other logistics software to seamlessly fit into your existing workflow."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We offer 24/7 customer support, comprehensive documentation, training sessions, and dedicated account managers for enterprise customers to ensure your success."
  },
  {
    question: "Is my data secure with RouteIQ?",
    answer: "Absolutely. We use enterprise-grade security measures including data encryption, secure cloud infrastructure, and comply with industry standards like SOC 2 and GDPR."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">RouteIQ</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/signup">
                <AnimatedButton>Get Started</AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About RouteIQ
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We're revolutionizing logistics with AI-powered route optimization that helps 
            companies deliver more efficiently, reduce costs, and improve customer satisfaction.
          </motion.p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <AnimatedCard className="p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              To transform the logistics industry by making delivery operations more efficient, 
              sustainable, and profitable through cutting-edge AI technology. We believe that 
              every delivery should be optimized, every route should be efficient, and every 
              customer should receive their package on time.
            </p>
          </AnimatedCard>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Why Choose RouteIQ?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <AnimatedCard className="p-6 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <AnimatedCard className="p-12">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Our Impact
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                <div className="text-muted-foreground">Routes Optimized</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">30%</div>
                <div className="text-muted-foreground">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">25%</div>
                <div className="text-muted-foreground">Fuel Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <AnimatedCard className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">
                    {faq.answer}
                  </p>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <AnimatedCard className="p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have questions about RouteIQ? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">support@routeiq.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">San Francisco, CA</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <AnimatedButton size="lg">
                  Start Free Trial
                </AnimatedButton>
              </Link>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">RouteIQ</span>
            </div>
            <p className="text-muted-foreground mb-4">
              AI-powered delivery route optimization for modern logistics companies.
            </p>
            <p className="text-sm text-muted-foreground">
              &copy; 2024 RouteIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}