import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedButton } from "@/components/AnimatedButton";
import { 
  Truck, 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  Fuel,
  DollarSign,
  Eye
} from "lucide-react";

// Mock data - in real app this would come from API
const mockReports = [
  {
    id: "1",
    title: "Weekly Performance Report",
    period: "Dec 16-22, 2024",
    type: "weekly",
    status: "completed",
    generated_at: "2024-12-22T10:00:00Z",
    metrics: {
      routes_completed: 156,
      total_distance: 1247.5,
      total_duration: 89.2,
      fuel_consumed: 234.8,
      on_time_deliveries: 147,
      delayed_deliveries: 9,
      efficiency_score: 89,
      cost_savings: 2340.50,
      time_savings: 12.5
    },
    insights: [
      {
        title: "Peak Performance Time",
        description: "Routes starting between 8-9 AM show 15% better efficiency",
        impact: "positive"
      },
      {
        title: "Traffic Bottleneck Identified",
        description: "Highway 101 between 3-5 PM causes average 20-minute delays",
        impact: "negative"
      }
    ]
  },
  {
    id: "2",
    title: "Monthly Performance Report",
    period: "November 2024",
    type: "monthly",
    status: "completed",
    generated_at: "2024-12-01T09:00:00Z",
    metrics: {
      routes_completed: 624,
      total_distance: 4987.2,
      total_duration: 356.8,
      fuel_consumed: 939.2,
      on_time_deliveries: 588,
      delayed_deliveries: 36,
      efficiency_score: 87,
      cost_savings: 9362.00,
      time_savings: 48.2
    },
    insights: [
      {
        title: "Weather Impact Analysis",
        description: "Rainy days reduce efficiency by 8% on average",
        impact: "negative"
      },
      {
        title: "Driver Performance Improvement",
        description: "John Smith shows 12% improvement in route efficiency",
        impact: "positive"
      }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "generating":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case "positive":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "negative":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

export default function PerformanceReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const handleDownload = (reportId: string, format: string) => {
    console.log(`Downloading report ${reportId} in ${format} format`);
  };

  const handleViewReport = (reportId: string) => {
    console.log(`Viewing report ${reportId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">RouteIQ</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-foreground">Performance Reports</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
              <AnimatedButton>
                <Calendar className="h-4 w-4 mr-2" />
                Generate Report
              </AnimatedButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6">
              {mockReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <AnimatedCard className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {report.title}
                        </h3>
                        <p className="text-muted-foreground mb-2">{report.period}</p>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Generated {new Date(report.generated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(report.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(report.id, "pdf")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(report.id, "csv")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          CSV
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {report.metrics.routes_completed}
                        </div>
                        <div className="text-sm text-muted-foreground">Routes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {report.metrics.efficiency_score}%
                        </div>
                        <div className="text-sm text-muted-foreground">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          ${report.metrics.cost_savings.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Savings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {report.metrics.time_savings}h
                        </div>
                        <div className="text-sm text-muted-foreground">Time Saved</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Key Insights:</h4>
                      {report.insights.map((insight, insightIndex) => (
                        <div key={insightIndex} className="flex items-start space-x-2">
                          {getImpactIcon(insight.impact)}
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {insight.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnimatedCard className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Performance Analytics</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-3">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">89%</div>
                  <div className="text-sm text-muted-foreground">Average Efficiency</div>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">+12%</div>
                  <div className="text-sm text-muted-foreground">vs Last Month</div>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">94%</div>
                  <div className="text-sm text-muted-foreground">On-Time Rate</div>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-yellow-100 rounded-lg w-fit mx-auto mb-3">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">$9.3K</div>
                  <div className="text-sm text-muted-foreground">Monthly Savings</div>
                </div>
              </div>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <AnimatedCard className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">AI Insights & Recommendations</h2>
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-900 mb-1">
                        Route Optimization Opportunity
                      </h3>
                      <p className="text-sm text-green-700 mb-2">
                        Consolidating routes 15 and 23 could save 2.3 hours and 45km of driving.
                      </p>
                      <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                        Apply Recommendation
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 mb-1">
                        Departure Time Optimization
                      </h3>
                      <p className="text-sm text-blue-700 mb-2">
                        Starting routes 30 minutes earlier could improve on-time delivery rate by 8%.
                      </p>
                      <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Fuel className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-900 mb-1">
                        Fuel Efficiency Alert
                      </h3>
                      <p className="text-sm text-yellow-700 mb-2">
                        Vehicle #003 shows 15% higher fuel consumption. Consider maintenance check.
                      </p>
                      <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300">
                        Schedule Maintenance
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}