import db from "../models/index.js";

const { Items: Item } = db;

export async function create(req, res) {
  try {
    const { barcode, product_name, material_type, size } = req.body;
    let finalSize = size;
    let finalPoints = 0;
    if (material_type === "CAN") {
      finalSize = null;
      finalPoints = 5;
    } else if (material_type === "PET") {
      if (!size) {
        return res.status(400).json({ error: "Size is required for PET" });
      }
      if (size !== "SMALL" && size !== "LARGE") {
        return res.status(400).json({ error: "Size must be Small or Large" });
      }
      finalPoints = size === "SMALL" ? 3 : 4;
    } else {
      return res.status(400).json({ error: "Invalid material type" });
    }
    const item = await Item.create({
      barcode,
      product_name,
      material_type,
      size: finalSize,
      points: finalPoints,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAll(req, res) {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;
    let { barcode, product_name, material_type, size } = req.body;
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: "Not found" });
    }
    let points;
    if (material_type === "CAN") {
      points = 5;
      size = null;
    } else if (material_type === "PET") {
      if (size !== "SMALL" && size !== "LARGE") {
        return res.status(400).json({
          error: "For PET, size must be SMALL or LARGE",
        });
      }
      points = size === "SMALL" ? 3 : 4;
    } else {
      return res.status(400).json({
        error: "material_type must be CAN or PET",
      });
    }
    await item.update({
      barcode,
      product_name,
      material_type,
      size,
      points,
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: "Not found" });
    await item.destroy();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
