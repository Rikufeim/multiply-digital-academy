import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function CartDrawer() {
  const { 
    items, 
    isOpen, 
    isLoading,
    isSyncing,
    closeCart, 
    removeItem, 
    updateQuantity,
    clearCart,
    getCheckoutUrl,
    syncCart,
    totalItems,
    totalPrice
  } = useCartStore();

  // Sync cart when drawer opens
  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const formatPrice = (amount: string, currencyCode: string) => 
    `${currencyCode} ${parseFloat(amount).toFixed(2)}`;

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      closeCart();
    }
  };

  const itemCount = totalItems();
  const total = totalPrice();
  const currencyCode = items[0]?.price.currencyCode || 'EUR';

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
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md 
                       bg-card border-l border-border shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-display text-xl font-bold uppercase tracking-[0.2em]">
                  Your Cart ({itemCount})
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeCart}
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Cart items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg mb-2">Your cart is empty</p>
                    <p className="text-muted-foreground text-sm">
                      Add some products to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.variantId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex gap-4 p-4 bg-secondary/50 rounded-lg"
                      >
                        {/* Product image */}
                        {item.product.node.images?.edges?.[0]?.node && (
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-secondary/20">
                            <img 
                              src={item.product.node.images.edges[0].node.url} 
                              alt={item.product.node.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground mb-1 truncate">
                            {item.product.node.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {item.selectedOptions.map(o => o.value).join(' • ')}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {formatPrice(item.price.amount, item.price.currencyCode)}
                          </p>
                          
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              disabled={isLoading}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              disabled={isLoading}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Remove button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.variantId)}
                          disabled={isLoading}
                          className="text-muted-foreground hover:text-destructive flex-shrink-0"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-border space-y-4">
                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-display text-2xl font-bold">
                      {currencyCode} {total.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout button */}
                  <Button
                    className="w-full uppercase tracking-[0.2em] font-display"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isLoading || isSyncing || !getCheckoutUrl()}
                  >
                    {isLoading || isSyncing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Checkout with Shopify
                      </>
                    )}
                  </Button>

                  {/* Clear cart */}
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={clearCart}
                    disabled={isLoading}
                  >
                    Clear Cart
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
