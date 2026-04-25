const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    // NEW FIELD: Category
    category: {
        type: String,
        required: false,
        default: 'Uncategorized',
        trim: true
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Item', ItemSchema);