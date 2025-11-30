import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js';

// Create a ticket after successful payment
export const createTicket = async (req, res) => {
  try {
    const { eventId, paymentId, orderId } = req.body;
    if (!eventId) {
      return res.status(400).json({ message: 'Missing required fields: eventId' });
    }
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Prevent duplicate ticket for same user/event
    const existing = await Ticket.findOne({ user: req.user._id, event: eventId });
    if (existing) return res.status(400).json({ message: 'Ticket already exists' });

    // If paymentId/orderId not provided, treat as free registration
    const status = paymentId && orderId ? 'paid' : 'free';

    // Generate a short unique ticket code
    const generateTicketCode = () => {
      const ts = Date.now().toString(36).toUpperCase();
      const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
      return `GBU-${ts}-${rnd}`;
    };

    let ticketCode = generateTicketCode();
    // ensure uniqueness (rare collision) - try a few times
    let tries = 0;
    while (await Ticket.findOne({ ticketCode }) && tries < 5) {
      ticketCode = generateTicketCode();
      tries += 1;
    }

    const ticket = await Ticket.create({
      user: req.user._id,
      event: eventId,
      paymentId: paymentId || null,
      orderId: orderId || null,
      status,
      ticketCode,
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List tickets for current user
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('event');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};