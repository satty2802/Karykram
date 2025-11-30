import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  paymentId: { type: String },
  orderId: { type: String },
  ticketCode: { type: String, unique: true, index: true },
  status: { type: String, enum: ['paid', 'unpaid', 'free'], default: 'unpaid' },
  createdAt: { type: Date, default: Date.now },
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;