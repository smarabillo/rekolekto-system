import { Router } from "express";
import {
  create,
  login,
  getAll,
  getOne,
  update,
  remove,
  getRankings,
  verifyOwnStudent,
  verifyStudentToken,
} from "../controllers/StudentController.js";

const router = Router();

router.get("/rankings", getRankings);
router.post("/", create);
router.post("/login", login);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);
router.get("/verify/own", verifyOwnStudent);
router.get("/verify/token", verifyStudentToken);

export default router;
