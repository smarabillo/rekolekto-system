import express from "express";
import { scanItem } from "../controllers/scanController.js";

const router = express.Router();

router.post("/", scanItem);

export default router;
