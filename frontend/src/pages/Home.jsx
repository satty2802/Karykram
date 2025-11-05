import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../features/events/eventSlice";
import EventCard from "../components/EventCard";

const Home = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Upcoming Events</h2>
        
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
              .filter(event => event.isPublished)
              .map((event) => (
                <EventCard
                  key={event._id}
                  event={{
                    ...event,
                    imageUrl: event.imageUrl ? `http://localhost:5001${event.imageUrl}` : null,
                  }}
                />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
