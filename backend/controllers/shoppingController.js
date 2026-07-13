const ShoppingItem = require("../models/ShoppingItem");
const { buildSuggestions } = require("../utils/suggestions");

let memoryItems = [];
let nextId = 1;

const normalizeItem = (body) => ({
    _id: body._id || String(nextId++),
    name: body.name || "Untitled item",
    quantity: Number(body.quantity || 1),
    unit: body.unit || "pcs",
    category: body.category || "Others",
    brand: body.brand || "",
    size: body.size || "",
    price: body.price || 0,
    notes: body.notes || "",
    completed: Boolean(body.completed),
    createdAt: body.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
});

const getItems = async (req, res) => {
    try {
        if (process.env.MONGO_URI) {
            const items = await ShoppingItem.find().sort({ createdAt: -1 });
            return res.json(items);
        }

        return res.json(memoryItems.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch items." });
    }
};

const addItem = async (req, res) => {
    try {
        const { name, quantity, category, unit, completed, brand, size, price, notes } = req.body;

        if (process.env.MONGO_URI) {
            const item = await ShoppingItem.create({ name, quantity, category, unit, completed, brand, size, price, notes });
            return res.status(201).json(item);
        }

        const item = normalizeItem({ name, quantity, category, unit, completed, brand, size, price, notes });
        memoryItems = [item, ...memoryItems];
        return res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: "Unable to add item." });
    }
};

const deleteItem = async (req, res) => {
    try {
        if (process.env.MONGO_URI) {
            await ShoppingItem.findByIdAndDelete(req.params.id);
            return res.json({ message: "Item deleted." });
        }

        memoryItems = memoryItems.filter((item) => item._id !== req.params.id);
        return res.json({ message: "Item deleted." });
    } catch (error) {
        res.status(500).json({ message: "Unable to delete item." });
    }
};

const updateItem = async (req, res) => {
    try {
        if (process.env.MONGO_URI) {
            const item = await ShoppingItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.json({ success: true, message: "Item updated successfully", data: item });
        }

        memoryItems = memoryItems.map((item) => item._id === req.params.id ? { ...item, ...req.body, updatedAt: new Date().toISOString() } : item);
        const updatedItem = memoryItems.find((item) => item._id === req.params.id);
        return res.json({ success: true, message: "Item updated successfully", data: updatedItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSuggestions = async (req, res) => {
    try {
        if (process.env.MONGO_URI) {
            const items = await ShoppingItem.find().sort({ createdAt: -1 });
            return res.json(buildSuggestions(items));
        }

        return res.json(buildSuggestions(memoryItems));
    } catch (error) {
        res.status(500).json({ message: "Unable to get suggestions." });
    }
};

module.exports = {
    getItems,
    addItem,
    deleteItem,
    updateItem,
    getSuggestions
};