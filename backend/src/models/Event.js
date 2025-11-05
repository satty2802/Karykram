import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an event title"],
    },
    description: {
      type: String,
      required: [true, "Please provide an event description"],
    },
    date: {
      type: Date,
      required: [true, "Please provide a date for the event"],
    },
    location: {
      type: String,
      required: [true, "Please provide a location"],
    },
    club: {
      type: String,
      required: [true, "Please specify the organizing club or committee"],
    },
    members: [
      {
        name: String,
        role: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
     imageUrl: { type: String },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
