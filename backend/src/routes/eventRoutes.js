import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  publishEvent,
} from "../controllers/eventController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public/User Routes
router.get("/", protect, getEvents);
router.get("/:id", protect, getEventById);

// Admin Routes
router.post("/", protect, adminOnly, upload.single("image"), createEvent);
router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);
router.put("/:id/publish", protect, adminOnly, publishEvent);

export default router;
