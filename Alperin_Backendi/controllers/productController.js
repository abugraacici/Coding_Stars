const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({
            sellerId: { $ne: req.userId },
        }).sort({ createdAt: -1 });

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Ürünler getirilemedi' });
    }
};

exports.getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Ürün bulunamadı.' });
        }
        const isOwner = req.userId?.toString() === product.sellerId.toString();

        res.status(200).json({
            success: true,
            data: {
                ...product._doc,
                isOwner,
            },
        });
    } catch (err) {
        res.status(500).json({ error: 'Ürün getirilirken bir hata oluştu.' });
    }
};
