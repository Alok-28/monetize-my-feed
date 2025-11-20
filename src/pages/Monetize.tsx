import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { DollarSign, TrendingUp, ShoppingBag, CreditCard, Users, Eye, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getInstagramAnalytics } from "@/utils/instagramApi";

const INSTAGRAM_ACCESS_TOKEN = "IGAAqizzrqLQFBZAFI4QW1aUFdvd0xNaTZAFT1J3ZAm5WUk1xVi02cjFVUWNNeXdCUTdsbzdObGpGVmtldkZAQeGxMU1VpUE9aT09JcUgwck9wMVNYbjFjM011QlFQTnp2akFsTU00aGZAaX1B1YWpLNEJuMlFuMm8zUmV0eFM3YU1DUQZDZD";

interface InstagramStats {
  followers: number;
  impressions: number;
  reach: number;
  engagement: number;
  totalLikes: number;
  totalComments: number;
  profileViews: number;
}

const Monetize = () => {
  const [instagramData, setInstagramData] = useState<InstagramStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenueData, setRevenueData] = useState([
    { month: "Jan", revenue: 0, engagement: 0 },
    { month: "Feb", revenue: 0, engagement: 0 },
    { month: "Mar", revenue: 0, engagement: 0 },
    { month: "Apr", revenue: 0, engagement: 0 },
    { month: "May", revenue: 0, engagement: 0 },
    { month: "Jun", revenue: 0, engagement: 0 },
  ]);
  const [mediaData, setMediaData] = useState<any[]>([]);

  useEffect(() => {
    const fetchInstagramData = async () => {
      try {
        setLoading(true);
        const analytics = await getInstagramAnalytics(INSTAGRAM_ACCESS_TOKEN);
        
        // Calculate total engagement from media (likes + comments)
        const totalLikes = analytics.media.reduce((sum, m) => sum + (m.like_count || 0), 0);
        const totalComments = analytics.media.reduce((sum, m) => sum + (m.comments_count || 0), 0);
        const totalEngagement = totalLikes + totalComments;
        
        // Calculate estimated revenue (example: $0.01 per engagement)
        const estimatedRevenue = Math.round(totalEngagement * 0.01);
        
        // Calculate total impressions from media
        const totalImpressions = analytics.media.reduce((sum, m) => sum + (m.impressions || 0), 0);
        
        setInstagramData({
          followers: analytics.account.followers_count || analytics.insights.follower_count || 0,
          impressions: totalImpressions || analytics.insights.total_interactions || 0,
          reach: analytics.insights.reach || 0,
          engagement: totalEngagement,
          totalLikes,
          totalComments,
          profileViews: analytics.insights.profile_views || 0,
        });

        // Update revenue data with estimated values
        const monthlyData = revenueData.map((month, index) => ({
          ...month,
          revenue: Math.round(estimatedRevenue * (0.8 + index * 0.05)),
          engagement: Math.round(totalEngagement * (0.7 + index * 0.05)),
        }));
        setRevenueData(monthlyData);

        // Set media data for transactions
        setMediaData(analytics.media.slice(0, 5));
      } catch (err: any) {
        console.error("Error fetching Instagram data:", err);
        const errorMessage = err.message || "Failed to fetch Instagram analytics";
        setError(errorMessage);
        
        // Set default values on error
        setInstagramData({
          followers: 0,
          impressions: 0,
          reach: 0,
          engagement: 0,
          totalLikes: 0,
          totalComments: 0,
          profileViews: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toLocaleString()}`;
  };

  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const estimatedRevenue = instagramData ? Math.round(instagramData.engagement * 0.01) : 0;
  const avgPerPost = mediaData.length > 0 ? Math.round(estimatedRevenue / mediaData.length) : 0;
  const estimatedProducts = Math.round(instagramData?.engagement || 0 / 100);
  const estimatedSponsorships = Math.round((instagramData?.followers || 0) / 1000);

  const stats = [
    { 
      title: "Total Revenue", 
      value: formatNumber(estimatedRevenue), 
      change: "+23.1%", 
      icon: DollarSign, 
      color: "from-green-500 to-emerald-500" 
    },
    { 
      title: "Avg. Per Post", 
      value: formatNumber(avgPerPost), 
      change: "+8.2%", 
      icon: TrendingUp, 
      color: "from-blue-500 to-cyan-500" 
    },
    { 
      title: "Total Engagement", 
      value: formatCount(instagramData?.engagement || 0), 
      change: "+15.3%", 
      icon: Heart, 
      color: "from-purple-500 to-pink-500" 
    },
    { 
      title: "Followers", 
      value: formatCount(instagramData?.followers || 0), 
      change: "+12.0%", 
      icon: Users, 
      color: "from-orange-500 to-red-500" 
    },
  ];

  const postAnalyticsData = mediaData.map((post) => {
    const postDate = new Date(post.timestamp);
    return {
      label: postDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      likes: post.like_count || 0,
      views: post.views ?? post.impressions ?? post.reach ?? 0,
      comments: post.comments_count || 0,
    };
  });

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Instagram Monetization</h1>
              <p className="text-muted-foreground">Track your Instagram earnings and revenue streams</p>
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

          {loading && (
            <Card className="border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Loading Instagram analytics...</p>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-destructive/50" style={{ boxShadow: 'var(--shadow-card)' }}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <p className="text-destructive font-semibold">Error: {error}</p>
                  {error.includes('Invalid or expired') || error.includes('OAuth') ? (
                    <div className="text-sm text-muted-foreground space-y-2 bg-muted/50 p-4 rounded-lg">
                      <p className="font-medium">How to fix:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Go to <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook Developer Console</a></li>
                        <li>Select your app and go to Tools → Graph API Explorer</li>
                        <li>Generate a new User Access Token with the following permissions:
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li>instagram_basic</li>
                            <li>instagram_manage_insights</li>
                            <li>pages_read_engagement</li>
                          </ul>
                        </li>
                        <li>Copy the new access token and update it in the code</li>
                      </ol>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-up">
                <Card className="border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <CardHeader>
                    <CardTitle className="text-xl">Instagram Revenue Trend</CardTitle>
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
                          dataKey="engagement" 
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
                    <CardTitle className="text-xl">Instagram Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={[
                        { name: "Impressions", value: instagramData?.impressions || 0 },
                        { name: "Reach", value: instagramData?.reach || 0 },
                        { name: "Engagement", value: instagramData?.engagement || 0 },
                        { name: "Profile Views", value: instagramData?.profileViews || 0 },
                      ]}>
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

              {mediaData.length > 0 && (
                <Card className="border-border animate-fade-up" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <CardHeader>
                    <CardTitle className="text-xl">Real-Time Likes & Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart data={postAnalyticsData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="label" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(value) => formatCount(value as number)} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                          formatter={(value, name) => {
                            const friendlyName = name === 'likes' ? 'Likes' : 'Views';
                            return [formatCount((value as number) || 0), friendlyName];
                          }}
                          labelFormatter={(label) => `Posted ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone"
                          dataKey="likes"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "hsl(var(--primary))" }}
                          name="Likes"
                        />
                        <Line 
                          type="monotone"
                          dataKey="views"
                          stroke="hsl(var(--accent))"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "hsl(var(--accent))" }}
                          name="Views"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-up">
              <Card className="lg:col-span-2 border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
                <CardHeader>
                  <CardTitle className="text-xl">Recent Instagram Posts · Real-Time Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mediaData.length > 0 ? (
                      mediaData.map((post, index) => {
                        const postDate = new Date(post.timestamp);
                        const formattedDate = postDate.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        });
                        const formattedTime = postDate.toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        const daysAgo = Math.floor((Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24));
                        const dateLabel = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;
                        const viewCount = post.views ?? post.impressions ?? post.reach ?? 0;
                        
                        return (
                          <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:scale-[1.02] animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {post.media_type === 'VIDEO' ? 'Video Post' : 'Photo Post'}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Instagram · {dateLabel}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Posted on {formattedDate} at {formattedTime}
                              </span>
                              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" /> {formatCount(post.like_count || 0)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" /> {formatCount(post.comments_count || 0)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" /> {formatCount(viewCount)}
                                </span>
                              </div>
                            </div>
                            {post.permalink ? (
                              <a 
                                href={post.permalink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm font-semibold text-primary hover:underline"
                              >
                                View Post
                              </a>
                            ) : (
                              <span className="text-sm text-muted-foreground">Link unavailable</span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No recent posts found</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
                <CardHeader>
                  <CardTitle className="text-xl">Instagram Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { source: "Impressions", value: instagramData?.impressions || 0, icon: Eye },
                    { source: "Reach", value: instagramData?.reach || 0, icon: TrendingUp },
                    { source: "Engagement", value: instagramData?.engagement || 0, icon: Heart },
                    { source: "Profile Views", value: instagramData?.profileViews || 0, icon: Users },
                  ].map((item, index) => {
                    const maxValue = Math.max(
                      instagramData?.impressions || 0,
                      instagramData?.reach || 0,
                      instagramData?.engagement || 0,
                      instagramData?.profileViews || 0
                    );
                    const percentage = maxValue > 0 ? Math.round((item.value / maxValue) * 100) : 0;
                    
                    return (
                      <div key={index} className="space-y-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex justify-between text-sm items-center">
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4 text-primary" />
                            <span className="font-medium">{item.source}</span>
                          </div>
                          <span className="text-muted-foreground">{percentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700 hover:scale-105"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">{formatCount(item.value)}</div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Monetize;
