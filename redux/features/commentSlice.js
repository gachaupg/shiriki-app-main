import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import ToastManager, { Toast } from 'toastify-react-native'

const baseURL = "https://erytyu.onrender.com/api/";
const baseURL1 = "https://erytyu.onrender.com/stats/";

const initialState = {
  todos: [],
  addTodoStatus: "",
  addTodoError: "",
  getTodosStatus: "",
  getTodosError: "",
  deleteTodoStatus: "",
  deleteTodoError: "",
  updateTodoStatus: "",
  updateTodoError: "",
};

export const todosAdd = createAsyncThunk(
  "todos/todosAdd",
  async (todo, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseURL + "comment", todo);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getTodos = createAsyncThunk(
  "todos/getTodos",
  async (id = null, { rejectWithValue }) => {
    try {
      const response = await axios.get(baseURL1 + "comment");
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(baseURL + "comment/" + id);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateReview = createAsyncThunk(
  "todos/updateTodo",
  async (todo, { rejectWithValue }) => {
    try {
      const { _id, comment, author, isComplete, date, uid } = todo;

      const response = await axios.put(baseURL + "comment/" + _id, {
        comment,
        author,

        isComplete,
        date,
        uid,
      });
      toast.success("user activated Successfully");

      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const rejectUser = createAsyncThunk(
  "todos/rejectUser",
  async (todo, { rejectWithValue }) => {
    try {
      const { _id, task, author, rating, isComplete, date, uid } = todo;

      const response = await axios.put(baseURL + "todos/status/" + _id, {
        task,
        author,
        isComplete,
        date,
        rating,
        uid,
      });
      toast.success("user rejected Successfully");

      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data);
    }
  }
);
const commentSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: {
    [todosAdd.pending]: (state, action) => {
      return {
        ...state,
        addTodoStatus: "pending",
        addTodoError: "",
        getTodosStatus: "",
        getTodosError: "",
        deleteTodoStatus: "",
        deleteTodoError: "",
        updateTodoStatus: "",
        updateTodoError: "",
      };
    },
    [todosAdd.fulfilled]: (state, action) => {
      // state.todos.push(action.payload);
      return {
        ...state,
        todos: [action.payload, ...state.todos],
        addTodoStatus: "success",
        addTodoError: "",
        getTodosStatus: "",
        getTodosError: "",
        deleteTodoStatus: "",
        deleteTodoError: "",
        updateTodoStatus: "",
        updateTodoError: "",
      };
    },
    [todosAdd.rejected]: (state, action) => {
      return {
        ...state,
        addTodoStatus: "rejected",
        addTodoError: action.payload,
        getTodosStatus: "",
        getTodosError: "",
        deleteTodoStatus: "",
        deleteTodoError: "",
        updateTodoStatus: "",
        updateTodoError: "",
      };
    },
    [getTodos.pending]: (state, action) => {
      return {
        ...state,
        addTodoStatus: "",
        addTodoError: "",
        getTodosStatus: "pending",
        getTodosError: "",
        deleteTodoStatus: "",
        deleteTodoError: "",
        updateTodoStatus: "",
        updateTodoError: "",
      };
    },
    [getTodos.fulfilled]: (state, action) => {
      return {
        ...state,
        todos: action.payload,
        addTodoStatus: "",
        addTodoError: "",
        getTodosStatus: "success",
        getTodosError: "",
        deleteTodoStatus: "",
        deleteTodoError: "",
        updateTodoStatus: "",
        updateTodoError: "",
      };
    },
    [getTodos.rejected]: (state, action) => {
      return {
        ...state,
        addTodoStatus: "",
        addTodoError: "",
        getTodosStatus: "rejected",
        getTodosError: action.payload,
        deleteTodoStatus: "",
        deleteTodoError: "",
        updateTodoStatus: "",
        updateTodoError: "",
      };
    },
    [deleteTodo.pending]: (state, action) => {
      return {
        ...state,
        addTodoStatus: "",
        addTodoError: "",
        getTodosStatus: "",
        getTodosError: "",
        deleteTodoStatus: "pending",
        deleteTodoError: "",
        updateTodoStatus: "",
        updateTodoError: "",
      };
    },
    [deleteTodo.fulfilled]: (state, action) => {
      const currentTodos = state.todos.filter(
        (todo) => todo._id !== action.payload._id
      );
      return {
        ...state,
        todos: currentTodos,
        addTodoStatus: "",
        addTodoError: "",
        getTodosStatus: "",
        getTodosError: "",
        deleteTodoStatus: "success",
        deleteTodoError: "",
        updateTodoStatus: "",
        updateTodoError: "",
      };
    },
    [deleteTodo.rejected]: (state, action) => {
      state = {
        ...state,
        addTodoStatus: "",
        addTodoError: "",
        getTodosStatus: "",
        getTodosError: "",
        deleteTodoStatus: "rejected",
        deleteTodoError: action.payload,
        updateTodoStatus: "",
        updateTodoError: "",
      };
    },
    [updateReview.pending]: (state, action) => {
      return {
        ...state,
        addTodoStatus: "",
        addTodoError: "",
        getTodosStatus: "",
        getTodosError: "",
        deleteTodoStatus: "",
        deleteTodoError: "",
        updateTodoStatus: "pending",
        updateTodoError: "",
      };
    },
    [updateReview.fulfilled]: (state, action) => {
      const updatedTodos = state.todos.map((todo) =>
        todo._id === action.payload._id ? action.payload : todo
      );
      return {
        ...state,
        todos: updatedTodos,
        addTodoStatus: "",
        addTodoError: "",
        getTodosStatus: "",
        getTodosError: "",
        deleteTodoStatus: "",
        deleteTodoError: "",
        updateTodoStatus: "success",
        updateTodoError: "",
      };
    },
    [updateReview.rejected]: (state, action) => {
      return {
        ...state,
        addTodoStatus: "",
        addTodoError: "",
        getTodosStatus: "",
        getTodosError: "",
        deleteTodoStatus: "",
        deleteTodoError: "",
        updateTodoStatus: "rejected",
        updateTodoError: action.payload,
      };
    },
    [rejectUser.pending]: (state, action) => {
      return {
        ...state,
        addTodoStatus: "",
        addTodoError: "",
        getTodosStatus: "",
        getTodosError: "",
        deleteTodoStatus: "",
        deleteTodoError: "",
        updateTodoStatus: "pending",
        updateTodoError: "",
      };
    },
    [rejectUser.fulfilled]: (state, action) => {
      const updatedTodos = state.todos.map((todo) =>
        todo._id === action.payload._id ? action.payload : todo
      );
      return {
        ...state,
        todos: updatedTodos,
        addTodoStatus: "",
        addTodoError: "",
        getTodosStatus: "",
        getTodosError: "",
        deleteTodoStatus: "",
        deleteTodoError: "",
        updateTodoStatus: "success",
        updateTodoError: "",
      };
    },
    [rejectUser.rejected]: (state, action) => {
      return {
        ...state,
        addTodoStatus: "",
        addTodoError: "",
        getTodosStatus: "",
        getTodosError: "",
        deleteTodoStatus: "",
        deleteTodoError: "",
        updateTodoStatus: "rejected",
        updateTodoError: action.payload,
      };
    },
  },
});

export default commentSlice.reducer;
