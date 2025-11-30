import api from './axiosConfig';

const createOrder = async (amount, receipt, eventId) => {
  const res = await api.post('/payments/order', { amount, receipt, eventId });
  return res.data;
};

const verifyPayment = async (payload) => {
  const res = await api.post('/payments/verify', payload);
  return res.data;
};

const paymentService = { createOrder, verifyPayment };
export default paymentService;
