import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    // Razorpay expects amount in paise
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    // return order along with public key id so frontend can open checkout
    return res.json({ order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Create order error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

// Verify payment signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      return res.json({ ok: true });
    }

    // Log mismatch for easier debugging
    console.error('Invalid signature verification', {
      generated_signature,
      razorpay_signature,
      order: razorpay_order_id,
      payment: razorpay_payment_id,
    });

    return res.status(400).json({ ok: false, message: 'Invalid signature' });
  } catch (err) {
    console.error('Verify payment error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};
