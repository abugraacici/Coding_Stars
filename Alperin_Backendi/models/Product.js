const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        sellerCity: { type: String, required: true },
        stock: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
