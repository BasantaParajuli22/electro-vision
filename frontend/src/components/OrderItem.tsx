import type { OrderItemWithProduct } from '../types';

interface OrderItemProps {
  item: OrderItemWithProduct;
}

const OrderItem = ({ item }: OrderItemProps) => {
  return (
    <div className="flex items-center gap-4 py-3">
      <img
        src={item.products.imageUrl || 'https://via.placeholder.com/100'}
        alt={item.products.name}
        className="h-16 w-16 rounded-md object-cover"
      />
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">{item.products.name}</p>
        <p className="text-sm text-gray-500">
          Quantity: {item.quantity}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-800">${item.price}</p>
        <p className="text-sm text-gray-500">Price each</p>
      </div>
    </div>
  );
};

export default OrderItem;