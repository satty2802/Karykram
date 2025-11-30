import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyTickets } from '../features/tickets/ticketSlice';

const MyTickets = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchMyTickets());
  }, [dispatch]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 gbu-heading">My Event Tickets</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {tickets.length === 0 && !loading && <p>No tickets found.</p>}
      <ul className="space-y-6">
        {tickets.map((ticket) => {
          const qrData = ticket.ticketCode || `${ticket._id}`;
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}`;
          return (
            <li key={ticket._id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                <div>
                  <div className="text-lg font-semibold">{ticket.event?.title}</div>
                  <div className="text-sm text-gray-600">{ticket.event?.date ? new Date(ticket.event.date).toLocaleString() : ''}</div>
                  <div className="text-sm text-gray-600">{ticket.event?.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <img src={qrUrl} alt={`QR ${qrData}`} className="w-40 h-40 object-contain bg-white p-2 rounded" />
                  <a href={qrUrl} download={`${qrData}.png`} className="mt-2 text-xs text-gray-600 underline">Download QR</a>
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-500">Ticket Code</div>
                  <div className="font-mono text-lg tracking-wider bg-gray-100 px-3 py-1 rounded mt-1">{ticket.ticketCode || '—'}</div>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${ticket.status === 'paid' ? 'bg-green-100 text-green-800' : ticket.status === 'free' ? 'bg-blue-50 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {ticket.status === 'paid' ? 'Paid' : ticket.status === 'free' ? 'Free' : 'Unpaid'}
                    </span>
                  </div>
                  {ticket.orderId && <div className="text-xs text-gray-500 mt-2">Order: {ticket.orderId}</div>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyTickets;
