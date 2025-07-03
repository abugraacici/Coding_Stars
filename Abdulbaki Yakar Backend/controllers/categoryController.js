const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().select('name _id');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.getCategoryNameById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Kategori bulunamadı' });
        }
        res.json({ name: category.name });
    } catch (err) {
        res.status(500).json({ error: 'Kategori getirilemedi' });
    }
};
