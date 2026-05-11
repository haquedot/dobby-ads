import asyncHandler from "../middleware/asyncHandler.js";
import Folder from "../models/Folder.js";
import {
  createFolder,
  deleteFolderRecursive,
  getFolderById,
  renameFolder,
} from "../services/folderService.js";

export const create = asyncHandler(async (req, res) => {
  const { name, parentFolderId } = req.body;
  const folder = await createFolder({ name, parentFolderId, userId: req.user.id });
  res.status(201).json({ success: true, message: "Folder created", data: { folder } });
});

export const getRoot = asyncHandler(async (req, res) => {
  const folders = await Folder.find({ userId: req.user.id, parentFolderId: null }).sort(
    "name"
  );
  res.json({ success: true, message: "OK", data: { folders } });
});

export const getById = asyncHandler(async (req, res) => {
  const folder = await getFolderById(req.params.id, req.user.id);
  res.json({ success: true, message: "OK", data: { folder } });
});

export const getChildren = asyncHandler(async (req, res) => {
  await getFolderById(req.params.id, req.user.id);
  const folders = await Folder.find({
    userId: req.user.id,
    parentFolderId: req.params.id,
  }).sort("name");
  res.json({ success: true, message: "OK", data: { folders } });
});

export const update = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const folder = await renameFolder({ folderId: req.params.id, name, userId: req.user.id });
  res.json({ success: true, message: "Folder renamed", data: { folder } });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteFolderRecursive({ folderId: req.params.id, userId: req.user.id });
  res.json({ success: true, message: "Folder deleted" });
});
