import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { CartItemWithProduct } from '../types'; // Adjust the import path as needed
import CartItemRow from '../components/CartItemRow';


const CartPage = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/cart',{
                    credentials: "include",
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items.');
                }

                const data = await response.json();
                setCartItems(data.cartItems || []);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCartItems();
    }, [user]);

    const handleSelectionChange = (itemId: number) => {
        setSelectedItems(prevSelectedItems => 
            prevSelectedItems.includes(itemId)
                ? prevSelectedItems.filter(id => id !== itemId)
                : [...prevSelectedItems, itemId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(cartItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };
    
    const handleQuantityChange = async (itemId: number, newQuantity: number) => {
        const itemToUpdate = cartItems.find(item => item.id === itemId);
        if (!itemToUpdate) return;

        if (newQuantity < 1 || newQuantity > itemToUpdate.products.stock) {
            console.warn("Invalid quantity requested.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/cart/item/${itemId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (!response.ok) {
                throw new Error('Failed to update item quantity.');
            }

            setCartItems(currentItems =>
                currentItems.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update quantity.');
        }
    };

    // handle item deletion
    const handleDeleteItem = async (itemId: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/cart/item/${itemId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove item from cart.');
            }

            // Update local state to reflect the deletion
            setCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
            // Also update the selected items state
            setSelectedItems(currentSelected => currentSelected.filter(id => id !== itemId));

        } catch (err) {
             setError(err instanceof Error ? err.message : 'An unknown error occurred while deleting the item.');
        }
    };

    const calculateSubtotal = () => {
        return cartItems
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => {
                const price = parseFloat(item.products.price);
                return total + (price * item.quantity);
            }, 0).toFixed(2);
    };

    const handleCheckout = async () => {
        if (selectedItems.length === 0) {
            alert("Please select items to checkout.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/checkout/create-cart-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ cartItemIds: selectedItems }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create checkout session.');
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during checkout.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">{error}</div>;
    }

    if (cartItems.length === 0) {
        return <div className="text-center text-gray-500 text-2xl py-20  min-h-[calc(100dvh-64px)] flex justify-center items-center">
            Your cart is empty.
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl ">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Shopping Cart</h1>
            
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center border-b pb-4 mb-4">
                    <input 
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="ml-3 text-sm font-medium text-gray-700">Select All</label>
                </div>
                <div className="space-y-4">
                    {cartItems.map(item => (
                        <CartItemRow 
                            key={item.id} 
                            item={item}
                            isSelected={selectedItems.includes(item.id)}
                            onSelectionChange={handleSelectionChange}
                            onQuantityChange={handleQuantityChange}
                            onDeleteItem={handleDeleteItem}
                        />
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xl font-semibold">
                        <span>Subtotal</span>
                        <span>${calculateSubtotal()}</span>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        disabled={selectedItems.length === 0}
                        className={`w-full mt-4 font-bold py-3 px-4 rounded-lg transition-colors ${selectedItems.length > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;