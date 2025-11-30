import db from "../models/index.js";
import { hash as _hash, compare } from "bcrypt";

const { Students: Student } = db;

// Create
export async function create(req, res) {
  try {
    const { studentId, password, firstName, lastName, grade, section } =
      req.body;
    const hash = await _hash(password, 10);
    const student = await Student.create({
      studentId,
      password: hash,
      firstName,
      lastName,
      grade,
      section,
    });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Login
export async function login(req, res) {
  try {
    const { studentId, password } = req.body;
    const student = await Student.findOne({ where: { studentId } });
    if (!student) {
      return res.status(404).json({ error: "User not found" });
    }
    const match = await compare(password, student.password);
    if (!match) {
      return res.status(401).json({ error: "Wrong password" });
    }
    res.json({ message: "Login successful", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all
export async function getAll(req, res) {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get one
export async function getOne(req, res) {
  try {
    const { id } = req.params;
    const student = await Student.findOne({
      where: { studentId: id },
    });
    if (!student) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update
export async function update(req, res) {
  try {
    const { id } = req.params;
    const { studentId, password, firstName, lastName, grade, section } =
      req.body;
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ error: "Not found" });
    let updatedPassword = student.password;
    if (password) updatedPassword = await _hash(password, 10);
    await student.update({
      studentId,
      password: updatedPassword,
      firstName,
      lastName,
      grade,
      section,
    });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete
export async function remove(req, res) {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ error: "Not found" });
    await student.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
