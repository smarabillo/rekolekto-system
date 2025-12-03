import db from "../models/index.js";
const { Students, Items, Scans } = db;

export const scanItem = async (req, res) => {
  try {
    const { studentId, barcode } = req.body;
    if (!studentId || !barcode) {
      return res.status(400).json({ error: "studentId and barcode required" });
    }
    // Convert studentId to string
    const studentIdStr = String(studentId);
    // find student by studentId column
    const student = await Students.findOne({
      where: { studentId: studentIdStr },
    });
    if (!student) return res.status(404).json({ error: "Student not found" });
    // find item by barcode
    const item = await Items.findOne({ where: { barcode } });
    if (!item) return res.status(404).json({ error: "Item not found" });
    // Check material_type exists
    if (!item.material_type) {
      return res.status(400).json({
        error: "Item missing material_type",
      });
    }
    // Only check size if material_type is PET
    if (item.material_type === "PET" && !item.size) {
      return res.status(400).json({
        error: "PET items must have a size",
      });
    }
    // compute points
    const points = item.points || 1;
    // save scan record (size can be null for CANs)
    const scan = await Scans.create({
      user_id: student.id,
      barcode,
      material_detected: item.material_type,
      size: item.size, 
      points_earned: points,
    });
    return res.json({
      message: "Scan recorded",
      scanId: scan.id,
      material_type: item.material_type,
      size: item.size,
      points,
      studentName: `${student.firstName} ${student.lastName}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getScans = async (req, res) => {
  try {
    const scans = await Scans.findAll({ include: [Students] });
    return res.json(scans);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getScan = async (req, res) => {
  try {
    const { id } = req.params;
    const scan = await Scans.findByPk(id, { include: [Students] });
    if (!scan) return res.status(404).json({ error: "Scan not found" });
    return res.json(scan);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
