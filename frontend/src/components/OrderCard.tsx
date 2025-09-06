import type { OrderWithDetails } from '../types';
import OrderItem from './OrderItem';

interface OrderCardProps {
  order: OrderWithDetails;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-md">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 border-b border-gray-200">
        <div>
          <p className="text-sm font-semibold text-gray-600">ORDER PLACED</p>
          <p className="text-gray-800">{orderDate}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-600">TOTAL</p>
          <p className="text-gray-800">${order.totalAmount}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-600">ORDER #</p>
          <p className="text-gray-800">{order.id}</p>
        </div>
      </div>
      
      {/* Card Body - List of Items */}
      <div className="p-4">
        {order.orderItems.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default OrderCard;