import db from "../models/index.js";

const { Items: Item } = db;

export async function create(req, res) {
  try {
    const { barcode, product_name, material_type, size, points } = req.body;
    const item = await Item.create({
      barcode,
      product_name,
      material_type,
      size,
      points,
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
    const { barcode, product_name, material_type, size, points } = req.body;
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: "Not found" });
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