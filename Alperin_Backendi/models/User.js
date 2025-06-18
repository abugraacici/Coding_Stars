const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    label: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    description: { type: String },
    isSelected: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
    {
        fullname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phoneNumber: { type: String, require: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['customer', 'seller', 'admin'],
            default: 'customer',
        },
        searchHistory: {
            type: [String],
            default: [],
        },
        addresses: [addressSchema],
        isDeleted: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        otp: { type: String },
        otpExpiresAt: { type: Date },
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        cart: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
