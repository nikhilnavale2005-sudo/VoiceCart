const mongoose = require("mongoose");

const shoppingItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Item name is required"],
            trim: true
        },

        quantity: {
            type: Number,
            default: 1,
            min: 1
        },

        unit: {
            type: String,
            default: "pcs"
        },

        category: {
            type: String,
            default: "Others"
        },

        brand: {
            type: String,
            default: ""
        },

        size: {
            type: String,
            default: ""
        },

        price: {
            type: Number,
            default: 0
        },

        notes: {
            type: String,
            default: ""
        },

        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("ShoppingItem", shoppingItemSchema);