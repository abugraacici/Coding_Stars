const User = require('../models/User');

exports.getSearchHistory = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('searchHistory');
        if (!user)
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

        res.json({ searchHistory: user.searchHistory || [] });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.addSearchHistory = async (req, res) => {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
        return res
            .status(400)
            .json({ error: 'Geçerli bir arama sorgusu girin' });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

        user.searchHistory = user.searchHistory.filter(
            (item) => item !== query
        );

        user.searchHistory.unshift(query);

        if (user.searchHistory.length > 10) {
            user.searchHistory = user.searchHistory.slice(0, 10);
        }

        await user.save();

        res.json({ success: true, searchHistory: user.searchHistory });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.clearSearchHistory = async (req, res) => {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
        return res
            .status(400)
            .json({ error: 'Silinecek sorgu belirtilmedi veya geçersiz.' });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

        user.searchHistory = user.searchHistory.filter(
            (item) => item !== query
        );

        await user.save();

        res.json({ success: true, searchHistory: user.searchHistory });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};
