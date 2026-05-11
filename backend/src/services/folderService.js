import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Folder from "../models/Folder.js";
import Image from "../models/Image.js";
import { buildFolderPath, ensureNoRootName } from "../utils/buildFolderPath.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

export const getFolderById = async (folderId, userId) => {
  const folder = await Folder.findOne({ _id: folderId, userId });
  if (!folder) {
    const error = new Error("Folder not found");
    error.statusCode = 404;
    throw error;
  }
  return folder;
};

export const updateAncestorSizes = async (folderId, userId, delta) => {
  let currentId = folderId;
  while (currentId) {
    const folder = await Folder.findOneAndUpdate(
      { _id: currentId, userId },
      { $inc: { totalSize: delta } },
      { new: true }
    );
    currentId = folder?.parentFolderId || null;
  }
};

export const createFolder = async ({ name, parentFolderId, userId }) => {
  const safeName = ensureNoRootName(name);

  let parentFolder = null;
  let parentPath = "/";

  if (parentFolderId) {
    parentFolder = await getFolderById(parentFolderId, userId);
    parentPath = parentFolder.path;
  }

  const pathValue = buildFolderPath(parentPath, safeName);

  const folder = await Folder.create({
    name: safeName,
    userId,
    parentFolderId: parentFolderId || null,
    path: pathValue,
    totalSize: 0,
  });

  return folder;
};

export const renameFolder = async ({ folderId, name, userId }) => {
  const folder = await getFolderById(folderId, userId);
  const safeName = ensureNoRootName(name);
  const oldPath = folder.path;
  const parentPath = folder.parentFolderId
    ? (await getFolderById(folder.parentFolderId, userId)).path
    : "/";
  const newPath = buildFolderPath(parentPath, safeName);

  folder.name = safeName;
  folder.path = newPath;
  await folder.save();

  const descendants = await Folder.find({
    userId,
    path: { $regex: `^${oldPath}/` },
  });

  for (const child of descendants) {
    child.path = child.path.replace(oldPath, newPath);
    await child.save();
  }

  return folder;
};

export const deleteFolderRecursive = async ({ folderId, userId }) => {
  const rootFolder = await getFolderById(folderId, userId);
  const folderIds = [rootFolder._id];
  const queue = [rootFolder._id];

  while (queue.length) {
    const current = queue.shift();
    const children = await Folder.find({ parentFolderId: current, userId }).select(
      "_id"
    );
    for (const child of children) {
      folderIds.push(child._id);
      queue.push(child._id);
    }
  }

  const images = await Image.find({ userId, folderId: { $in: folderIds } });

  for (const image of images) {
    const filePath = path.join(uploadDir, image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await Image.deleteMany({ userId, folderId: { $in: folderIds } });
  await Folder.deleteMany({ userId, _id: { $in: folderIds } });

  if (rootFolder.parentFolderId) {
    await updateAncestorSizes(rootFolder.parentFolderId, userId, -rootFolder.totalSize);
  }
};
