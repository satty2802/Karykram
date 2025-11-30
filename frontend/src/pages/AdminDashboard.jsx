import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, deleteEvent, publishEvent } from "../features/events/eventSlice";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

import EventCard from "../components/EventCard";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold gbu-heading">Admin Dashboard</h2>
          <Link
            to="/create-event"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white gbu-btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Event
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: 'var(--gbu-light-blue)'}}></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium gbu-heading">No events found</h3>
            <p className="mt-1 text-sm text-gray-700">Start by creating a new event.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const imageUrl = event.imageUrl
                ? event.imageUrl.startsWith('http')
                  ? event.imageUrl
                  : `http://localhost:5001${event.imageUrl}`
                : null;

              return (
              <EventCard
                key={event._id}
                event={{ ...event, imageUrl }}
                onDelete={async (id) => {
                  if (window.confirm('Are you sure you want to delete this event?')) {
                    try {
                      const response = await dispatch(deleteEvent(id));
                      if (response.meta.requestStatus === 'fulfilled') {
                        toast.success('Event deleted successfully');
                      } else {
                        toast.error('Failed to delete event');
                      }
                    } catch (error) {
                      toast.error('Error deleting event');
                      console.error('Delete error:', error);
                    }
                  }
                }}
                onPublish={async (id) => {
                  try {
                    const response = await dispatch(publishEvent(id));
                    if (response.meta.requestStatus === 'fulfilled') {
                      toast.success('Event published successfully');
                    } else {
                      toast.error('Failed to publish event');
                    }
                  } catch (error) {
                    toast.error('Error publishing event');
                    console.error('Publish error:', error);
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

export default AdminDashboard;
