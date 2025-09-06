import { Request, Response } from "express";
import { MyUserType } from "../../types";
import * as queries from '../../db/queries';

//users add items to cart
//which product and quantity to add to cart 
export async function addToCart(req: Request, res: Response) {
    const { productId: productString, quantity:quantityString   } = req.body;

    const user = req.user as MyUserType; //from middleware
    if(!user || !user.id){
        res.status(401).json({ success: false, message: "User is not authenticated." });
        return;
    }

    //converting string to number
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

    //find product if exists or not
    const product = await queries.getProductById(productId);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found." });
    }

    //check whether there is users cart or not 
    //if not then create cart for user
    let cart = await queries.getCartByUserId(user.id);
    if( !cart ){
        cart = await queries.addCart(user.id);
    }
    
    const cartId = Number(cart.id);
    let cartItems;
    
    //check if cart already has that product or not 
    //if exists update the existingItem 
    //if not add new cart item
    const existingItem = await queries.getCartItem(Number(cart.id), product.id);
    if( existingItem ){//then update quantity
        cartItems = await queries.updateCartItemQuantity(existingItem.id, user.id, Number(existingItem.quantity + quantity));
    }else{
        cartItems =await queries.addCartItem(cartId, product.id, quantity);
    }

    //return success
    res.status(200).json({ message: "Item added to cart successfully", cartItems });
}

//display all cart items of cart of user
export async function getCartItems(req: Request, res: Response) {
    const user = req.user as MyUserType; //from middleware
    if(!user || !user.id){
        res.status(401).json({ success: false, message: "User is not authenticated." });
        return;
    }

    try {
        //find user cart if not create
        let cart = await queries.getCartByUserId(user.id);
        if( !cart ){
            return res.status(200).json({message: "success", cartItems:[]}) //empty cart items
        }       
        const cartItems = await queries.getCartItemsWithProducts(cart.id);
    
        res.status(200).json({ message: "success", cartItems });
    } catch (error) {
        res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
}

export async function updateItemQuantity(req: Request, res: Response) {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const user = req.user as MyUserType;

  if (!user || !user.id) {
    return res.status(401).json({ message: "Not authenticated." });
  }
  if (!quantity || Number(quantity) < 1) {
    return res.status(400).json({ message: "A valid quantity is required." });
  }

  try {
    const updatedItem = await queries.updateCartItemQuantity(Number(itemId), user.id, Number(quantity));
    res.status(200).json({ success: true, message: "Quantity updated.", cartItem: updatedItem });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}


export async function removeItemFromCart(req: Request, res: Response) {
  const { itemId } = req.params;
  const user = req.user as MyUserType;

  if (!user || !user.id) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  try {
    await queries.deleteCartItem(Number(itemId), user.id);
    res.status(200).json({ success: true, message: "Item removed from cart." });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
}