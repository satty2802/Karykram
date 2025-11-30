import Event from "../models/Event.js";
import fs from 'fs';
import path from 'path';
import cloudinary from '../config/cloudinary.js';

// @desc Create a new event (admin only)
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, club, members, isPublished, price } =
      req.body;

    let imageUrl = null;
    let imagePublicId = null;

    // If multer saved a file locally, upload it to Cloudinary (if configured)
    if (req.file) {
      try {
        // Upload using the local path from multer
        const uploadRes = await cloudinary.uploader.upload(req.file.path, {
          folder: process.env.CLOUDINARY_FOLDER || 'event_posters',
        });
        imageUrl = uploadRes.secure_url;
        imagePublicId = uploadRes.public_id;

        // remove local file after upload
        fs.unlink(req.file.path, (err) => {
          if (err) console.warn('Failed to delete local upload:', err.message);
        });
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError.message);
        // fallback to local url if you want, otherwise continue without image
      }
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      club,
      members,
      isPublished,
      price: price ? Number(price) : 0,
      createdBy: req.user._id,
      imageUrl,
      imagePublicId,
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
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // If the event has an image stored in Cloudinary, remove it
    if (event.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(event.imagePublicId);
      } catch (err) {
        console.warn('Failed to remove image from Cloudinary:', err.message);
      }
    }

    await event.deleteOne();

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

