import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 group-hover:shadow-xl">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400x300'}
          alt={product.name}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
          <p className="mt-2 text-xl font-bold text-indigo-600">${product.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
