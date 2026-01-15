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
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ridgeLogo from "@/assets/ridge-logo.png";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      } else if (session) {
        setUser(session.user);
      }
    });

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate]);

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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const username = user?.user_metadata?.username || "user";

  const stats = [
    { label: "Total Views", value: "0", icon: Eye, change: "+0%" },
    { label: "Unique Visitors", value: "0", icon: Users, change: "+0%" },
    { label: "Total Likes", value: "0", icon: Heart, change: "+0%" },
    { label: "Engagement", value: "0%", icon: TrendingUp, change: "+0%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-card p-6 flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <img src={ridgeLogo} alt="Ridge" className="h-8 w-auto" />
          <span className="font-display text-xl font-bold gradient-text">
            Ridge
          </span>
        </Link>

        <nav className="flex-1 space-y-2">
          {[
            { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", active: true },
            { name: "Edit Profile", icon: Edit3, path: "/editor" },
            { name: "Analytics", icon: BarChart3, path: "/analytics" },
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
            <h1 className="font-display text-3xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{username}</span>
            </h1>
            <p className="text-muted-foreground">
              Here's how your profile is performing.
            </p>
          </motion.div>

          {/* Profile Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 rounded-2xl border border-border bg-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold mb-1">
                  Your Profile
                </h2>
                <p className="text-sm text-muted-foreground">
                  ridge.3n.cc/{username}
                </p>
              </div>
              <div className="flex gap-3">
                <Link to={`/${username}`} target="_blank">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View Live
                  </Button>
                </Link>
                <Link to="/editor">
                  <Button size="sm" className="gradient-bg shadow-pink gap-2">
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card hover:shadow-pink transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {stat.change}
                  </span>
                </div>
                <div className="font-display text-2xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-2xl border border-border bg-card"
          >
            <h2 className="font-display text-lg font-semibold mb-4">
              Get Started
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Customize your profile",
                  description: "Add images, text, and more",
                  action: "Start editing",
                  path: "/editor",
                },
                {
                  title: "Share your link",
                  description: "Get your unique URL",
                  action: "Copy link",
                  path: "#",
                },
                {
                  title: "Track performance",
                  description: "View detailed analytics",
                  action: "View stats",
                  path: "/analytics",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-xl bg-accent/50 border border-border"
                >
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.description}
                  </p>
                  <Link to={item.path}>
                    <Button size="sm" variant="outline">
                      {item.action}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
