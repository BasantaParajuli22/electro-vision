import { Request, Response } from 'express';
import { db } from '../../db'; 
import {  orderItems, orders, cart, cartItems, users, products } from '../../db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';
import Stripe from "stripe";
import stripe from "../../config/stripe.config";
import { OrderDetailsForEmail, sendConfirmationEmail } from '../mail/mail.service';


const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

// This function will handle the successful payment event from Stripe
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  //match stripe signature with our webhook key(signature)
  try {
    // Use the raw body for verification
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session; //create stripe session

    //check meta data 
    //both stripe checkout has meta data of userId and checkoutType
    //check whether checkoutType === "cart" || single_product
    const { userId, checkoutType } = session.metadata!;
    const numericUserId = Number(userId);
    const totalAmount = (session.amount_total! / 100).toFixed(2);

    try {
      // This will hold the data for our email regardless of checkout type
      let orderDetailsForEmail: OrderDetailsForEmail   | null = null;

      //for multiple products //payment completed
      if(checkoutType === "cart"){
        const { cartItemIds } = session.metadata!;
        const numericItemIds = JSON.parse(cartItemIds) as number[];

        orderDetailsForEmail = await db.transaction(async (tx) =>{
          
          //find user 
          const user = await tx.query.users.findFirst({where: eq(users.id, numericUserId)});
          const selectedItems = await tx.query.cartItems.findMany({
            where: inArray(cartItems.id, numericItemIds),//inArray Test whether the first parameter, a column or expression, has a value from a list passed as the second argument.
            with: {products: true},
          })
          if (!user) throw new Error("Webhook: User not found.");
          if (selectedItems.length === 0) throw new Error("Webhook: No cart items found to fulfill.");

          //create order and order items 
          //update each products stock
          const [newOrder] = await tx.insert(orders).values({
            userId: numericUserId,
            totalAmount: totalAmount,
            status: "completed",
          }).returning();

          for (const item of selectedItems){
            const [newOrderItem] = await tx.insert(orderItems).values({
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.products.price, 
            }).returning();

            const updatedProduct = await tx.update(products).set({//update stock
              stock: sql`${products.stock} - ${item.quantity}`,
            }).where( eq( products.id, item.productId))
          }
          
          const deletedItems = await tx.delete(cartItems).where(inArray(cartItems.id, numericItemIds));

          return {
            to: user.email,
            orderId: newOrder.id,
            totalAmount: newOrder.totalAmount,
            // Map the items to a clean format for the email
            items: selectedItems.map(item => ({
              productName: item.products.name,
              imageUrl: item.products.imageUrl,
              quantity: item.quantity,
              unitPrice: item.products.price,
            }))
          };
        });

      //for single products //payment completed
      }else if(checkoutType === "single_product"){

        const { productId, quantity } = session.metadata!;
        const numericProductId =Number(productId);
        const numericQuantity =Number(quantity);

        orderDetailsForEmail = await db.transaction(async (tx) => {
              
          // Fetch the product details for the order item record.
          const product = await tx.query.products.findFirst({ where: eq(products.id, numericProductId) });
          const user = await tx.query.users.findFirst({where: eq(users.id, numericUserId)});
          if (!product) {
            throw new Error(`Product with ID ${productId} not found during fulfillment.`);
          }
          if( !user ){
            throw new Error("no user found");
          }

          //check if product is within stock 
          if(product.stock < numericQuantity){
            throw new Error("no stock found");
          }
          //create order
          const [newOrder] = await tx.insert(orders).values({
            userId: numericUserId,
            totalAmount: totalAmount,
            status: "completed",
          }).returning();

          //create orderitems
          const [newOrderItem] = await tx.insert(orderItems).values({
            orderId: newOrder.id,
            productId: numericProductId,
            quantity: numericQuantity,
            unitPrice: product.price, 
          }).returning();
        
          // const newStock = product.stock - numericQuantity;//this can cause race condition
          //perform calculation at database itself //products.stock (column name) - Quantity 
          //update product stock by reducing quantity
          const [updatedProduct] = await tx.update(products).set({
            stock: sql`${products.stock} - ${numericQuantity}`,
          }).where(eq(products.id, numericProductId)).returning();
            
          
          //this is optional //
          //remove the product id from users cart id 
          //find users cart 
          //if cart.productId matches numericProductId remove cart items
          const existingCart = await tx.query.cart.findFirst({
            where: eq(cart.userId, numericUserId),
          });
          if(existingCart){
            const updatedCart = await tx.delete(cartItems).where(
              and(
                //cart items are of table 
                eq(cartItems.productId, numericProductId),
                eq(cartItems.cartId, existingCart.id),
              )
            )
          }//if close

          return {
            to: user.email,
            orderId: newOrder.id,
            totalAmount: newOrder.totalAmount,
            items: [{
              productName: product.name,
              imageUrl: product.imageUrl,
              quantity: numericQuantity,
              unitPrice: product.price,
            }]
          };
        });//tx close
      }//if close 

      //SEND THE EMAIL works for both cases//
      if (orderDetailsForEmail) {
        await sendConfirmationEmail(orderDetailsForEmail);
      }
    } catch (error: any) {
      console.error('Failed to fulfill order:', error.message);
      return res.status(500).json({ error: 'Failed to create order in database.' });
    }
  }

  // Acknowledge receipt of the event
  //this sends to 
  res.status(200).json({ received: true });
}
