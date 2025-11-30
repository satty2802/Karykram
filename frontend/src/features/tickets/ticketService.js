import api from '../../api/axiosConfig';

// Create a ticket after payment
export const createTicket = async (eventId, paymentId, orderId) => {
  const res = await api.post('/tickets', { eventId, paymentId, orderId });
  return res.data;
};

// Get all tickets for current user
export const getMyTickets = async () => {
  const res = await api.get('/tickets/my');
  return res.data;
};

const ticketService = { createTicket, getMyTickets };
export default ticketService;
