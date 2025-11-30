import db from "../models/index.js";
import { hash as _hash, compare } from "bcrypt";

const { Admins: Admin } = db;

export async function create(req, res) {
  try {
    const { userName, password, firstName, lastName } = req.body;
    const hash = await _hash(password, 10);
    const admin = await Admin.create({
      userName,
      password: hash,
      firstName,
      lastName,
    });
    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { userName, password } = req.body;
    const admin = await Admin.findOne({ where: { userName } });
    if (!admin) return res.status(404).json({ error: "User not found" });
    const match = await compare(password, admin.password);
    if (!match) return res.status(401).json({ error: "Wrong password" });
    res.json({ message: "Login successful", admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAll(req, res) {
  try {
    const admins = await Admin.findAll();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).json({ error: "Not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;
    const { userName, firstName, lastName, password } = req.body;
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).json({ error: "Not found" });
    let updatedPassword = admin.password;
    if (password) updatedPassword = await _hash(password, 10);
    await admin.update({
      userName,
      firstName,
      lastName,
      password: updatedPassword,
    });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).json({ error: "Not found" });
    await admin.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
