import api from "./client.js";

export const registerUser = (payload) => api.post("/api/auth/register", payload);
export const loginUser = (payload) => api.post("/api/auth/login", payload);
export const logoutUser = () => api.post("/api/auth/logout");
export const fetchMe = () => api.get("/api/auth/me");
