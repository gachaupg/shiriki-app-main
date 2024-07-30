/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const api = "https://dev.shiriki.org/api";

export const login = createAsyncThunk(
  "auth/login",
  async ({ user, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/login/`, user);
      // console.log('====================================');
      // console.log(response.data.code);
      // console.log('====================================');
      if (response.data.code === 200) {
        toast.show("Logged  in Successfully");
        navigate("Forums");
      } else {
        toast.show(`Error: ${response.data.message}`);
      }

      return response.data;
    } catch (err) {
      console.log(err);
      toast.show("error try agin", err);
      return rejectWithValue(err.response.data);
    }
  }
);

export const register = createAsyncThunk(
    "/create-account",
    async ({ user, navigate, toast }, { rejectWithValue }) => {
      console.log('====================================');
      console.log('data');
      console.log('====================================');
      try {
        const response = await axios.post(`${api}/create-account/`, user);
        console.log(response.data);
  
        if (response.data.code === 200) {
          toast.show("Registered in Successfully");
        } else {
          toast.show(`Account Created`);
          console.log('errerr regis',response.data);
          navigate("Login"); // Move this line inside the conditional block
        }
  
        return response.data;
      } catch (err) {
        toast.show("Error. Please try again.", err);
        return rejectWithValue(err.response.data);
      }
    }
  );
  
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/delete-user`, id);
      toast.success("Deleted Successfully");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const googleSignIn = createAsyncThunk(
  "auth/googleSignIn",
  async ({ result, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.googleSignIn(result);
      toast.success("Google Sign-in Successfully");
      navigate("/");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: "",
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state, action) => {
      AsyncStorage.clear();
      state.user = null;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      AsyncStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.user = action.payload;
    },
    [login.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [register.pending]: (state, action) => {
      state.loading = true;
    },
    [register.fulfilled]: (state, action) => {
      state.loading = false;
      AsyncStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.user = action.payload;
    },
    [register.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [googleSignIn.pending]: (state, action) => {
      state.loading = true;
    },
    [googleSignIn.fulfilled]: (state, action) => {
      state.loading = false;
      AsyncStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.user = action.payload;
    },
    [googleSignIn.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [deleteUser.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.user = state.user.filter((item) => item._id !== id);
        state.user = state.user.filter((item) => item._id !== id);
      }
    },
    [deleteUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export const { setUser, setLogout } = authSlice.actions;

export default authSlice.reducer;
