import { motion } from "framer-motion";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  index?: number;
}

export default function ShopifyProductCard({ product, index = 0 }: ShopifyProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  
  const { node } = product;
  const selectedVariant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  
  const formatPrice = (amount: string, currencyCode: string) => 
    `${currencyCode} ${parseFloat(amount).toFixed(2)}`;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || []
    });
    
    toast.success("Added to cart", {
      description: node.title,
      position: "top-center"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-card rounded-xl overflow-hidden border border-border
                 transition-all duration-300 hover:border-white/25"
    >
      {/* Product image */}
      <Link to={`/product/${node.handle}`}>
        <div className="aspect-square bg-secondary/20 overflow-hidden">
          {image ? (
            <img 
              src={image.url} 
              alt={image.altText || node.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Product info */}
      <div className="p-6">
        <Link to={`/product/${node.handle}`}>
          <h3 className="font-display text-lg font-bold mb-2 text-foreground group-hover:text-white transition-colors truncate">
            {node.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
          {node.description || "No description available"}
        </p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="font-display text-xl font-bold text-foreground">
            {formatPrice(
              node.priceRange.minVariantPrice.amount,
              node.priceRange.minVariantPrice.currencyCode
            )}
          </span>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="uppercase tracking-[0.2em] font-display"
            disabled={isLoading || !selectedVariant?.availableForSale}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : !selectedVariant?.availableForSale ? (
              "Sold Out"
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
