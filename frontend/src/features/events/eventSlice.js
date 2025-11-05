import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import eventService from "./eventService";

const initialState = {
  events: [],
  loading: false,
  error: null,
};

// Fetch all events
export const fetchEvents = createAsyncThunk("events/fetch", async (_, thunkAPI) => {
  try {
    return await eventService.getEvents();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Create event
export const createEvent = createAsyncThunk("events/create", async (formData, thunkAPI) => {
  try {
    return await eventService.createEvent(formData);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Delete event
export const deleteEvent = createAsyncThunk("events/delete", async (eventId, thunkAPI) => {
  try {
    await eventService.deleteEvent(eventId);
    return eventId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Publish event
export const publishEvent = createAsyncThunk("events/publish", async (eventId, thunkAPI) => {
  try {
    const updatedEvent = await eventService.publishEvent(eventId);
    return updatedEvent;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(event => event._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(publishEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(publishEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(event => event._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(publishEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
