import axios from "axios";

const API = axios.create({
  baseURL: 'http://137.184.9.57/api/',
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;

  
});
export const googleSignIn = (result) => API.post("/users/google-signin", result);

export const signIn = (formData) => API.post("/users/signin", formData);
export const signUp = (formData) => API.post("/users/signup", formData);
export const createTour = (formData) => API.post("/products", formData);
export const createMpesa = (formData) => API.post("/mpesa/stkPush", formData);
export const createInvoice = (formData) => API.post("/invoice", formData);
export const createMessage = (formData) => API.post("/scripts", formData);
export const createHelp = (formData) => API.post("/orders", formData);
export const createAnswer = (formData) => API.post("/answer", formData);
export const deleteTour = (id) => API.delete(`/products/delete-user-content/${id}`);
export const updateSeller = (form, id) =>
  API.patch(`users/update-seller/${id}`, form);

  export const updateProducts = (form, id) =>
  API.patch(`users/update-seller/${id}`, form);
  export const updateBought = (form, id) =>
  API.patch(`products/update-bought/${id}`, form);
  export const updateReview = (form, id) =>
  API.put(`products/rate/${id}`, form);