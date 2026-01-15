import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, Share2, ExternalLink, Loader2, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BadgeDisplay } from "@/components/badges/BadgeDisplay";
import { useBadges, checkAndAwardBadges } from "@/hooks/useBadges";
import ridgeLogo from "@/assets/ridge-logo.png";

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  background_url: string | null;
  theme_color: string | null;
  is_public: boolean;
  user_id: string;
  show_badges: boolean;
}

interface ProfileElement {
  id: string;
  element_type: string;
  content: Record<string, unknown>;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  rotation: number | null;
  z_index: number | null;
  styles: Record<string, unknown> | null;
}

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [elements, setElements] = useState<ProfileElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();

  const { badges } = useBadges(profile?.username, profile?.id);

  // Generate a visitor ID for tracking
  const getVisitorId = () => {
    let visitorId = localStorage.getItem("ridge_visitor_id");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("ridge_visitor_id", visitorId);
    }
    return visitorId;
  };

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    try {
      // Get current user to check if owner
      const { data: { user } } = await supabase.auth.getUser();
      
      // First try to fetch the profile - if user is owner, they can see it via RLS
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Check if current user is the owner
      const ownerCheck = user?.id === data.user_id;
      setIsOwner(ownerCheck);

      // If not owner and not public, show not found
      if (!ownerCheck && !data.is_public) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(data as Profile);

      // Fetch profile elements
      const { data: elementsData } = await supabase
        .from("profile_elements")
        .select("*")
        .eq("profile_id", data.id)
        .order("z_index", { ascending: true });

      setElements((elementsData || []) as ProfileElement[]);

      // Fetch stats
      const [analyticsResult, likesResult] = await Promise.all([
        supabase
          .from("profile_analytics")
          .select("id")
          .eq("profile_id", data.id),
        supabase
          .from("profile_likes")
          .select("id, visitor_id")
          .eq("profile_id", data.id),
      ]);

      setViewCount((analyticsResult.data || []).length);
      setLikeCount((likesResult.data || []).length);

      // Check if current visitor has liked
      const visitorId = getVisitorId();
      const hasLiked = (likesResult.data || []).some(
        (l) => l.visitor_id === visitorId
      );
      setLiked(hasLiked);

      // Record visit (only for non-owners)
      if (!ownerCheck) {
        await supabase.from("profile_analytics").insert({
          profile_id: data.id,
          visitor_id: visitorId,
          referrer: document.referrer || null,
        });

        // Update view count after recording
        setViewCount((prev) => prev + 1);
      }

      // Check and award badges for this profile
      await checkAndAwardBadges(data.id, data.username);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!profile) return;

    const visitorId = getVisitorId();

    try {
      if (liked) {
        // Remove like
        await supabase
          .from("profile_likes")
          .delete()
          .eq("profile_id", profile.id)
          .eq("visitor_id", visitorId);
        setLikeCount((prev) => prev - 1);
        setLiked(false);
      } else {
        // Add like
        await supabase.from("profile_likes").insert({
          profile_id: profile.id,
          visitor_id: visitorId,
        });
        setLikeCount((prev) => prev + 1);
        setLiked(true);
        
        // Check for like badges after new like
        await checkAndAwardBadges(profile.id, profile.username);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Could not process your like.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background relative">
        <header className="fixed top-0 left-0 right-0 z-50 glass">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src={ridgeLogo} alt="Ridge" className="h-6 w-auto" />
              <span className="font-display text-sm font-semibold gradient-text">Ridge</span>
            </a>
          </div>
        </header>
        <main className="pt-20 pb-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This profile doesn't exist or is private.
            </p>
            <a href="/">
              <Button className="gradient-bg shadow-pink">Go Home</Button>
            </a>
          </div>
        </main>
      </div>
    );
  }

  const themeColor = profile?.theme_color || "#EC4899";
  const showBadges = profile?.show_badges !== false;

  return (
    <div
      className="min-h-screen bg-background relative"
      style={
        profile?.background_url
          ? {
              backgroundImage: `url(${profile.background_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Background overlay for readability */}
      {profile?.background_url && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      )}

      {/* Background decorations */}
      {!profile?.background_url && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: `${themeColor}15` }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
            style={{ backgroundColor: `${themeColor}15` }}
          />
        </div>
      )}

      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src={ridgeLogo} alt="Ridge" className="h-6 w-auto" />
            <span className="font-display text-sm font-semibold gradient-text">Ridge</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="w-3 h-3" /> {viewCount.toLocaleString()} views
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 relative z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Profile Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg overflow-hidden"
              style={
                !profile?.avatar_url
                  ? {
                      background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                    }
                  : undefined
              }
            >
              {profile?.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || profile.username}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>

            {/* Badges */}
            {showBadges && badges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <BadgeDisplay badges={badges} size="md" />
              </motion.div>
            )}

            {/* Display Name & Username */}
            <h1 className="font-display text-3xl font-bold mb-2">
              {profile?.display_name || `@${profile?.username}`}
            </h1>
            {profile?.display_name && (
              <p className="text-muted-foreground mb-4">@{profile?.username}</p>
            )}

            {/* Bio */}
            {profile?.bio ? (
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">{profile.bio}</p>
            ) : (
              <p className="text-muted-foreground mb-8">
                This profile hasn't been customized yet.
              </p>
            )}

            {/* Profile Elements - Now rendered properly */}
            {elements.length > 0 ? (
              <div className="space-y-4 mb-8">
                {elements.map((element, index) => {
                  const content = element.content as Record<string, string>;

                  if (element.element_type === "text") {
                    return (
                      <motion.div
                        key={element.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-4 rounded-xl bg-card border border-border text-left"
                      >
                        <p className="text-sm">{content.text}</p>
                      </motion.div>
                    );
                  }

                  if (element.element_type === "image") {
                    return (
                      <motion.div
                        key={element.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="rounded-xl overflow-hidden"
                      >
                        <img
                          src={content.url}
                          alt="Profile content"
                          className="w-full h-auto max-h-80 object-cover"
                        />
                      </motion.div>
                    );
                  }

                  if (element.element_type === "link") {
                    return (
                      <motion.a
                        key={element.id}
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-pink transition-all"
                        style={{ borderColor: `${themeColor}33` }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${themeColor}20` }}
                        >
                          <LinkIcon className="w-5 h-5" style={{ color: themeColor }} />
                        </div>
                        <span className="font-medium">{content.title}</span>
                      </motion.a>
                    );
                  }

                  return null;
                })}
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-border bg-card/50 mb-8">
                <p className="text-muted-foreground">
                  {isOwner
                    ? "No content yet. Go to the editor to add elements!"
                    : "No content yet. The creator will add their unique elements here."}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={liked ? "default" : "outline"}
                style={liked ? { backgroundColor: themeColor } : undefined}
                className={liked ? "shadow-lg" : ""}
                onClick={handleLike}
              >
                <Heart className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
                {likeCount > 0 ? likeCount : "Like"}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 glass py-3">
        <div className="container mx-auto px-4 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Create your own Ridge profile
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
