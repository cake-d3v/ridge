import { motion } from "framer-motion";
import { Search, Heart, Eye, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme_color: string | null;
}

interface ProfileWithStats extends Profile {
  views: number;
  likes: number;
}

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<ProfileWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // Fetch public profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, display_name, bio, avatar_url, theme_color")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      if (!profilesData || profilesData.length === 0) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      // Fetch stats for each profile
      const profileIds = profilesData.map((p) => p.id);

      const [analyticsResult, likesResult] = await Promise.all([
        supabase
          .from("profile_analytics")
          .select("profile_id")
          .in("profile_id", profileIds),
        supabase
          .from("profile_likes")
          .select("profile_id")
          .in("profile_id", profileIds),
      ]);

      // Count views and likes per profile
      const viewCounts: Record<string, number> = {};
      const likeCounts: Record<string, number> = {};

      (analyticsResult.data || []).forEach((a) => {
        viewCounts[a.profile_id] = (viewCounts[a.profile_id] || 0) + 1;
      });

      (likesResult.data || []).forEach((l) => {
        likeCounts[l.profile_id] = (likeCounts[l.profile_id] || 0) + 1;
      });

      const profilesWithStats: ProfileWithStats[] = profilesData.map((p) => ({
        ...p,
        views: viewCounts[p.id] || 0,
        likes: likeCounts[p.id] || 0,
      }));

      setProfiles(profilesWithStats);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      (profile.display_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      profile.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGradient = (color: string | null) => {
    const themeColor = color || "#EC4899";
    return `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="gradient-text">Profiles</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Discover amazing creators and get inspired by their unique profiles.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search profiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 pr-4"
              />
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!loading && profiles.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-accent mx-auto mb-6 flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-semibold mb-2">No profiles yet</h2>
              <p className="text-muted-foreground mb-6">Be the first to create a profile!</p>
              <Link to="/signup">
                <Button className="gradient-bg shadow-pink">Create Your Profile</Button>
              </Link>
            </motion.div>
          )}

          {/* No Results */}
          {!loading && profiles.length > 0 && filteredProfiles.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground">No profiles match your search.</p>
            </motion.div>
          )}

          {/* Profiles Grid */}
          {!loading && filteredProfiles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/${profile.username}`}>
                    <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-pink transition-all">
                      {/* Avatar */}
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.display_name || profile.username}
                          className="w-16 h-16 rounded-full object-cover mb-4"
                        />
                      ) : (
                        <div
                          className="w-16 h-16 rounded-full mb-4"
                          style={{ background: getGradient(profile.theme_color) }}
                        />
                      )}
                      
                      <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                        {profile.display_name || profile.username}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        @{profile.username}
                      </p>
                      {profile.bio && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {profile.bio}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {profile.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {profile.likes}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground mb-4">
              Want to showcase your own profile?
            </p>
            <Link to="/signup">
              <Button className="gradient-bg shadow-pink hover:shadow-pink-lg transition-all gap-2">
                Create Your Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
