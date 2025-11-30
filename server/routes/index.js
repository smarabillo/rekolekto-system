import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import studentRoutes from "./studentRoutes.js";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/student", studentRoutes);

export default router;
