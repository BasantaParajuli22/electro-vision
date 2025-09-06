import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import type { OrderWithDetails } from '../types';
import OrderCard from '../components/OrderCard';
import { Link } from 'react-router-dom';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const   OrderHistoryPage = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/history', {
          withCredentials: true, // Essential for session-based authentication
        });
        setOrders(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: unknown) {
        console.error("Failed to fetch order history:", err);
        if (isAxiosError(err) && err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Could not load your orders. Please try again later.");
        }
        } finally {
          setLoading(false);
      }
    };
    
    fetchOrderHistory();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <p className="text-center text-red-500 text-lg py-10">{error}</p>;
    }
    if (orders.length === 0) {
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-700">No Orders Found</h2>
          <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-shadow"
          >
            Browse products
          </Link>
        </div>
      );
    }
    return (
      <div>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Your Order History</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default OrderHistoryPage;