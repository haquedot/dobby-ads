import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentFolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    path: { type: String, required: true },
    totalSize: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

folderSchema.index({ userId: 1, parentFolderId: 1 });
folderSchema.index({ userId: 1, path: 1 });

export default mongoose.model("Folder", folderSchema);
