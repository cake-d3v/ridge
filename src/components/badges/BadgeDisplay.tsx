import { motion } from "framer-motion";
import { 
  UserPlus, 
  Palette, 
  Heart, 
  Star, 
  Code, 
  Crown,
  HelpCircle
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

export interface Badge {
  type: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

export const BADGE_DEFINITIONS: Record<string, Badge> = {
  signed_up: {
    type: "signed_up",
    name: "Early Adopter",
    description: "Joined Ridge and created an account",
    icon: UserPlus,
    color: "#10B981", // green
  },
  customized_profile: {
    type: "customized_profile",
    name: "Creator",
    description: "Added custom elements to their profile",
    icon: Palette,
    color: "#8B5CF6", // purple
  },
  got_like: {
    type: "got_like",
    name: "Liked",
    description: "Received their first like on their profile",
    icon: Heart,
    color: "#EC4899", // pink
  },
  famous: {
    type: "famous",
    name: "Famous",
    description: "Received 10 or more likes on their profile",
    icon: Star,
    color: "#F59E0B", // amber
  },
  tester: {
  type: "tester",
  name: "Tester",
  description: "Helped test Ridge and break things early",
  icon: HelpCircle,
  color: "#14B8A6", // teal
},

  developer: {
    type: "developer",
    name: "Developer",
    description: "A developer who helped build Ridge",
    icon: Code,
    color: "#3B82F6", // blue
  },
  
  owner: {
    type: "owner",
    name: "Owner",
    description: "The creator and owner of Ridge",
    icon: Crown,
    color: "#EF4444", // red
  },
};


interface BadgeIconProps {
  badge: Badge;
  size?: "sm" | "md" | "lg";
}

export function BadgeIcon({ badge, size = "md" }: BadgeIconProps) {
  const Icon = badge.icon;
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to="/badges">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center cursor-pointer transition-shadow hover:shadow-lg`}
            style={{ backgroundColor: badge.color }}
          >
            <Icon className={`${iconSizes[size]} text-white`} />
          </motion.div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        <p className="font-semibold">{badge.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface BadgeDisplayProps {
  badges: string[];
  size?: "sm" | "md" | "lg";
}

export function BadgeDisplay({ badges, size = "md" }: BadgeDisplayProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      {badges.map((badgeType) => {
        const badge = BADGE_DEFINITIONS[badgeType];
        if (!badge) return null;
        return <BadgeIcon key={badgeType} badge={badge} size={size} />;
      })}
    </div>
  );
}
