import express from 'express';
import { createTicket, getMyTickets } from '../controllers/ticketController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a ticket (after payment)
router.post('/', protect, createTicket);

// Get all tickets for current user
router.get('/my', protect, getMyTickets);

export default router;