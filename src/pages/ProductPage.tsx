import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Minus, Plus, ShoppingBag } from "lucide-react";
import { fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/CartDrawer";
import { toast } from "sonner";
import { useCartSync } from "@/hooks/useCartSync";

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const addItem = useCartStore(state => state.addItem);
  const isAdding = useCartStore(state => state.isLoading);

  useCartSync();

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setIsLoading(true);
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [handle]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const images = product.images.edges;

  const formatPrice = (amount: string, currencyCode: string) =>
    `${currencyCode} ${parseFloat(amount).toFixed(2)}`;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    const shopifyProduct: ShopifyProduct = { node: product };
    
    await addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || []
    });

    toast.success("Added to cart", {
      description: `${product.title} x ${quantity}`,
      position: "top-center"
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-6">
        <Link to="/">
          <Button variant="ghost" className="uppercase tracking-[0.2em] font-display">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </header>

      {/* Product content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-6 pt-24 pb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-secondary/20 rounded-xl overflow-hidden">
              {images[selectedImage]?.node && (
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors
                      ${selectedImage === i ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img
                      src={img.node.url}
                      alt={img.node.altText || `${product.title} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-luxury mb-4">
                {product.title}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description || "No description available"}
              </p>
            </div>

            {/* Price */}
            <div className="font-display text-3xl font-bold">
              {selectedVariant && formatPrice(
                selectedVariant.price.amount,
                selectedVariant.price.currencyCode
              )}
            </div>

            {/* Variants */}
            {product.options.length > 0 && product.options[0].values.length > 1 && (
              <div className="space-y-3">
                <label className="text-sm text-muted-foreground uppercase tracking-[0.2em]">
                  {product.options[0].name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((variant, i) => (
                    <Button
                      key={variant.node.id}
                      variant={selectedVariantIndex === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedVariantIndex(i)}
                      disabled={!variant.node.availableForSale}
                      className="uppercase tracking-[0.1em]"
                    >
                      {variant.node.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm text-muted-foreground uppercase tracking-[0.2em]">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-display text-xl font-bold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to cart */}
            <Button
              size="lg"
              className="w-full uppercase tracking-[0.2em] font-display"
              onClick={handleAddToCart}
              disabled={isAdding || !selectedVariant?.availableForSale}
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : !selectedVariant?.availableForSale ? (
                "Sold Out"
              ) : (
                "Add to Cart"
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      <CartDrawer />
    </div>
  );
}
