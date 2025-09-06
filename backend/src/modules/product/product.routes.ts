import { Router } from 'express';
import * as productController from './products.controller';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductsById);

export default router;