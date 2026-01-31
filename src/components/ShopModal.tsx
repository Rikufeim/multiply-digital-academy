import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { courses, guides, bundles, memberships } from "@/data/products";
import ProductCard from "./ProductCard";

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Category = "all" | "courses" | "guides" | "bundles" | "memberships";

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All Products" },
  { id: "courses", label: "Courses" },
  { id: "guides", label: "PDF Guides" },
  { id: "bundles", label: "Bundles" },
  { id: "memberships", label: "Membership" },
];

export default function ShopModal({ isOpen, onClose }: ShopModalProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const getProducts = () => {
    switch (activeCategory) {
      case "courses":
        return courses;
      case "guides":
        return guides;
      case "bundles":
        return bundles;
      case "memberships":
        return memberships;
      default:
        return [...courses, ...guides, ...bundles, ...memberships];
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="min-h-full flex items-start justify-center p-6 pt-20">
              <div className="relative w-full max-w-6xl">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute -top-12 right-0 p-2 text-muted-foreground 
                             hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-display text-4xl md:text-5xl font-bold uppercase tracking-luxury mb-4"
                  >
                    Shop
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-lg"
                  >
                    Your gateway to financial freedom and digital mastery
                  </motion.p>
                </div>

                {/* Category tabs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap justify-center gap-3 mb-10"
                >
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-5 py-2 rounded-full text-sm font-display uppercase tracking-luxury
                                  transition-all duration-300
                                  ${activeCategory === category.id
                                    ? "bg-primary text-primary-foreground glow-purple-sm"
                                    : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                                  }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </motion.div>

                {/* Products grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                  {getProducts().map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
