import { motion } from "framer-motion";
import { 
  Move, 
  Image, 
  Palette, 
  BarChart3, 
  Share2,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Move,
    title: "drag & drop",
    description: "put things wherever, we're not picky.",
    size: "large",
  },
  {
    icon: Image,
    title: "add your pics",
    description: "photos, art, memes (hopefully cat memes)",
    size: "small",
  },
  {
    icon: Palette,
    title: "make it yours",
    description: "colors, fonts, all customizable.",
    size: "small",
  },
  {
    icon: BarChart3,
    title: "see who visited",
    description: "track views & likes, feel famous.",
    size: "medium",
  },
  {
    icon: Share2,
    title: "share everywhere",
    description: "one link, all platforms.",
    size: "small",
  },
  {
    icon: Sparkles,
    title: "actually fun to use",
    description: "we promise it doesn't feel like work.",
    size: "medium",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 relative">
      {/* Subtle grain */}
      <div className="absolute inset-0 noise-overlay opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - left aligned, more casual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-md"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            what you get
          </h2>
          <p className="text-muted-foreground">
            all the good stuff, none of the corporate fluff.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, index) => {
            const isLarge = feature.size === "large";
            const isMedium = feature.size === "medium";
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -4, rotate: isLarge ? 0 : index % 2 === 0 ? 1 : -1 }}
                className={`
                  group p-5 md:p-6 rounded-2xl bg-card border border-border 
                  hover:border-primary/30 hover:shadow-pink transition-all
                  ${isLarge ? 'col-span-2 row-span-2' : ''}
                  ${isMedium ? 'col-span-2 md:col-span-1' : ''}
                `}
              >
                <div className={`
                  rounded-xl gradient-bg flex items-center justify-center mb-4 
                  group-hover:shadow-pink transition-shadow
                  ${isLarge ? 'w-14 h-14' : 'w-10 h-10'}
                `}>
                  <feature.icon className={`text-primary-foreground ${isLarge ? 'w-7 h-7' : 'w-5 h-5'}`} />
                </div>
                <h3 className={`font-display font-semibold mb-1.5 ${isLarge ? 'text-xl' : 'text-base'}`}>
                  {feature.title}
                </h3>
                <p className={`text-muted-foreground ${isLarge ? 'text-base' : 'text-sm'}`}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
