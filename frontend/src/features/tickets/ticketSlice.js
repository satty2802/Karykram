import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ticketService from './ticketService';

const initialState = {
  tickets: [],
  loading: false,
  error: null,
};

export const fetchMyTickets = createAsyncThunk('tickets/fetchMy', async (_, thunkAPI) => {
  try {
    return await ticketService.getMyTickets();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ticketSlice.reducer;
