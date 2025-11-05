import api from "../../api/axiosConfig";

// Get all events
const getEvents = async () => {
  const res = await api.get("/events");
  return res.data;
};

// Create a new event (with image upload)
const createEvent = async (formData) => {
  // Let axios set the Content-Type with boundary for FormData
  const res = await api.post("/events", formData);
  return res.data;
};

// Delete an event
const deleteEvent = async (eventId) => {
  const res = await api.delete(`/events/${eventId}`);
  return res.data;
};

// Publish an event
const publishEvent = async (eventId) => {
  const res = await api.put(`/events/${eventId}/publish`);
  return res.data;
};

const eventService = { getEvents, createEvent, deleteEvent, publishEvent };
export default eventService;
