import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

import eventReducer from "../features/events/eventSlice";
import ticketReducer from "../features/tickets/ticketSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    tickets: ticketReducer,
  },
});

export default store;
