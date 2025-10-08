import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, DollarSign, Users } from "lucide-react";
import heroImage from "@/assets/hero-analytics.jpg";

const Index = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track your social media performance across all platforms in real-time with beautiful visualizations."
    },
    {
      icon: TrendingUp,
      title: "Growth Insights",
      description: "Get actionable insights to grow your audience and increase engagement rates."
    },
    {
      icon: DollarSign,
      title: "Revenue Tracking",
      description: "Monitor your earnings from sponsorships, affiliate marketing, and product sales."
    },
    {
      icon: Users,
      title: "Audience Analytics",
      description: "Understand your audience demographics and behavior patterns across platforms."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10 pb-16">
        <div className="container mx-auto px-4 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                <span>Your Social Media Command Center</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Grow & Monetize Your{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Social Presence
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Track analytics, monitor growth, and maximize revenue across all your social media platforms from one beautiful dashboard.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-fade-up">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
              <img 
                src={heroImage} 
                alt="Analytics Dashboard" 
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground">
              Powerful analytics and monetization tools designed for modern content creators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-up">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all group"
              >
                <div className="mb-4 p-3 bg-gradient-to-br from-primary/10 to-accent/10 w-fit rounded-xl group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Scale Your Social Media?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of creators already using Analytics Pro to grow their audience and revenue.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-12">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Analytics Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Analytics Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
