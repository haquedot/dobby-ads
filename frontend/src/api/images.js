import api from "./client.js";

export const uploadImage = (payload) =>
  api.post("/api/images/upload", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getImagesByFolder = (folderId) => api.get(`/api/images/folder/${folderId}`);
export const deleteImage = (id) => api.delete(`/api/images/${id}`);
export const downloadImage = (id) => api.get(`/api/images/download/${id}`);
