import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

// Async Thunks
export const registerUser = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    return await authService.register(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const loginUser = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    return await authService.login(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// get current logged in user (if token exists)
export const getCurrentUser = createAsyncThunk("auth/getCurrent", async (_, thunkAPI) => {
  try {
    const user = await authService.getCurrent();
    return { user };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
        state.user = null;
        state.token = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.user = null;
        state.token = null;
      });

    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
