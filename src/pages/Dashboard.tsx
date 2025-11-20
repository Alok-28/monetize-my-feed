import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import UploadContent from "@/components/UploadContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Heart, Eye, Settings, Link as LinkIcon, Twitter, Youtube, Instagram } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const platformIcons = {
  "X (Twitter)": Twitter,
  "YouTube": Youtube,
  "Instagram": Instagram,
  "Threads": LinkIcon,
};

const platformColors = {
  "X (Twitter)": "bg-blue-400",
  "YouTube": "bg-red-600",
  "Instagram": "bg-gradient-to-r from-purple-500 to-pink-500",
  "Threads": "bg-gray-800",
};

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
}

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "upload";
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlatform, setNewPlatform] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchAccounts(user.id);
      }
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAccounts(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAccounts = async (userId: string) => {
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching accounts:', error);
      return;
    }

    setAccounts(data || []);

    // Set up realtime subscription
    const channel = supabase
      .channel('social-accounts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_accounts',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAccounts((prev) => [...prev, payload.new as SocialAccount]);
          } else if (payload.eventType === 'UPDATE') {
            setAccounts((prev) =>
              prev.map((acc) => (acc.id === payload.new.id ? payload.new as SocialAccount : acc))
            );
          } else if (payload.eventType === 'DELETE') {
            setAccounts((prev) => prev.filter((acc) => acc.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleAddAccount = async () => {
    if (!user || !newPlatform || !newUsername) {
      toast({
        title: "Missing information",
        description: "Please select a platform and enter a username",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('social_accounts')
      .insert({
        user_id: user.id,
        platform: newPlatform,
        username: newUsername,
        connected: true
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add account: " + error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Account connected successfully"
    });

    setIsDialogOpen(false);
    setNewPlatform("");
    setNewUsername("");
  };

  const handleToggleConnection = async (accountId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('social_accounts')
      .update({ connected: !currentStatus })
      .eq('id', accountId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update account status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    const { error } = await supabase
      .from('social_accounts')
      .delete()
      .eq('id', accountId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-muted-foreground">Track your social media performance</p>
          </div>

          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="overview" className="transition-all duration-300">Overview</TabsTrigger>
              <TabsTrigger value="upload" className="transition-all duration-300">Upload Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <UploadContent />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* User Profile Card */}
                <Card className="lg:col-span-1 border-border animate-fade-up">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <Users className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">{user?.user_metadata?.full_name || "User"}</h2>
                    <p className="text-muted-foreground mb-4">{user?.email || "@username"}</p>
                    <p className="text-sm text-muted-foreground">
                      Content creator focusing on design, tech, and social media trends.
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">Edit Profile</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Connected Accounts List */}
                <Card className="lg:col-span-2 border-border animate-fade-up">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">Connected Social Accounts</CardTitle>
                    <Settings className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {accounts.map((account, index) => {
                      const Icon = platformIcons[account.platform as keyof typeof platformIcons] || LinkIcon;
                      const color = platformColors[account.platform as keyof typeof platformColors] || "bg-gray-500";
                      
                      return (
                        <div key={account.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} shadow-md text-white`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="font-medium block">{account.platform}</span>
                              <span className="text-sm text-muted-foreground">{account.username}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={account.connected ? "default" : "destructive"}>
                              {account.connected ? 'Connected' : 'Disconnected'}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleToggleConnection(account.id, account.connected)}
                            >
                              {account.connected ? 'Disconnect' : 'Reconnect'}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteAccount(account.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    {accounts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No social accounts connected yet. Click below to add one.
                      </div>
                    )}
                    <div className="pt-4">
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">Link New Account</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Social Account</DialogTitle>
                            <DialogDescription>
                              Connect a new social media account to your profile
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="platform">Platform</Label>
                              <Select value={newPlatform} onValueChange={setNewPlatform}>
                                <SelectTrigger id="platform">
                                  <SelectValue placeholder="Select a platform" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="X (Twitter)">X (Twitter)</SelectItem>
                                  <SelectItem value="YouTube">YouTube</SelectItem>
                                  <SelectItem value="Instagram">Instagram</SelectItem>
                                  <SelectItem value="Threads">Threads</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                placeholder="@yourusername"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddAccount}>Add Account</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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
