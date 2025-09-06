import { Request, Response } from "express";
import stripe from "../../config/stripe.config";
import * as queries from '../../db/queries';
import { MyUserType } from '../../types'; // type for req.user

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:5173";

//uses cart items
//this checkout is for many product items with any quantity 
//accepts multiple product items//
export async function createCartCheckoutSession(req: Request, res: Response): Promise<void> {
    const { cartItemIds } = req.body;
    const user = req.user as MyUserType; // Get authenticated user from Passport.js

    try {
    if (!user || !user.id) {
        res.status(401).json({ success: false, message: "User is not authenticated." });
        return;
    }
    
    //find users cart and then find cart items  
    const userCart = await queries.getCartByUserId(user.id);
    if(!userCart){//no user cart found
        throw new Error("no user cart found");
    }

    //selectedCartItems is users selected cart items
    const selectedCartItems = await queries.getCartItemsByIds(cartItemIds);
    if(!selectedCartItems){//nothing selected
        throw new Error("no selected CartItems  found");
    }

    const line_items:any[] =[];
    let totalQuantity = 0;
    let subTotal = 0;
    let cent = 100;
    
    //find all users Cart.cartId == selectedItemIds.cartId
    //all selected items should match users cart id //otherwise throw error //
    //  no access to others cart items
    //check whether all selected items has enough stock to proceed //
    //  throw error according to specific items

    //build stripe line_items in a array for all items
    //calculate total price 
    for(const item of selectedCartItems){
        if(item.cartId !== userCart.id){
            throw new Error("Error selected CartItem id is not from userCart ");
        }
        if(item.products.stock < item.quantity){
            throw new Error(" user has selected more stock than available. Not enough stocks");
        }
        line_items.push({
            price_data: {
                unit_amount: Number(item.products.price)  * cent,
                currency: "usd",

                product_data:{//product data must be obj
                    name: item.products.name,
                    description: item.products.description,
                    images: [item.products.imageUrl],
                } 
            },
            quantity: item.quantity
        })
        totalQuantity= totalQuantity + item.quantity,
        subTotal= subTotal + Number(item.products.price) * item.quantity;

    }

    if(selectedCartItems.length === 0){
        throw new Error("no selected cart items found or calculated");
    }

    //apply discount to all products
    //calculate transactions fees and deleivery and all //push to line_items
    const baseFee = 500; //500 cent is base fee for each transaction 
    const feePercent = 0.05;//5%
    
    let discountPercent = 0; //no discount for less than 6 quantity
    if(totalQuantity >= 6  && totalQuantity < 12){
        discountPercent = 0.3; //30% for 6 - 11 products
    }else if(totalQuantity >= 12  ){
        discountPercent = 0.5;  //50% for 12 and above products
    }

    const totalFeeWithoutDiscount = subTotal * feePercent * cent;
    const discountedFee = Math.round(totalFeeWithoutDiscount * (1 - discountPercent));
    const totalFee = baseFee + discountedFee; 

    line_items.push({
        price_data: {
            unit_amount: totalFee,
            currency: "usd",
            product_data: {//product_data must be object
                name: "Transaction fees ",
            },
        },
        quantity: 1
    })

    //create a stripe session
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ['card'],
        line_items: line_items, //pass array of line_items ,
        metadata: {             // Store what you need to fulfill the order in metadata
            checkoutType: "cart",
            userId: user.id.toString(),
            cartItemIds: JSON.stringify(cartItemIds),
        },
        success_url: `${FRONTEND_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FRONTEND_BASE_URL}/payment-cancelled`,
    });

    res.status(200).json({
        success: true,
        message: "Checkout session created successfully.",
        url: session.url,
    });

    } catch (error: any) {
        console.error("Stripe session creation error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create checkout session.",
            error: error.message,
        });
    }
}




//this checkout is for single product item with any quantity 
//doesnot accepts multiple product items
export async function createCheckoutSession(req: Request, res: Response): Promise<void> {
    const { productId: productString, quantity: quantityString } = req.body;
    const user = req.user as MyUserType; // Get authenticated user from Passport.js

    if (!user || !user.id) {
        res.status(401).json({ success: false, message: "User is not authenticated." });
        return;
    }

    const productId = Number(productString);
    const quantity = Number(quantityString);

    // validation
    if (!productString || isNaN(productId)) {
        res.status(400).json({ success: false, message: "A valid product ID is required." });
        return;
    }
    if (!quantityString || isNaN(quantity) || quantity <= 0) {
        res.status(400).json({ success: false, message: "A valid, positive quantity is required." });
        return;
    }

    try {
        const product = await queries.getProductById(productId);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found." });
            return;
        }

        if (product.stock < quantity) {
            res.status(400).json({ success: false, message: "Not enough items in stock." });
            return;
        }

        //this is cent price 1$ = 100 cents 
        //and could be used for 1NPR = 100 paisa when using automatic currency
        const centPrice = 100;

        // The price from Drizzle's decimal type is a string, so we parse it
        //calculate product price 
        const unitAmount = Math.round(parseFloat(product.price) * centPrice); 
        
        
        //and then calculate fees for transaction
        //5% per product and amt in cents 
        const baseFee = 500; //500 cent is base fee for each transaction 
        const feePercent = 0.05; //5% per product

        //calculate total fee  //should be in cents 
        const feePerProduct = parseFloat(product.price) * feePercent * centPrice ; 
        const percentFeeWithoutDiscount = feePerProduct * quantity;


        //Discount Calculation
        let discountPercent = 0; //no discount for less than 6 quantity

        if(quantity >= 6  && quantity < 12){
            discountPercent = 0.3; //30% for 6 - 11 products
        }else if(quantity >= 12  ){
            discountPercent = 0.5;  //50% for 12 and above products
        }
      
        //final transaction fee 
        //Eg: 100 * (1 -0.05) // 100 * 0.95 
        const totalFee = baseFee + Math.round(percentFeeWithoutDiscount * (1 - discountPercent)); 


        //if u  have to deliever products 
        //check if user has mark as to be deleivered
        //then add delevery charge in the  line items[]

        //it could depend on category/size of items like big or small 
        //it could depend on number of products or distance 
        //or user should have option to select no to delievery 
        
        // if deliveryRequested  then add deleivery fee 
        //const deleveryFee = 1000; //const delievery fee 


        //create a stripe session
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: "usd", //or "automatic" 
                        unit_amount: unitAmount, // Price in cents

                        product_data: {
                            name: product.name,
                            description: product.description || undefined,
                            images: [product.imageUrl || "" ],
                        },
                    },
                    quantity: quantity,
                },
                {
                    price_data:{
                        currency: "usd",
                        unit_amount: totalFee,//fees 
                        product_data:{
                            name: "transaction fees",
                        }
                    },
                    quantity: 1 //cut fees only once
                }
            ],
            // Store what you need to fulfill the order in metadata
            metadata: {
                checkoutType: "single_product",
                userId: user.id.toString(),
                productId: product.id.toString(),
                quantity: quantity.toString(),
            },
            success_url: `${FRONTEND_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${FRONTEND_BASE_URL}/payment-cancelled`,
        });

        res.status(200).json({
            success: true,
            message: "Checkout session created successfully.",
            url: session.url,
        });

    } catch (error: any) {
        console.error("Stripe session creation error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create checkout session.",
            error: error.message,
        });
    }
}


