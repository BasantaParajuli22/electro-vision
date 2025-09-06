import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Product } from '../types';
import ProductCard from './ProductCard';

// You can reuse your FullPageSpinner or create a smaller one for content loading
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);


const AllCardsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use the same base URL as your AuthContext or an env variable
        const response = await axios.get('http://localhost:5000/api/product/');
        // Your backend returns { message: "...", products: [...] }
        setProducts(response.data.products);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500 text-lg py-10">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">Our Products</h1>
      <p className="text-center text-gray-600 mb-10">The perfect electric product for any occasion.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AllCardsPage;