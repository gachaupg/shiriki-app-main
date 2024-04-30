import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from '../api'
import axios from "axios";

export const createProject = createAsyncThunk(
    "project/createProject",
    async(formData, navigate) => {
        try {
            const response = await api.createMpesa(formData)
            toast.success("Check your phone so as to pay");
            navigate('/new-product')
            return response.data;

        } catch (error) {
            if (!formData) {
                toast.error('error');

            }
        }
    }
);
// export const getProjects = createAsyncThunk(
//   "project/getProject",
//   async (_, {rejectWithValue}) => {
//     try {
//       const response = await api.getprojects()
//         return response.data;
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response?.data);
//     }
//   }
// );
export const getProjectsByUser = createAsyncThunk(
    "tour/getProjectsByUser",
    async(userId, { rejectWithValue }) => {
        try {
            const response = await api.getProjectsByUser(userId);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const likeTour = createAsyncThunk(
    "tour/likeTour",
    async({ _id }, { rejectWithValue }) => {
        try {
            const response = await api.likeTour(_id);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const getTours = createAsyncThunk(
    "tour/getTours",
    async(page, { rejectWithValue }) => {
        try {
            const response = await api.getTours(page);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getTour = createAsyncThunk(
    "tour/getTour",
    async(id, { rejectWithValue }) => {
        try {
            const response = await api.getTour(id);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const deleteTour = createAsyncThunk(
    "tour/deleteTour",
    async({ id, toast }, { rejectWithValue }) => {
        try {
            const response = await api.deleteTour(id);
            toast.success("Deleted Successfully");
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateTour = createAsyncThunk(
    "tour/updateTour",
    async({ id, updatedTourData, toast, navigate }, { rejectWithValue }) => {
        try {
            const response = await api.updateTour(updatedTourData, id);
            toast.success("Tour Updated Successfully");
            navigate("/");
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const searchTours = createAsyncThunk(
    "tour/searchTours",
    async(searchQuery, { rejectWithValue }) => {
        try {
            const response = await api.getToursBySearch(searchQuery);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getToursByTag = createAsyncThunk(
    "tour/getToursByTag",
    async(tag, { rejectWithValue }) => {
        try {
            const response = await api.getTagTours(tag);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getRelatedTours = createAsyncThunk(
    "tour/getRelatedTours",
    async(tags, { rejectWithValue }) => {
        try {
            const response = await api.getRelatedTours(tags);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const mpesaSlice = createSlice({
    name: "project",
    initialState: {
        tour: {},
        tours: [],
        userTours: [],
        tagTours: [],
        relatedTours: [],
        currentPage: 1,
        numberOfPages: null,
        error: "",
        loading: false,
        projec: {},
        project: [],
        projects: [],
        projec: [],
        // userProjects:[],
        error: "",
    },
    reducers: {
        //   setUser: (state, action) => {
        //     state.user = action.payload;
        //   },
        //   setLogout: (state, action) => {
        //     localStorage.clear();
        //     state.user = null;
        //   },
    },
    extraReducers: {
        [createProject.pending]: (state, action) => {
            state.loading = true;
        },
        [createProject.fulfilled]: (state, action) => {
            state.loading = false;
            state.projects = action.payload;
        },
        [createProject.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        // [getProjects.pending]: (state, action) => {
        //   state.loading = true;
        // },
        // [getProjects.fulfilled]: (state, action) => {
        //   state.loading = false;
        //   state.project = action.payload;
        // },
        // [getProjects.rejected]: (state, action) => {
        //   state.loading = false;
        //   state.error = action.payload.message;
        // },
        [getProjectsByUser.pending]: (state, action) => {
            state.loading = true;
        },
        [getProjectsByUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.projects = action.payload;
        },
        [getProjectsByUser.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [getTours.pending]: (state, action) => {
            state.loading = true;
        },
        [getTours.fulfilled]: (state, action) => {
            state.loading = false;
            state.tours = action.payload.data;

        },
        [getTours.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [getTour.pending]: (state, action) => {
            state.loading = true;
        },
        [getTour.fulfilled]: (state, action) => {
            state.loading = false;
            state.projects = action.payload;
        },
        [getTour.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [deleteTour.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteTour.fulfilled]: (state, action) => {
            state.loading = false;
            const {
                arg: { id },
            } = action.meta;
            if (id) {
                state.userTours = state.userTours.filter((item) => item._id !== id);
                state.tours = state.tours.filter((item) => item._id !== id);
            }
        },
        [deleteTour.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [updateTour.pending]: (state, action) => {
            state.loading = true;
        },
        [updateTour.fulfilled]: (state, action) => {
            state.loading = false;
            const {
                arg: { id },
            } = action.meta;
            if (id) {
                state.projects = state.projects.map((item) =>
                    item._id === id ? action.payload : item
                );
                state.projects = state.projects.map((item) =>
                    item._id === id ? action.payload : item
                );
            }
        },
        [updateTour.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [likeTour.pending]: (state, action) => {},
        [likeTour.fulfilled]: (state, action) => {
            state.loading = false;
            const {
                arg: { _id },
            } = action.meta;
            if (_id) {
                state.tours = state.tours.map((item) =>
                    item._id === _id ? action.payload : item
                );
            }
        },
        [likeTour.rejected]: (state, action) => {
            state.error = action.payload.message;
        },

        [searchTours.pending]: (state, action) => {
            state.loading = true;
        },
        [searchTours.fulfilled]: (state, action) => {
            state.loading = false;
            state.projects = action.payload;
        },
        [searchTours.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [getToursByTag.pending]: (state, action) => {
            state.loading = true;
        },
        [getToursByTag.fulfilled]: (state, action) => {
            state.loading = false;
            state.tagTours = action.payload;
        },
        [getToursByTag.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [getRelatedTours.pending]: (state, action) => {
            state.loading = true;
        },
        [getRelatedTours.fulfilled]: (state, action) => {
            state.loading = false;
            state.relatedTours = action.payload;
        },
        [getRelatedTours.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },

    },
});
export default mpesaSlice.reducer;