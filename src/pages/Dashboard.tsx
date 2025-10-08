import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, TrendingUp, Heart, Eye } from "lucide-react";

const chartData = [
  { name: "Mon", value: 2400 },
  { name: "Tue", value: 1398 },
  { name: "Wed", value: 9800 },
  { name: "Thu", value: 3908 },
  { name: "Fri", value: 4800 },
  { name: "Sat", value: 3800 },
  { name: "Sun", value: 4300 },
];

const Dashboard = () => {
  const stats = [
    { title: "Total Followers", value: "124.5K", change: "+12.5%", icon: Users, color: "from-blue-500 to-cyan-500" },
    { title: "Engagement Rate", value: "8.4%", change: "+2.1%", icon: Heart, color: "from-pink-500 to-rose-500" },
    { title: "Total Reach", value: "2.4M", change: "+18.2%", icon: Eye, color: "from-purple-500 to-indigo-500" },
    { title: "Growth", value: "+15.2K", change: "+24.3%", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Track your social media performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up">
            {stats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 text-muted-foreground`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600 mt-1">
                    {stat.change} from last week
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle>Weekly Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { platform: "Instagram", followers: "45.2K", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
                  { platform: "Twitter", followers: "38.1K", color: "bg-blue-400" },
                  { platform: "Facebook", followers: "28.9K", color: "bg-blue-600" },
                  { platform: "TikTok", followers: "12.3K", color: "bg-black" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${item.color}`} />
                      <span className="font-medium">{item.platform}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.followers}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { action: "New follower on Instagram", time: "2 minutes ago" },
                  { action: "Post reached 10K views", time: "1 hour ago" },
                  { action: "Comment on your TikTok", time: "3 hours ago" },
                  { action: "Shared your content", time: "5 hours ago" },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">{item.action}</span>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
