import { Router } from "express";
import {
  create,
  login,
  getAll,
  getOne,
  update,
  remove,
  verifyOwnStudent,
  verifyStudentToken,
} from "../controllers/StudentController.js";

const router = Router();

router.post("/", create);
router.post("/login", login);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
