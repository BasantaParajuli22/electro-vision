import authRoutes from './auth/auth.routes';
import userRoutes from './user/user.routes';
import orderRoutes from './order/order.routes';
import productRoutes from './product/product.routes';
import paymentRoutes from './payment/payment.routes';
import cartRoutes from './cart/cart.routes';

import { Router } from 'express';

const router = Router();

router.use('/auth', authRoutes);//api/auth doesnot works //setup in oauth is like this 
router.use('/api', userRoutes);
router.use('/api/product', productRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api', paymentRoutes);
router.use('/api', cartRoutes);

export default router;