import type { CartItemWithProduct } from "../types";

// A component for a single row in the cart display
const CartItemRow = ({ 
    item, 
    isSelected, 
    onSelectionChange,
    onQuantityChange,
    onDeleteItem 
}: { 
    item: CartItemWithProduct; 
    isSelected: boolean;
    onSelectionChange: (itemId: number) => void;
    onQuantityChange: (itemId: number, newQuantity: number) => void;
    onDeleteItem: (itemId: number) => void;
}) => {
    const { products: product, quantity, id: itemId } = item;
    const price = parseFloat(product.price);
    const lineItemTotal = (price * quantity).toFixed(2);

    return (
        <div className="flex items-center justify-between border-b border-gray-200 py-4  ">
            <div className="flex items-center space-x-4 flex-grow">
                <input 
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectionChange(itemId)}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <img 
                    src={product.imageUrl || 'https://via.placeholder.com/100'} 
                    alt={product.name}
                    className="h-20 w-20 object-cover rounded-lg"
                />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <div className="flex items-center mt-2">
                        <button 
                            onClick={() => onQuantityChange(itemId, quantity - 1)}
                            disabled={quantity <= 1}
                            className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            -
                        </button>
                        <span className="px-4 font-medium">{quantity}</span>
                        <button 
                             onClick={() => onQuantityChange(itemId, quantity + 1)}
                             disabled={quantity >= product.stock}
                             className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">${lineItemTotal}</p>
                    <p className="text-sm text-gray-500">${price.toFixed(2)} each</p>
                    <p className="text-xs text-gray-400 mt-1">{product.stock} in stock</p>
                </div>
                {/* --- START: Delete Button --- */}
                <button 
                    onClick={() => onDeleteItem(itemId)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-2"
                    title="Remove item from cart"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {/* --- END: Delete Button --- */}
            </div>
        </div>
    );
};

export default CartItemRow;