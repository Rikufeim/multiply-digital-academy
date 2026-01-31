import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Loader2 } from "lucide-react";
import ShopifyProductCard from "./ShopifyProductCard";
import { Button } from "@/components/ui/button";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopModal({ isOpen, onClose }: ShopModalProps) {
  const { products, isLoading, error } = useShopifyProducts(50);

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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute -top-12 right-0"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </Button>

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

                {/* Loading state */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">Loading products...</p>
                  </div>
                )}

                {/* Error state */}
                {error && (
                  <div className="text-center py-20">
                    <p className="text-destructive mb-4">{error}</p>
                  </div>
                )}

                {/* Empty state */}
                {!isLoading && !error && products.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="font-display text-xl font-bold mb-2">No products found</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      Your store doesn't have any products yet. 
                      Tell us what products you'd like to sell!
                    </p>
                  </div>
                )}

                {/* Products grid */}
                {!isLoading && !error && products.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                    {products.map((product, index) => (
                      <ShopifyProductCard key={product.node.id} product={product} index={index} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
