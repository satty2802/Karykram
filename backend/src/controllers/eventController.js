import Event from "../models/Event.js";

// @desc Create a new event (admin only)
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, club, members, isPublished } =
      req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      club,
      members,
      isPublished,
      createdBy: req.user._id,
       imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

// @desc Get all events (for all users)
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// @desc Get single event details
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
};

// @desc Update an event (admin only)
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    Object.assign(event, req.body);
    await event.save();

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};

// @desc Delete an event (admin only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Also delete the image file if it exists
    if (event.imageUrl) {
      // File deletion logic here if needed
    }

    res.status(200).json({ message: "Event deleted successfully", id: event._id });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};

// @desc Publish an event (admin only)
export const publishEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.isPublished = true;
    await event.save();

    res.status(200).json(event);
  } catch (error) {
    console.error("Publish error:", error);
    res.status(500).json({ message: "Error publishing event", error: error.message });
  }
};

