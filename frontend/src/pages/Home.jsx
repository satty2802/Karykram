import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../features/events/eventSlice";
import EventCard from "../components/EventCard";
import { useRazorpay } from '../hooks/useRazorpay';
import { toast } from 'react-toastify';
import ticketService from '../features/tickets/ticketService';
import { useState } from 'react';

import { fetchMyTickets } from '../features/tickets/ticketSlice';
import { Link } from 'react-router-dom';

const Home = () => {

  const { events, loading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const { openCheckout } = useRazorpay();
  const [registering, setRegistering] = useState(null);
  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.tickets);

  useEffect(() => {
    if (user) dispatch(fetchMyTickets());
  }, [user, dispatch]);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero / site information */}
        <section className="mb-12 bg-white rounded-lg shadow p-8">
          <h1 className="text-4xl font-extrabold gbu-heading">Welcome to Karykrm — GBU Events</h1>
          <p className="mt-4 text-gray-700">Discover student activities, club events, and campus programs. Sign up or log in to register for events and purchase tickets. Public visitors can browse event summaries but must create an account to access full details and purchase.</p>
          <div className="mt-6">
            {!user ? (
              <>
                <Link to="/signup" className="gbu-btn-primary mr-3">Create Account</Link>
                <Link to="/login" className="text-gray-700 underline">Login</Link>
              </>
            ) : (
              <p className="text-sm text-gray-600">Signed in as <strong>{user.name}</strong> ({user.role})</p>
            )}
          </div>
        </section>

        <h2 className="text-3xl font-extrabold gbu-heading mb-8">Upcoming Events</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for upcoming events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events
              .filter((event) => event.isPublished)
              .map((event) => {
                const imageUrl = event.imageUrl
                  ? event.imageUrl.startsWith('http')
                    ? event.imageUrl
                    : `http://localhost:5001${event.imageUrl}`
                  : null;

                const bookedSet = new Set((tickets || []).map(t => t.event?._id || t.event));
                return (
                  <EventCard
                    key={event._id}
                    event={{ ...event, imageUrl }}
                    isRegistering={registering === event._id}
                    isBooked={bookedSet.has(event._id)}
                    onRegister={async (id) => {
                      try {
                        setRegistering(id);
                        const price = event.price || 0;
                        if (!price || Number(price) <= 0) {
                          // free event - create ticket without payment
                          try {
                            await ticketService.createTicket(id, null, null);
                            toast.success('Registered for free event');
                            // refresh tickets so UI updates
                            dispatch(fetchMyTickets());
                          } catch (err) {
                            console.error('Free registration failed', err);
                            const msg = err?.response?.data?.message || err.message || 'Registration failed';
                            toast.error(msg);
                          }
                          return;
                        }

                        // open razorpay checkout
                        await openCheckout({ amount: price, eventId: id, user });
                      } catch (err) {
                        console.error('Register error:', err);
                        const msg = err?.response?.data?.message || err.message || 'Could not register for event';
                        toast.error(msg);
                      } finally {
                        setRegistering(null);
                      }
                    }}
                  />
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
