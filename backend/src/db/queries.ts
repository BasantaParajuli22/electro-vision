import {
  Cart, cart, 
  CartItems, cartItems, 
  Order, orders, 
  OrderItems, orderItems,
  products, Product,  
  User, users} from './schema';
import { db } from "../db/index";
import { and, eq, inArray } from "drizzle-orm";


//get all products
export const getAllProducts = async (): Promise<Product[]> => {
  return await db.query.products.findMany();
};

export const getProductById = async (id: number): Promise<Product | undefined> => {

  return await db.query.products.findFirst({
    where: eq(products.id, id),
  });
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

// Create a cart for a user
export const addCart = async (userId: number): Promise<Cart> => {
  const [newCart] = await db.insert(cart).values({ userId }).returning();
  return newCart;
};


// Get cart by userId
export const getCartByUserId = async (userId: number): Promise<Cart | undefined> => {
  return await db.query.cart.findFirst({
    where: eq(cart.userId, userId),
  });
};


// Get a specific cart item by cartId and productId
export const getCartItem = async (cartId: number,productId: number): Promise<CartItems | undefined> => {
  return await db.query.cartItems.findFirst({
    where:and( eq(cartItems.cartId, cartId), eq( cartItems.productId, productId ) )
  });
};

// Add an item to a cart
export const addCartItem = async (cartId: number, productId: number, quantity: number = 1
  ): Promise<CartItems> => {

  const [newItem] = await db.insert(cartItems).values({
    cartId,
    productId,
    quantity,
  }).returning();
  return newItem;
};

//for cart checkout 
//used for selecting items from cart and procceed to pay
// Get specific cart items by their primary keys and include product details
export const getCartItemsByIds = async (itemIds: number[]) => {
  if (itemIds.length === 0) {
    return [];
  }
  return await db.query.cartItems.findMany({
    where: inArray(cartItems.id, itemIds), // Use the 'inArray' operator
    with: {
      products: true,
    },
  });
};

//for cart page
// Get all items in a cart and include their product details
export const getCartItemsWithProducts = async (cartId: number) => {
  return await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cartId),
    with: {
      products: true,
    },
  });
};


export const updateCartItemQuantity = async (itemId: number, userId: number, newQuantity: number) => {
  // Find the user's cart first for the security check
  const userCart = await db.query.cart.findFirst({ where: eq(cart.userId, userId) });
  if (!userCart) {
    throw new Error("Cart not found.");
  }

  // Find the item to check its stock and ownership
  const item = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.id, itemId), eq(cartItems.cartId, userCart.id)),
    with: { products: true },
  });

  if (!item) {
    throw new Error("Item not found in your cart.");
  }
  if (newQuantity > item.products.stock) {
    throw new Error("Not enough items in stock.");
  }

  // If all checks pass, update the item
  const [updatedItem] = await db.update(cartItems)
    .set({ quantity: newQuantity })
    .where(eq(cartItems.id, itemId))
    .returning();
  
  return updatedItem;
};

export const deleteCartItem = async (itemId: number, userId: number) => {
  const userCart = await db.query.cart.findFirst({ where: eq(cart.userId, userId) });
  if (!userCart) {
    throw new Error("Cart not found.");
  }

  // Check if the item is in the user's cart before deleting
  const item = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.id, itemId), eq(cartItems.cartId, userCart.id)),
  });

  if (!item) {
    throw new Error("Item not found in your cart.");
  }

  return await db.delete(cartItems).where(eq(cartItems.id, itemId));
};

// // Get orders by userId
// export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
//   return await db.query.orders.findMany({
//     where: eq(orders.userId, userId),
//   });
// };

