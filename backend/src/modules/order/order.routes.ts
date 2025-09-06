import { Router } from 'express';
import * as orderController from './orders.controller';
import { isAuthenticated } from '../../middleware/auth.middleware';

const router = Router();

// PROTECTED ROUTES - Only logged-in users can access these
router.get('/history', isAuthenticated, orderController.handleGetUserOrders);


export default router;