import { useState, useEffect } from 'react';
import { ShopifyProduct, fetchProducts } from '@/lib/shopify';

export function useShopifyProducts(first: number = 50, query?: string) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProducts(first, query);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [first, query]);

  return { products, isLoading, error };
}
