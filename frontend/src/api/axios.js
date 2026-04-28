// src/api/axios.js
import axios from "axios";
import { store } from "../redux/store";
import { startGlobalLoading, stopGlobalLoading } from "../redux/uiSlice";

const api = axios.create({
  // baseURL: "http://localhost:8000/api",
 baseURL:"https://avieats-backend.onrender.com/api",
  withCredentials: true,
});

const shouldHandleGlobalLoading = (config) => !config?.skipGlobalLoading;

// 🔹 Request interceptor
api.interceptors.request.use(
  (config) => {
    if (shouldHandleGlobalLoading(config)) {
      store.dispatch(startGlobalLoading());
    }
    return config;
  },
  (error) => {
    if (shouldHandleGlobalLoading(error?.config)) {
      store.dispatch(stopGlobalLoading());
    }
    return Promise.reject(error);
  }
);

// 🔹 Response interceptor
api.interceptors.response.use(
  (response) => {
    if (shouldHandleGlobalLoading(response?.config)) {
      store.dispatch(stopGlobalLoading());
    }
    return response;
  },
  (error) => {
    if (shouldHandleGlobalLoading(error?.config)) {
      store.dispatch(stopGlobalLoading());
    }
    return Promise.reject(error);
  }
);

export default api;
