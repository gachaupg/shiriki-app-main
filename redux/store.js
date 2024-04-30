import AuthReducer from "./features/authSlice";
import todosReducer from "./features/todosSlice";
import commentReducer from "./features/commentSlice";
import invoiceReducer from "./features/invoiceSlice";
import quizReducer from "./features/quizSlice";
import feedbackReducer from "./features/feedback";
import ProductReducer from "./features/productSlice";
import MpesaReducer from "./features/mpesa";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
// import cartReducer from "./features/cartSlice";
// import messageReducer from "./features/Message";
// import helpReducer from "./features/HelpSlice";
// import answerReducer from "./features/answerSlice";
const rootReducer = combineReducers({
  user: userReducer,
  auth: AuthReducer,
  todosState: todosReducer,
  todos: commentReducer,
  invoice: invoiceReducer,
  todos: quizReducer,
  todos: feedbackReducer,
  project: ProductReducer,
  mpesa: MpesaReducer,
  // cart:cartReducer,
  // message:messageReducer,
  // help:helpReducer,
  // answer:answerReducer,
});
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  
  export const persistor = persistStore(store);
