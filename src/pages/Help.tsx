import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedButton } from "@/components/AnimatedButton";
import { 
  Truck, 
  Search, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone, 
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  FileText,
  Video,
  Download,
  ExternalLink,
} from "lucide-react";

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of RouteIQ",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-800",
    articles: [
      { title: "Welcome to RouteIQ", duration: "5 min", type: "guide" },
      { title: "Setting up your first route", duration: "10 min", type: "tutorial" },
      { title: "Understanding the dashboard", duration: "8 min", type: "guide" },
      { title: "User roles and permissions", duration: "6 min", type: "guide" }
    ]
  },
  {
    id: "route-management",
    title: "Route Management",
    description: "Create and optimize delivery routes",
    icon: Truck,
    color: "bg-green-100 text-green-800",
    articles: [
      { title: "Creating a new route", duration: "12 min", type: "tutorial" },
      { title: "Adding stops to routes", duration: "8 min", type: "tutorial" },
      { title: "Route optimization settings", duration: "10 min", type: "guide" },
      { title: "Managing route templates", duration: "7 min", type: "guide" }
    ]
  },
  {
    id: "analytics",
    title: "Analytics & Reports",
    description: "Track performance and generate reports",
    icon: FileText,
    color: "bg-purple-100 text-purple-800",
    articles: [
      { title: "Understanding performance metrics", duration: "15 min", type: "guide" },
      { title: "Generating reports", duration: "8 min", type: "tutorial" },
      { title: "Custom report builder", duration: "12 min", type: "tutorial" },
      { title: "Exporting data", duration: "5 min", type: "guide" }
    ]
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect with external systems",
    icon: ExternalLink,
    color: "bg-orange-100 text-orange-800",
    articles: [
      { title: "API documentation", duration: "20 min", type: "guide" },
      { title: "Webhook setup", duration: "10 min", type: "tutorial" },
      { title: "Third-party integrations", duration: "15 min", type: "guide" },
      { title: "Data synchronization", duration: "12 min", type: "tutorial" }
    ]
  }
];

const faqs = [
  {
    question: "How do I create my first route?",
    answer: "To create your first route, go to the Dashboard and click 'New Route'. Fill in the basic information, add your stops, and configure optimization settings. The system will automatically calculate the most efficient route for you."
  },
  {
    question: "Can I import routes from other systems?",
    answer: "Yes, RouteIQ supports importing routes from CSV files and integrates with popular fleet management systems. Go to Settings > Integrations to set up data imports."
  },
  {
    question: "How does the AI optimization work?",
    answer: "Our AI analyzes real-time traffic data, weather conditions, delivery time windows, and historical patterns to create the most efficient routes. It continuously learns from your delivery patterns to improve over time."
  },
  {
    question: "What if a driver goes off-route?",
    answer: "RouteIQ automatically detects when a driver deviates from the planned route and can suggest alternative paths or re-optimize the remaining stops in real-time."
  },
  {
    question: "How do I set up notifications?",
    answer: "Go to Settings > Notifications to configure email, SMS, and push notifications. You can customize which events trigger notifications for different user roles."
  },
  {
    question: "Can I customize the dashboard?",
    answer: "Yes, you can customize the dashboard by dragging and dropping widgets, changing the layout, and selecting which metrics to display based on your role and preferences."
  }
];

const quickActions = [
  {
    title: "Contact Support",
    description: "Get help from our support team",
    icon: MessageCircle,
    action: "contact"
  },
  {
    title: "Schedule Demo",
    description: "Book a personalized demo",
    icon: Video,
    action: "demo"
  },
  {
    title: "Download App",
    description: "Get the mobile app",
    icon: Download,
    action: "download"
  },
  {
    title: "API Documentation",
    description: "Developer resources",
    icon: FileText,
    action: "api"
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "contact":
        // Open contact modal or redirect
        console.log("Opening contact support");
        break;
      case "demo":
        // Open demo booking
        console.log("Opening demo booking");
        break;
      case "download":
        // Redirect to download page
        console.log("Redirecting to download");
        break;
      case "api":
        // Redirect to API docs
        console.log("Redirecting to API docs");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Truck className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">RouteIQ</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-foreground">Help Center</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How can we help you?
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Find answers, guides, and tutorials to get the most out of RouteIQ
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search help articles, guides, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </motion.div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <AnimatedCard 
                      className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <action.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Help Categories */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Category</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <AnimatedCard className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${category.color}`}>
                          <category.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {category.title}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {category.description}
                          </p>
                          <div className="space-y-2">
                            {category.articles.slice(0, 3).map((article, articleIndex) => (
                              <div key={articleIndex} className="flex items-center justify-between">
                                <span className="text-sm text-foreground">{article.title}</span>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {article.type}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {article.duration}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {category.articles.length > 3 && (
                              <p className="text-sm text-primary hover:underline cursor-pointer">
                                View {category.articles.length - 3} more articles
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guides" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Step-by-Step Guides</h2>
              <div className="space-y-6">
                {helpCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <AnimatedCard className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`p-3 rounded-lg ${category.color}`}>
                          <category.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">
                            {category.title}
                          </h3>
                          <p className="text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {category.articles.map((article, articleIndex) => (
                          <div 
                            key={articleIndex}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                {article.type === 'tutorial' ? (
                                  <Video className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <FileText className="h-4 w-4 text-green-500" />
                                )}
                                <span className="font-medium text-foreground">{article.title}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {article.type}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {article.duration}
                              </span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="border rounded-lg">
                      <button
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      >
                        <div className="flex items-center space-x-3">
                          <HelpCircle className="h-5 w-5 text-primary" />
                          <span className="font-medium">{faq.question}</span>
                        </div>
                        <ChevronDown 
                          className={`h-5 w-5 text-muted-foreground transition-transform ${
                            openFaqIndex === index ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      {openFaqIndex === index && (
                        <div className="px-6 pb-4 border-t bg-muted/25">
                          <p className="text-muted-foreground leading-relaxed pt-4">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <AnimatedCard className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Email Support</h3>
                        <p className="text-muted-foreground">support@routeiq.com</p>
                        <p className="text-sm text-muted-foreground">Response time: 2-4 hours</p>
                      </div>
                    </div>
                  </AnimatedCard>

                  <AnimatedCard className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Phone Support</h3>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                        <p className="text-sm text-muted-foreground">Mon-Fri, 9 AM - 6 PM EST</p>
                      </div>
                    </div>
                  </AnimatedCard>

                  <AnimatedCard className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <MessageCircle className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Live Chat</h3>
                        <p className="text-muted-foreground">Available 24/7</p>
                        <p className="text-sm text-muted-foreground">Click to start a conversation</p>
                      </div>
                    </div>
                  </AnimatedCard>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                <AnimatedCard className="p-6">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <Input placeholder="What can we help you with?" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        rows={4}
                        placeholder="Describe your question or issue..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Priority
                      </label>
                      <select className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Need assistance</option>
                        <option value="high">High - Urgent issue</option>
                      </select>
                    </div>
                    <AnimatedButton className="w-full">
                      Send Message
                    </AnimatedButton>
                  </form>
                </AnimatedCard>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}