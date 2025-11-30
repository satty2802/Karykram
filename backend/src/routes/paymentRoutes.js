import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create an order (authenticated users)
router.post('/order', protect, createOrder);

// Verify payment (authenticated)
router.post('/verify', protect, verifyPayment);

export default router;
