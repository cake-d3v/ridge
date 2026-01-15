import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ridgeLogo from "@/assets/ridge-logo.png";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16">
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 noise-overlay opacity-30" />
      
      {/* Background - simplified, less blobby */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-[15%] w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-[10%] w-64 h-64 bg-primary/8 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left side - Text content (slightly off-center feel) */}
          <div className="max-w-xl lg:max-w-none">
            {/* Badge - more casual */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-accent/60 border border-border text-sm"
            >
              <span className="text-primary">✦</span>
              <span className="text-muted-foreground">hey, you're early</span>
            </motion.div>

            {/* Headline - conversational */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-[1.1]"
            >
              your corner of
              <br />
              <span className="gradient-text inline-flex items-center gap-2">
                the internet
                <motion.span
                  className="inline-block"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  ✨
                </motion.span>
              </span>
            </motion.h1>

            {/* Subheadline - casual, lowercase vibe */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8 max-w-md"
            >
              drag stuff around. make it pretty. share it with everyone. 
              <span className="text-foreground/70"> it's your space, do whatever.</span>
            </motion.p>

            {/* CTA Buttons - more casual copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link to="/signup">
                <Button
                  size="lg"
                  className="gradient-bg shadow-pink-lg hover:shadow-pink transition-all group px-6"
                >
                  let's go
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-muted-foreground hover:text-foreground"
                >
                  see what others made →
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right side - Profile preview mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Browser chrome mockup */}
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transform hover:rotate-0 transition-transform duration-500">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-background/60 text-xs text-muted-foreground">
                      ridge.3n.cc/you
                    </div>
                  </div>
                </div>
                
                {/* Profile preview content */}
                <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent min-h-[320px]">
                  {/* Mini profile card */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-3 flex items-center justify-center">
                      <span className="text-2xl">💖</span>
                    </div>
                    <div className="font-display font-semibold">your name here</div>
                    <div className="text-sm text-muted-foreground">doing cool stuff (we love cats)</div>
                  </div>
                  
                  {/* Fake draggable elements */}
                  <div className="space-y-3">
                    <motion.div 
                      className="p-3 bg-card border border-border/60 rounded-xl text-sm cursor-move"
                      whileHover={{ scale: 1.02, rotate: -1 }}
                    >
                      my links go here
                    </motion.div>
                    <motion.div 
                      className="p-3 bg-card border border-border/60 rounded-xl text-sm cursor-move ml-4"
                      whileHover={{ scale: 1.02, rotate: 1 }}
                    >
                      photos & stuff
                    </motion.div>
                    <motion.div 
                      className="p-3 bg-card border border-border/60 rounded-xl text-sm cursor-move"
                      whileHover={{ scale: 1.02, rotate: -0.5 }}
                    >
                      whatever you want really
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Floating logo */}
              <motion.img
                src={ridgeLogo}
                alt="Ridge"
                className="absolute -top-4 -right-4 h-12 w-auto drop-shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Hand-drawn arrow doodle */}
              <motion.svg
                className="absolute -bottom-8 -left-12 w-20 h-20 text-primary/40"
                viewBox="0 0 100 100"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                <path
                  d="M10 80 Q 30 20, 70 40 Q 90 50, 85 70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="5,5"
                />
                <path
                  d="M75 65 L 85 70 L 80 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
