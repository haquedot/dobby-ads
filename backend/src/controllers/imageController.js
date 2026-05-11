import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import asyncHandler from "../middleware/asyncHandler.js";
import Image from "../models/Image.js";
import { getFolderById, updateAncestorSizes } from "../services/folderService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

export const uploadImage = asyncHandler(async (req, res) => {
  const { folderId } = req.body;
  if (!folderId) {
    return res.status(400).json({ success: false, message: "folderId required" });
  }

  await getFolderById(folderId, req.user.id);

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image required" });
  }

  const image = await Image.create({
    name: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
    folderId,
    userId: req.user.id,
  });

  await updateAncestorSizes(folderId, req.user.id, req.file.size);

  res.status(201).json({ success: true, message: "Image uploaded", data: { image } });
});

export const getByFolder = asyncHandler(async (req, res) => {
  await getFolderById(req.params.folderId, req.user.id);
  const images = await Image.find({
    userId: req.user.id,
    folderId: req.params.folderId,
  }).sort("-uploadedAt");
  res.json({ success: true, message: "OK", data: { images } });
});

export const removeImage = asyncHandler(async (req, res) => {
  const image = await Image.findOne({ _id: req.params.id, userId: req.user.id });
  if (!image) {
    return res.status(404).json({ success: false, message: "Image not found" });
  }

  await updateAncestorSizes(image.folderId, req.user.id, -image.size);

  const filePath = path.join(uploadDir, image.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await image.deleteOne();
  res.json({ success: true, message: "Image deleted" });
});

export const downloadImage = asyncHandler(async (req, res) => {
  const image = await Image.findOne({ _id: req.params.id, userId: req.user.id });
  if (!image) {
    return res.status(404).json({ success: false, message: "Image not found" });
  }

  const filePath = path.join(uploadDir, image.filename);
  res.download(filePath, image.name);
});
