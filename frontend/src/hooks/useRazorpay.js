import paymentService from '../api/paymentService';
import ticketService from '../features/tickets/ticketService';
import { toast } from 'react-toastify';

// Helper to dynamically load Razorpay script
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const useRazorpay = () => {
  const openCheckout = async ({ amount = 0, eventId, user }) => {
    const ok = await loadRazorpayScript();
    if (!ok) {
      toast.error('Failed to load payment gateway. Try again later.');
      return;
    }

    try {
      // Create order on server (amount in INR)
      const res = await paymentService.createOrder(amount, `ticket_${eventId}`, eventId);
      const { order, key_id } = res;

      const options = {
        key: key_id,
        amount: order.amount, // amount in paise
        currency: order.currency,
        name: 'Event Payment',
        description: 'Event ticket',
        order_id: order.id,
        handler: async function (response) {
          try {
            // verify on server
            await paymentService.verifyPayment(response);
            // create ticket record
            await ticketService.createTicket(eventId, response.razorpay_payment_id, response.razorpay_order_id);
            toast.success('Payment successful and ticket created');
          } catch (err) {
            console.error('Payment verification/create ticket failed', err);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: { color: getComputedStyle(document.documentElement).getPropertyValue('--gbu-blue') || '#003366' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Open checkout error', err);
      toast.error('Could not create payment order');
    }
  };

  return { openCheckout };
};

export default useRazorpay;
