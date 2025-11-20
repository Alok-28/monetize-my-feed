import { useSearchParams } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import UploadContent from "@/components/UploadContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings, Twitter, Youtube, Instagram, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  const connectedAccounts = [
    { platform: "X (Twitter)", username: "@creative_user", icon: Twitter, color: "bg-blue-400", connected: true },
    { platform: "YouTube", username: "/creativeuser", icon: Youtube, color: "bg-red-600", connected: true },
    { platform: "Instagram", username: "@creative.user", icon: Instagram, color: "bg-gradient-to-r from-purple-500 to-pink-500", connected: true },
    { platform: "Threads", username: "@creative.user", icon: LinkIcon, color: "bg-gray-800", connected: true },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-muted-foreground">Manage your content and profile</p>
          </div>

          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="upload" className="transition-all duration-300">Upload Content</TabsTrigger>
              <TabsTrigger value="profile" className="transition-all duration-300">Profile & Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <UploadContent />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <Card className="lg:col-span-1 border-border animate-fade-up" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <Users className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Creative User</h2>
                    <p className="text-muted-foreground mb-4">@creative_user_handle</p>
                    <p className="text-sm text-muted-foreground">
                      Content creator focusing on design, tech, and social media trends.
                    </p>
                    <div className="mt-4">
                      <button className="w-full py-2 px-4 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">
                        Edit Profile
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-border animate-fade-up" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">Connected Social Accounts</CardTitle>
                    <Settings className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {connectedAccounts.map((account, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${account.color} shadow-md text-white`}>
                            <account.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-medium block">{account.platform}</span>
                            <span className="text-sm text-muted-foreground">{account.username}</span>
                          </div>
                        </div>
                        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${account.connected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                          {account.connected ? 'Connected' : 'Connect'}
                        </div>
                      </div>
                    ))}
                    <div className="pt-4">
                      <button className="w-full py-2 px-4 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">
                        Link New Account
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
