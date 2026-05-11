import asyncHandler from "../middleware/asyncHandler.js";
import Image from "../models/Image.js";
import { getFolderById, updateAncestorSizes } from "../services/folderService.js";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = asyncHandler(async (req, res) => {
  const { folderId } = req.body;
  if (!folderId) {
    return res.status(400).json({ success: false, message: "folderId required" });
  }

  await getFolderById(folderId, req.user.id);

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image required" });
  }

  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `dobby-ads/${req.user.id}/${folderId}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );

    stream.end(req.file.buffer);
  });

  const image = await Image.create({
    name: req.file.originalname,
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
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

  if (image.publicId) {
    await cloudinary.uploader.destroy(image.publicId, { resource_type: "image" });
  }

  await image.deleteOne();
  res.json({ success: true, message: "Image deleted" });
});

export const downloadImage = asyncHandler(async (req, res) => {
  const image = await Image.findOne({ _id: req.params.id, userId: req.user.id });
  if (!image) {
    return res.status(404).json({ success: false, message: "Image not found" });
  }

  if (!image.url) {
    return res.status(404).json({ success: false, message: "Image URL not found" });
  }

  res.redirect(image.url);
});
