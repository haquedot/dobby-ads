import api from "./client.js";

export const createFolder = (payload) => api.post("/api/folders", payload);
export const getRootFolders = () => api.get("/api/folders/root");
export const getFolder = (id) => api.get(`/api/folders/${id}`);
export const getChildren = (id) => api.get(`/api/folders/${id}/children`);
export const renameFolder = (id, payload) => api.put(`/api/folders/${id}`, payload);
export const deleteFolder = (id) => api.delete(`/api/folders/${id}`);
