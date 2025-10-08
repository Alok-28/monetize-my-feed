import { NavLink } from "react-router-dom";
import { LayoutDashboard, DollarSign, BarChart3, LogOut, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardSidebar = () => {
  const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Monetize", url: "/monetize", icon: DollarSign },
    { title: "Upload Content", url: "/dashboard?tab=upload", icon: Upload },
  ];

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border p-6 flex flex-col animate-slide-in">
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg" style={{ boxShadow: 'var(--shadow-glow)' }}>
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AutoMonetize AI
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item, index) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 animate-fade-in ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`
            }
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <Button
        variant="outline"
        className="w-full justify-start gap-3"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </Button>
    </aside>
  );
};

export default DashboardSidebar;
