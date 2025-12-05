import db from "../models/index.js";
import jwt from "jsonwebtoken";
import { hash as _hash, compare } from "bcrypt";

const { Admins: Admin } = db;

// JWT secret - store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

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
    
    // Remove password from response
    const adminData = admin.toJSON();
    delete adminData.password;
    
    res.status(201).json(adminData);
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
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        userName: admin.userName,
        role: "admin" 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Remove password from response
    const adminData = admin.toJSON();
    delete adminData.password;
    
    res.json({ 
      message: "Login successful", 
      token,
      admin: adminData 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAll(req, res) {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
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
    
    // Remove password from response
    const adminData = admin.toJSON();
    delete adminData.password;
    
    res.json(adminData);
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

// Middleware to verify JWT token
export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}