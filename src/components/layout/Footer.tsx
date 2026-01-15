import { Link } from "react-router-dom";
import ridgeLogo from "@/assets/ridge-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={ridgeLogo} alt="Ridge" className="h-5 w-auto" />
            <span className="font-display text-base font-bold gradient-text">
              Ridge
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              home
            </Link>
            <Link to="/explore" className="hover:text-foreground transition-colors">
              explore
            </Link>
            <Link to="/badges" className="hover:text-foreground transition-colors">
              badges
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              terms
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              privacy
            </Link>
          </div>

          {/* Sign-off */}
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            made with
            <span className="text-primary animate-pulse">♥</span>
            somewhere on earth
          </p>
        </div>
      </div>
    </footer>
  );
}
