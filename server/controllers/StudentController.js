import db from "../models/index.js";
import jwt from "jsonwebtoken";
import { hash as _hash, compare } from "bcrypt";

const { Students: Student } = db;

// JWT secret - store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

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

    // Remove password from response
    const studentData = student.toJSON();
    delete studentData.password;

    res.status(201).json(studentData);
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

    // Generate JWT token
    const token = jwt.sign(
      {
        id: student.id,
        studentId: student.studentId,
        role: "student",
        grade: student.grade,
        section: student.section,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password from response
    const studentData = student.toJSON();
    delete studentData.password;

    res.json({
      message: "Login successful",
      token,
      student: studentData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all
export async function getAll(req, res) {
  try {
    const students = await Student.findAll({
      attributes: { exclude: ["password"] },
    });
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
      attributes: { exclude: ["password"] },
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

    // Remove password from response
    const studentData = student.toJSON();
    delete studentData.password;

    res.json(studentData);
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

// Middleware to verify JWT token for students
export function verifyStudentToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure the token is for a student
    if (decoded.role !== "student") {
      return res
        .status(403)
        .json({ error: "Access denied. Student role required." });
    }

    req.student = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Middleware to verify token is for the same student (for self-access routes)
export function verifyOwnStudent(req, res, next) {
  const { id } = req.params;

  // Check if the student is accessing their own data
  if (req.student.id !== parseInt(id)) {
    return res
      .status(403)
      .json({ error: "Access denied. You can only access your own data." });
  }

  next();
}
