const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    // General Product Information
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true // Ensures no two products have the exact same name
    },
    type:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // Pricing and Categories
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Woolen Blossoms', 'Keychains', 'Accessories', 'Home Decor']
    },
    imageUrls: { // Use an array for multiple product photos
        type: [String],
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    isAvailableForCustomOrder: {
        type: Boolean,
        default: false
    },
    materialUsed: {
        type: String
    }
}, { timestamps: true }); // Includes createdAt and updatedAt

module.exports = mongoose.model('Product', ProductSchema);
