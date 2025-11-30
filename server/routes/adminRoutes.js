import { Router } from "express";
import {
  create,
  login,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/AdminController.js";

const router = Router();

// Create admin
router.post("/", create);

// Login
router.post("/login", login);

// Get all admins
router.get("/", getAll);

// Get one admin
router.get("/:id", getOne);

// Update admin
router.put("/:id", update);

// Delete admin
router.delete("/:id", remove);

export default router;
