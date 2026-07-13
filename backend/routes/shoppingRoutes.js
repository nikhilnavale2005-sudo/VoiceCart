const express = require("express");

const router = express.Router();

const {
    getItems,
    addItem,
    deleteItem,
    updateItem,
    getSuggestions
} = require("../controllers/shoppingController");

router.get("/suggestions", getSuggestions);
router.get("/", getItems);
router.post("/", addItem);
router.delete("/:id", deleteItem);
router.put("/:id", updateItem);

module.exports = router;