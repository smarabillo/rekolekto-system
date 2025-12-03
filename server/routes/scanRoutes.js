import express from "express";
import { scanItem, getScans, getScan } from "../controllers/ScanController.js";

const router = express.Router();

router.post("/", scanItem);
router.get("/", getScans);
router.get("/:id", getScan);

export default router;
