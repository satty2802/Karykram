import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../features/events/eventSlice";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    club: "",
    isPublished: false,
  });
  const [poster, setPoster] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.events);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("date", formData.date);
    form.append("location", formData.location || "TBD");
    form.append("club", formData.club || "General");
    form.append("isPublished", formData.isPublished);
    if (poster) form.append("image", poster);

    const res = await dispatch(createEvent(form));
    if (res.meta.requestStatus === "fulfilled") {
      alert("Event created successfully!");
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900">
            Create New Event
          </h2>

          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            {/* Event Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Event Title
              </label>
              <div className="mt-1">
                <input
                  id="title"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Event Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  rows="4"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter event description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Event Date
              </label>
              <div className="mt-1">
                <input
                  id="date"
                  type="date"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1">
                <input
                  id="location"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Event location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            {/* Club */}
            <div>
              <label htmlFor="club" className="block text-sm font-medium text-gray-700">
                Organizing Club
              </label>
              <div className="mt-1">
                <input
                  id="club"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Club or committee name"
                  value={formData.club}
                  onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                />
              </div>
            </div>

            {/* Poster */}
            <div>
              <label htmlFor="poster" className="block text-sm font-medium text-gray-700">
                Event Poster
              </label>
              <div className="mt-1">
                <input
                  id="poster"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setPoster(e.target.files[0])}
                />
              </div>
            </div>

            {/* Publish Checkbox */}
            <div className="flex items-center space-x-3">
              <input
                id="publish"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              <label htmlFor="publish" className="text-sm text-gray-700">
                Publish immediately
              </label>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
