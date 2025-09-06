// Based on Drizzle schema 
export interface Product {
  id: number;
  name: string;
  description: string | null; // Description can be null in the schema
  price: string; // The decimal type is often returned as a string by APIs
  stock: number;
  imageUrl: string | null; // The image URL can be null
  createdAt: string;
}

// Type for an order item, which includes the nested products
export interface OrderItemWithProduct {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string; // Price at the time of purchase
  products: Product;
}

// The main type for a single order with all its details
export interface OrderWithDetails {
  id: number;
  userId: number;
  totalAmount: string;
  status: string;
  createdAt: string;
  orderItems: OrderItemWithProduct[];
}

// This represents a single item in the cart, with the full product details nested inside.
// Your `getCartItemsWithProducts` query returns this structure.
export interface CartItemWithProduct {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  products: Product; // The nested product object
}