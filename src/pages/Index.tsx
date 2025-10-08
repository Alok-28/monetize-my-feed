import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, DollarSign, Users, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-12 pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-glow" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary text-sm font-medium animate-fade-in">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Analytics Platform</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
                  AutoMonetize AI
                </span>
                <br />
                <span className="text-foreground">Your Revenue Engine</span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Transform your content into revenue with AI-powered analytics, automated monetization, and real-time insights across all platforms.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 hover:scale-105 text-lg px-8 shadow-lg" style={{ boxShadow: 'var(--shadow-glow)' }}>
                    Start Earning Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-primary/30 hover:bg-primary/10 transition-all duration-300 hover:scale-105">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-fade-up">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl animate-glow" />
              <img 
                src={heroImage} 
                alt="AutoMonetize AI Dashboard" 
                className="relative rounded-2xl w-full border border-primary/20"
                style={{ boxShadow: 'var(--shadow-elegant)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Everything You Need to Succeed</h2>
            <p className="text-lg text-muted-foreground">
              AI-powered tools designed for modern content creators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-5 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 group animate-fade-in"
                style={{ boxShadow: 'var(--shadow-card)', animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 p-3 bg-gradient-to-br from-primary/20 to-accent/20 w-fit rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background animate-glow" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Scale Your Revenue?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of creators using AutoMonetize AI to maximize their earnings.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 hover:scale-105 text-lg px-12 shadow-lg" style={{ boxShadow: 'var(--shadow-glow)' }}>
                Start Earning Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AutoMonetize AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 AutoMonetize AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
