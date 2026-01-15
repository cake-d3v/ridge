import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Edit3, 
  BarChart3, 
  Settings, 
  LogOut,
  Eye,
  Users,
  Heart,
  TrendingUp,
  Loader2,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ridgeLogo from "@/assets/ridge-logo.png";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  totalLikes: number;
  viewsToday: number;
  viewsByDay: { date: string; views: number }[];
  topReferrers: { referrer: string; count: number }[];
}

const Analytics = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    uniqueVisitors: 0,
    totalLikes: 0,
    viewsToday: 0,
    viewsByDay: [],
    topReferrers: [],
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      await fetchData(session.user.id);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) {
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from("profile_analytics")
        .select("*")
        .eq("profile_id", profileData.id);

      if (analyticsError) throw analyticsError;

      // Fetch likes
      const { data: likesData, error: likesError } = await supabase
        .from("profile_likes")
        .select("*")
        .eq("profile_id", profileData.id);

      if (likesError) throw likesError;

      const visits = analyticsData || [];
      const likes = likesData || [];

      // Calculate stats
      const today = new Date().toISOString().split("T")[0];
      const viewsToday = visits.filter(
        (v) => v.visited_at.split("T")[0] === today
      ).length;

      const uniqueVisitorIds = new Set(visits.map((v) => v.visitor_id).filter(Boolean));

      // Group by day (last 7 days)
      const last7Days: { date: string; views: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const views = visits.filter(
          (v) => v.visited_at.split("T")[0] === dateStr
        ).length;
        last7Days.push({
          date: date.toLocaleDateString("en-US", { weekday: "short" }),
          views,
        });
      }

      // Top referrers
      const referrerCounts: Record<string, number> = {};
      visits.forEach((v) => {
        const ref = v.referrer || "Direct";
        referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
      });

      const topReferrers = Object.entries(referrerCounts)
        .map(([referrer, count]) => ({
          referrer: referrer === "Direct" ? "Direct" : new URL(referrer).hostname,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setAnalytics({
        totalViews: visits.length,
        uniqueVisitors: uniqueVisitorIds.size,
        totalLikes: likes.length,
        viewsToday,
        viewsByDay: last7Days,
        topReferrers,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Could not load analytics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const username = profile?.username || user?.user_metadata?.username || "user";

  const stats = [
    { label: "Total Views", value: analytics.totalViews.toLocaleString(), icon: Eye },
    { label: "Unique Visitors", value: analytics.uniqueVisitors.toLocaleString(), icon: Users },
    { label: "Total Likes", value: analytics.totalLikes.toLocaleString(), icon: Heart },
    { label: "Views Today", value: analytics.viewsToday.toLocaleString(), icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-card p-6 flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <img src={ridgeLogo} alt="Ridge" className="h-8 w-auto" />
          <span className="font-display text-xl font-bold gradient-text">Ridge</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {[
            { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
            { name: "Edit Profile", icon: Edit3, path: "/editor" },
            { name: "Analytics", icon: BarChart3, path: "/analytics", active: true },
            { name: "Settings", icon: Settings, path: "/settings" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? "bg-accent text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          className="justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Log out
        </Button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground">
              Track your profile's performance and engagement.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card hover:shadow-pink transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="font-display text-2xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Views Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">Views (Last 7 Days)</h2>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.viewsByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Top Referrers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">Top Referrers</h2>
              </div>
              {analytics.topReferrers.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.topReferrers} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis 
                        dataKey="referrer" 
                        type="category" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No referrer data yet
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
