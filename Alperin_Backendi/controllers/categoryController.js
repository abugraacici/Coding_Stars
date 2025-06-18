const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Kategori adı gerekli' });
        }

        const exists = await Category.findOne({ name });
        if (exists) {
            return res.status(400).json({ error: 'Bu kategori zaten mevcut' });
        }

        const newCategory = await Category.create({ name });
        res.status(201).json({
            message: 'Kategori oluşturuldu',
            category: newCategory,
        });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().select('name _id');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    const { id, name } = req.body;
    try {
        const updated = await Category.findByIdAndUpdate(id, { name });
        if (!updated) {
            return res.status(404).json({ error: 'Kategori güncellendi' });
        }

        res.json({ message: 'Kategori silindi' });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Kategori bulunamadı' });
        }

        res.json({ message: 'Kategori silindi' });
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
