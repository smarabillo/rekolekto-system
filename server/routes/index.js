import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import studentRoutes from "./studentRoutes.js";
import itemRoutes from "./itemRoutes.js";
import scanRoutes from "./scanRoutes.js";

const router = Router();

router.use("/admins", adminRoutes);
router.use("/students", studentRoutes);
router.use("/items", itemRoutes);
router.use("/scans", scanRoutes);

export default router;
