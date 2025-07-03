const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        address: {
            city: { type: String, required: true },
            district: { type: String, required: true },
            description: { type: String, required: true },
        },
        cardInfo: {
            cardHolder: { type: String, required: true },
            last4: { type: String, required: true },
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        items: [
            {
                productId: String,
                name: String,
                image: String,
                price: Number,
                quantity: Number,
                sellerCity: String,
                deliveryStatus: {
                    type: String,
                    enum: [
                        'Hazırlanıyor',
                        'Kargoya Verildi',
                        'Yolda',
                        'Teslim Edildi',
                    ],
                    default: 'Hazırlanıyor',
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
