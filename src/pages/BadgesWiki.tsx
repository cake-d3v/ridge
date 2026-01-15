import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BADGE_DEFINITIONS, BadgeIcon } from "@/components/badges/BadgeDisplay";
import ridgeLogo from "@/assets/ridge-logo.png";

const BadgesWiki = () => {
  const badges = Object.values(BADGE_DEFINITIONS);

  const badgeRequirements: Record<string, { requirement: string; obtainable: boolean }> = {
    signed_up: {
      requirement: "Create a Ridge account",
      obtainable: true,
    },
    customized_profile: {
      requirement: "Add at least one element to your profile using the editor",
      obtainable: true,
    },
    got_like: {
      requirement: "Receive your first like from another user",
      obtainable: true,
    },
    famous: {
      requirement: "Receive 10 or more likes on your profile",
      obtainable: true,
    },
    developer: {
      requirement: "Be a developer who contributed to Ridge",
      obtainable: false,
    },
    owner: {
      requirement: "Be the creator of Ridge (codeb1tz)",
      obtainable: false,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={ridgeLogo} alt="Ridge" className="h-6 w-auto" />
            <span className="font-display text-sm font-semibold gradient-text">Ridge</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl font-bold mb-4">
              badges wiki <span className="text-2xl">🏆</span>
            </h1>
            <p className="text-muted-foreground">
              all the badges you can earn on Ridge and how to get them
            </p>
          </motion.div>

          <div className="space-y-4">
            {badges.map((badge, index) => {
              const req = badgeRequirements[badge.type];
              return (
                <motion.div
                  key={badge.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${badge.color}20` }}
                    >
                      <badge.icon className="w-6 h-6" style={{ color: badge.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-display text-lg font-semibold">{badge.name}</h2>
                        {req?.obtainable ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs">
                            <Check className="w-3 h-3" />
                            Obtainable
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                            <X className="w-3 h-3" />
                            Exclusive
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{badge.description}</p>
                      <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">How to obtain:</span>{" "}
                          <span className="text-muted-foreground">{req?.requirement}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Preview section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-6 rounded-2xl border border-border bg-card text-center"
          >
            <h3 className="font-display text-lg font-semibold mb-4">badge preview</h3>
            <p className="text-muted-foreground text-sm mb-6">
              this is how badges look on profiles
            </p>
            <div className="flex items-center justify-center gap-2">
              {badges.map((badge) => (
                <BadgeIcon key={badge.type} badge={badge} size="lg" />
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default BadgesWiki;
