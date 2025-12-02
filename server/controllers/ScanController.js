import { Students, Items, Scan } from "../models/index.js";

export const scanItem = async (req, res) => {
  try {
    const { studentId, barcode } = req.body;

    if (!studentId || !barcode) {
      return res.status(400).json({ error: "studentId and barcode required" });
    }

    // 1. find student
    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    // 2. find item by barcode
    const item = await Item.findOne({ where: { barcode } });
    if (!item) return res.status(404).json({ error: "Item not found" });

    // 3. compute points (simple)
    const points = item.default_points || 1;

    // 4. save scan record
    const scan = await Scan.create({
      studentId,
      itemId: item.id,
      barcode,
      points
    });

    // 5. update student balance
    student.points_balance += points;
    await student.save();

    return res.json({
      message: "Scan recorded",
      scanId: scan.id,
      points,
      newBalance: student.points_balance
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
