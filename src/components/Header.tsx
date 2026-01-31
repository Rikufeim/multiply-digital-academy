import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface HeaderProps {
  onOpenCourses: () => void;
  onOpenShop: () => void;
}

export default function Header({ onOpenCourses, onOpenShop }: HeaderProps) {
  const { totalItems, openCart } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8">
      <nav className="flex items-center justify-between">
        {/* Courses Button - Left */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={onOpenCourses}
          className="px-6 py-2.5 rounded-full border border-foreground/30 bg-transparent 
                     text-foreground text-sm font-display uppercase tracking-luxury
                     transition-all duration-300
                     hover:border-primary hover:glow-purple-sm hover:text-primary"
        >
          Courses
        </motion.button>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {/* Shop Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={onOpenShop}
            className="px-6 py-2.5 rounded-full border border-foreground/30 bg-transparent 
                       text-foreground text-sm font-display uppercase tracking-luxury
                       transition-all duration-300
                       hover:border-primary hover:glow-purple-sm hover:text-primary"
          >
            Shop
          </motion.button>

          {/* Cart Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={openCart}
            className="relative p-2.5 rounded-full border border-foreground/30 bg-transparent 
                       text-foreground transition-all duration-300
                       hover:border-primary hover:glow-purple-sm hover:text-primary"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full 
                               flex items-center justify-center text-xs font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </motion.button>
        </div>
      </nav>
    </header>
  );
}
