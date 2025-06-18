const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select(
            'fullname addresses role'
        );
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }
        const selectedLocation = user.addresses.find((addr) => addr.isSelected);
        res.json({
            fullname: user.fullname,
            selectedLocation,
            role: user.role,
        });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

exports.getFullUserData = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.getCart = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).populate('cart.product');
        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Sepet getirilemedi.' });
    }
};

exports.addOrUpdateCartItem = async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.userId;

    try {
        const user = await User.findById(userId);

        const existingItem = user.cart.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Sepet güncellenirken hata oluştu.',
        });
    }
};

exports.removeCartItem = async (req, res) => {
    const { productId } = req.params;
    const userId = req.userId;

    try {
        await User.findByIdAndUpdate(userId, {
            $pull: { cart: { product: productId } },
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Sepetten silinemedi.' });
    }
};

exports.addToFavorites = async (req, res) => {
    const { productId } = req.params;

    try {
        const user = await User.findById(req.userId);

        if (!user.favorites.includes(productId)) {
            user.favorites.push(productId);
            await user.save();
        }

        res.status(200).json({ message: 'Ürün favorilere eklendi.' });
    } catch (err) {
        res.status(500).json({ error: 'Favorilere ekleme işlemi başarısız.' });
    }
};

exports.removeFromFavorites = async (req, res) => {
    const { productId } = req.params;

    try {
        const user = await User.findById(req.userId);

        user.favorites = user.favorites.filter(
            (favId) => favId.toString() !== productId
        );

        await user.save();

        res.status(200).json({ message: 'Ürün favorilerden kaldırıldı.' });
    } catch (err) {
        res.status(500).json({
            error: 'Favorilerden çıkarma işlemi başarısız.',
        });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('favorites');
        res.status(200).json({ favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ error: 'Favoriler alınamadı.' });
    }
};
