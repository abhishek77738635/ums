import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import lockr from "lockr";

// Load initial auth state from localStorage
const storedToken = lockr.get("token") || null;
const storedUser = lockr.get("user") || null;
const storedPermissions = lockr.get("permissions") || [];

// Async function for API login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://interview.optimavaluepro.com/api/v1/login", {
        email,
        password,
      });

      const data = response.data.data; // Extract relevant user data
      return {
        token: data.authorization,
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role?.name || "User",
          profile: data.profile,
          status: data.status_text,
          gender: data.gender_text,
        },
        permissions: data.permissions || [], // Store permissions
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser, // Load user from localStorage
    token: storedToken, // Load token from localStorage
    permissions: storedPermissions, // Load permissions
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.permissions = [];
      lockr.rm("token"); // Remove token from localStorage
      lockr.rm("user"); // Remove user data from localStorage
      lockr.rm("permissions"); // Remove permissions
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        lockr.set("token", action?.payload?.token);
        lockr.set("user", action?.payload?.user);
        lockr.set("permissions", action?.payload?.permissions);
        
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.permissions = action.payload.permissions;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
