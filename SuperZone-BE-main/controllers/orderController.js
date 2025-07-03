const Order = require('../models/Order');

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId }).sort({
            createdAt: -1,
        });
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Siparişler getirilirken bir hata oluştu.',
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!order)
            return res.status(404).json({ error: 'Sipariş bulunamadı.' });

        res.status(200).json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Sipariş detayı alınamadı.',
        });
    }
};
