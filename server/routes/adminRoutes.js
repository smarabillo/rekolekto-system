import { Router } from "express";
import {
  create,
  login,
  getAll,
  getOne,
  update,
  remove,
  verifyToken,
} from "../controllers/AdminController.js";

const router = Router();

router.post("/", create);
router.post("/login", login);

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getOne);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, remove);

export default router;
