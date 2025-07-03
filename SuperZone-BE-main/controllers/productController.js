const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
    const { name, description, image, price, category, stock, sellerCity } =
        req.body;

    try {
        const product = await Product.create({
            name,
            description,
            image,
            price,
            category,
            stock,
            sellerId: req.userId,
            sellerCity,
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Ürün eklenemedi', detail: err.message });
    }
};

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

exports.getProductsBySeller = async (req, res) => {
    try {
        const sellerId = req.userId;
        const products = await Product.find({ sellerId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Ürünler getirilemedi' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }

        if (product.sellerId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Yetkisiz işlem' });
        }

        Object.assign(product, req.body);
        await product.save();

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Ürün güncellenemedi' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }

        if (product.sellerId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Yetkisiz işlem' });
        }

        await product.deleteOne();
        res.json({ message: 'Ürün silindi' });
    } catch (err) {
        res.status(500).json({ error: 'Ürün silinemedi' });
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
