import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  downloadImage,
  getByFolder,
  removeImage,
  uploadImage,
} from "../controllers/imageController.js";

const router = Router();

router.use(auth);

router.post("/upload", upload.single("image"), uploadImage);
router.get("/folder/:folderId", getByFolder);
router.delete("/:id", removeImage);
router.get("/download/:id", downloadImage);

export default router;
