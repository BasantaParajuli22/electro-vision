import { Request, Response, NextFunction } from 'express';
import { MyUserType } from '../../types'; // Import your custom user type
import { db } from '../../db';
import {  orders, products } from '../../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Fetches the complete order history for the currently logged-in user.
 * It includes all associated order items and product details for each order.
 */
export const handleGetUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as MyUserType;
    if (!user || !user.id) {
        return res.status(401).json({ error: 'User not authenticated or user data is missing.' });
    }

    try {
        const userOrders = await db.query.orders.findMany({
            where: eq(orders.userId, user.id),
            with: {
                orderItems: {
                    with: {
                        products: true//nested product details
                    },
                },
            },
        });
        if(!userOrders){
            return res.status(404).json({ message: "No orders found for this user." });
        }
        res.status(200).json(userOrders);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ error: 'An unexpected error occurred.' });
    }
};



//extra notes //

// const userOrders = await db.query.orders.findMany({
//     where: eq(orders.userId, user.id),
//     with: {
//         orderItems: {
//             select:{//selects items quantity and price with 
//                 quantity:true,
//                 price: true,
//             },
//             with: {
//                 product: {//selects product name description
//                     select:{//specific selection
//                         name: true,
//                         description: true,
//                     },
//                 },
//             },
//         },
//     },
// });