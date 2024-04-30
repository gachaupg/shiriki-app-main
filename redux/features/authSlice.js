/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const api = 'http://137.184.9.57/api'

export const login = createAsyncThunk(
    "auth/login",
    async({ user, navigate, toast }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${api}/login/`, user);
            // console.log('====================================');
            // console.log(response);
            // console.log('====================================');
            toast.show("Logined Successfully");
            navigate("Home");
            return response.data;
        } catch (err) {
            // console.log('====================================');
            // console.log(err);
            // console.log('====================================');
            return rejectWithValue(err.response.data);
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async({ user, navigate, toast }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${api}/create-account/`, user);
            toast.show("Register Successfully");
            navigate("Login");
            return response.data;
        } catch (err) {
            toast.show('error try agin', err);
            return rejectWithValue(err.response.data);
        }
    }
);
export const deleteUser = createAsyncThunk(
    "auth/deleteUser",
    async({ id, toast }, { rejectWithValue }) => {
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
    async({ result, navigate, toast }, { rejectWithValue }) => {
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
            AsyncStorage.setItem("profile", JSON.stringify({...action.payload }));
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
            AsyncStorage.setItem("profile", JSON.stringify({...action.payload }));
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
            AsyncStorage.setItem("profile", JSON.stringify({...action.payload }));
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