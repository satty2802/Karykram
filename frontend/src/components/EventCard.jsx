import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const EventCard = ({ event, onRegister, onDelete, onPublish, isRegistering = false, isBooked = false }) => {
  const { user } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();

  const imageSrc = event.imageUrl || event.image || null;
  const venue = event.location || event.venue || 'TBD';

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const onOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) closeModal();
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        onClick={openModal}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => { if (e.key === 'Enter') openModal(); }}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-6">
          <h3 className="text-lg font-semibold gbu-heading mb-1 truncate">{event.title}</h3>
          <p className="text-sm text-gray-600 truncate">{event.description}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                event.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {event.isPublished ? 'Published' : 'Draft'}
              </span>
              <span className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                {event.price && Number(event.price) > 0 ? `₹${Number(event.price).toFixed(2)}` : 'Free'}
              </span>
            </div>

            <div>
              {user?.role === 'student' && new Date(event.date) > new Date() && (
                  isBooked ? (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-800">Booked</span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); onRegister && onRegister(event._id); }}
                      className={`gbu-btn-primary text-sm ${isRegistering ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={isRegistering}
                    >
                      {isRegistering ? 'Registering...' : 'Register'}
                    </button>
                  )
                )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={onOverlayClick}
        >
          <div ref={modalRef} className="bg-white rounded-lg max-w-3xl w-full overflow-hidden shadow-xl">
            {imageSrc && (
              <img src={imageSrc} alt={event.title} className="w-full h-72 object-cover" />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold gbu-heading">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{venue} • {new Date(event.date).toLocaleString()}</p>
                </div>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>

              {/* If user is not authenticated show limited info and prompt to login/signup */}
              {!user ? (
                <>
                  <p className="mt-4 text-gray-700 line-clamp-3">{event.description}</p>
                  <div className="mt-6 flex items-center justify-end gap-3">
                    <a href="/login" className="gbu-btn-primary px-4 py-2">Login to Register</a>
                    <a href="/signup" className="border px-4 py-2 rounded-md text-sm">Create Account</a>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-4 text-gray-700">{event.description}</p>

                  <div className="mt-6 flex items-center justify-end gap-3">
                    {user?.role === 'admin' && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this event?')) onDelete && onDelete(event._id); }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Delete
                        </button>
                        {!event.isPublished && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onPublish && onPublish(event._id); }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                          >
                            Publish
                          </button>
                        )}
                      </>
                    )}

                    {user?.role === 'student' && new Date(event.date) > new Date() && (
                      isBooked ? (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-800">Booked</span>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); onRegister && onRegister(event._id); closeModal(); }}
                          className={`gbu-btn-primary px-4 py-2 text-sm ${isRegistering ? 'opacity-70 cursor-not-allowed' : ''}`}
                          disabled={isRegistering}
                        >
                          {isRegistering ? 'Processing...' : 'Register & Pay'}
                        </button>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;
