import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const revenueData = [
  { month: "Jan", revenue: 4200, sponsored: 2100 },
  { month: "Feb", revenue: 5800, sponsored: 2800 },
  { month: "Mar", revenue: 7200, sponsored: 3500 },
  { month: "Apr", revenue: 6800, sponsored: 3200 },
  { month: "May", revenue: 8900, sponsored: 4100 },
  { month: "Jun", revenue: 9500, sponsored: 4500 },
];

const platformRevenue = [
  { name: "Instagram", value: 45000 },
  { name: "YouTube", value: 38000 },
  { name: "TikTok", value: 28000 },
  { name: "Twitter", value: 15000 },
];

const Monetize = () => {
  const stats = [
    { title: "Total Revenue", value: "$126,450", change: "+23.1%", icon: DollarSign, color: "from-green-500 to-emerald-500" },
    { title: "Avg. Per Post", value: "$1,240", change: "+8.2%", icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
    { title: "Products Sold", value: "2,340", change: "+15.3%", icon: ShoppingBag, color: "from-purple-500 to-pink-500" },
    { title: "Sponsorships", value: "28", change: "+12.0%", icon: CreditCard, color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Monetization</h1>
              <p className="text-muted-foreground">Track your earnings and revenue streams</p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg" style={{ boxShadow: 'var(--shadow-glow)' }}>
              View Payouts
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
            {stats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-105 border-border" style={{ boxShadow: 'var(--shadow-card)', animationDelay: `${index * 100}ms` }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-5 w-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-500 mt-1">
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-up">
            <Card className="border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
              <CardHeader>
                <CardTitle className="text-xl">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sponsored" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--accent))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
              <CardHeader>
                <CardTitle className="text-xl">Platform Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={platformRevenue}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-up">
            <Card className="lg:col-span-2 border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
              <CardHeader>
                <CardTitle className="text-xl">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: "Sponsored Post", platform: "Instagram", amount: "$2,400", date: "Today" },
                    { type: "Affiliate Sales", platform: "YouTube", amount: "$1,850", date: "Yesterday" },
                    { type: "Brand Deal", platform: "TikTok", amount: "$5,000", date: "2 days ago" },
                    { type: "Product Launch", platform: "Instagram", amount: "$8,200", date: "3 days ago" },
                    { type: "Sponsored Video", platform: "YouTube", amount: "$3,500", date: "5 days ago" },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:scale-[1.02] animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex flex-col">
                        <span className="font-medium">{transaction.type}</span>
                        <span className="text-sm text-muted-foreground">{transaction.platform} · {transaction.date}</span>
                      </div>
                      <span className="text-lg font-bold text-green-500">{transaction.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
              <CardHeader>
                <CardTitle className="text-xl">Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { source: "Sponsored Content", percentage: 45, amount: "$56,800" },
                  { source: "Affiliate Marketing", percentage: 30, amount: "$37,900" },
                  { source: "Product Sales", percentage: 15, amount: "$18,950" },
                  { source: "Ad Revenue", percentage: 10, amount: "$12,650" },
                ].map((item, index) => (
                  <div key={index} className="space-y-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.source}</span>
                      <span className="text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700 hover:scale-105"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">{item.amount}</div>
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

export default Monetize;
