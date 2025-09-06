import { Request, Response, NextFunction } from 'express';
import * as queries from '../../db/queries';


export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const products = await queries.getAllProducts();
        if (!products) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({message: "products found", products});
    } catch (error) {
        res.status(404).json("error");
        return;
    }
}


export async function getProductsById(req: Request, res: Response, next: NextFunction) {
    try {
        let id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid product id" });
        }
        const product = await queries.getProductById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json("error");
        return;
    }
}