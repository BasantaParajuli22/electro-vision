import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types'; // Make sure this is correctly imported

const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

const CardDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  // Add a new state for the "Add to Cart" button's loading status
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/product/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Gift card not found.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
    if (!user) {
      setError("Please sign in to complete your purchase.");
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    if (product && quantity > product.stock) {
      setError("The requested quantity exceeds the available stock.");
      return;
    }
    setIsRedirecting(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/checkout/create-session',
        {
          productId: product?.id,
          quantity: quantity,
        },
        {
          withCredentials: true,
        }
      );
      const { url, success, message } = response.data;
      if (success && url) {
        window.location.href = url;
      } else {
        setError(message || "Could not proceed to checkout.");
        setIsRedirecting(false);
      }
    } catch (err) {
      console.error("Failed to create checkout session:", err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any).response?.data?.message || "An unexpected error occurred. Please try again later.";
      setError(errorMessage);
      setIsRedirecting(false);
    }
  };

  // New handler function for "Add to Cart"
  const handleAddToCart = async () => {
    if (!user) {
      setError("Please sign in to add items to your cart.");
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    if (product && quantity > product.stock) {
      setError("The requested quantity exceeds the available stock.");
      return;
    }

    setIsAddingToCart(true);
    setError(null);

    try {
      // Call the new backend endpoint for adding to cart
      await axios.post('http://localhost:5000/api/cart/add',
        {
          productId: product?.id,
          quantity: quantity,
        },
        {
          withCredentials: true,
        }
      );
      alert('Item added to cart successfully!'); // Provide user feedback
    } catch (err) {
      console.error("Failed to add to cart:", err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any).response?.data?.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;
    const value = Math.max(1, Math.min(newQuantity, product.stock));
    setQuantity(value);
  };

  if (loading) return <LoadingSpinner />;
  if (error && !product) return <p className="text-center text-red-500 text-lg py-10">{error}</p>;
  if (!product) return <p className="text-center text-gray-500 py-10">Product not found.</p>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/products" className="text-indigo-600 hover:text-indigo-800 font-semibold">
          &larr; Back to All Cards
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src={product.imageUrl || 'https://via.placeholder.com/800x600'}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-indigo-600">${product.price}</p>
          <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>
          
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}

          <div className="mt-8">
            {product.stock > 0 && (
                <div className="mb-6">
                    <label htmlFor="quantity" className="block text-lg font-medium text-gray-800 mb-2">
                        Quantity
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg" style={{ maxWidth: '150px' }}>
                        <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className="px-4 py-2 text-xl font-semibold text-gray-600 bg-gray-100 rounded-l-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            readOnly
                            className="w-full text-center font-semibold text-gray-800 border-x border-gray-300 focus:outline-none focus:ring-0"
                            aria-label="Product quantity"
                        />
                        <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="px-4 py-2 text-xl font-semibold text-gray-600 bg-gray-100 rounded-r-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            +
                        </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{product.stock} cards in stock</p>
                </div>
            )}

            {/* Flex container to hold both buttons side-by-side */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : (isAddingToCart ? 'Adding...' : 'Add to Cart')}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isRedirecting || product.stock === 0}
                className="flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : (isRedirecting ? 'Redirecting...' : 'Buy Now')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailPage;