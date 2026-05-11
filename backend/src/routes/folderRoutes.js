import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  create,
  getById,
  getChildren,
  getRoot,
  remove,
  update,
} from "../controllers/folderController.js";

const router = Router();

router.use(auth);

router.post("/", create);
router.get("/root", getRoot);
router.get("/:id", getById);
router.get("/:id/children", getChildren);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
