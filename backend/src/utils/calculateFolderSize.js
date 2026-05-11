import Folder from "../models/Folder.js";
import Image from "../models/Image.js";

const getDescendantFolderIds = async (rootId, userId) => {
  const ids = [rootId];
  const queue = [rootId];

  while (queue.length) {
    const current = queue.shift();
    const children = await Folder.find({ parentFolderId: current, userId }).select(
      "_id"
    );
    for (const child of children) {
      ids.push(child._id);
      queue.push(child._id);
    }
  }

  return ids;
};

const calculateFolderSize = async (folderId, userId) => {
  const folderIds = await getDescendantFolderIds(folderId, userId);
  const results = await Image.aggregate([
    { $match: { userId, folderId: { $in: folderIds } } },
    { $group: { _id: null, total: { $sum: "$size" } } },
  ]);

  return results[0]?.total || 0;
};

export default calculateFolderSize;
