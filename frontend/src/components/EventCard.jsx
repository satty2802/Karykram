import React from 'react';
import { useSelector } from 'react-redux';

const EventCard = ({ event, onRegister, onDelete }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.venue}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              event.isPublished 
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {event.isPublished ? 'Published' : 'Draft'}
            </span>
            
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              new Date(event.date) > new Date()
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
            </span>
          </div>
          
          <div className="space-x-2">
            {user?.role === 'admin' && (
              <>
                <button
                  onClick={() => onDelete && onDelete(event._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                >
                  Delete
                </button>
                {!event.isPublished && (
                  <button
                    onClick={() => onPublish && onPublish(event._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Publish
                  </button>
                )}
              </>
            )}
            
            {user?.role === 'student' && new Date(event.date) > new Date() && (
              <button
                onClick={() => onRegister && onRegister(event._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
