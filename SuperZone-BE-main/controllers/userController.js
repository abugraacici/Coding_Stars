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

exports.updateFullname = async (req, res) => {
    const { fullname } = req.body;

    if (!fullname || fullname.trim() === '') {
        return res.status(400).json({ error: 'Ad soyad boş olamaz' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { fullname },
            { new: true }
        ).select('fullname');

        if (!updatedUser) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        res.json({
            message: 'Ad soyad güncellendi',
            fullname: updatedUser.fullname,
        });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

exports.updateEmail = async (req, res) => {
    const { newEmail, currentPassword } = req.body;

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Şifre yanlış' });
        }

        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: 'Bu email zaten kullanılıyor' });
        }

        user.email = newEmail;
        await user.save();

        res.json({ message: 'Email başarıyla güncellendi' });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.updatePhoneNumber = async (req, res) => {
    const { newPhoneNumber, currentPassword } = req.body;

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Şifre yanlış' });
        }

        user.phoneNumber = newPhoneNumber;
        await user.save();

        res.json({ message: 'Telefon numarası başarıyla güncellendi' });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Mevcut şifre yanlış' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Şifre başarıyla güncellendi' });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.userId,
            { isDeleted: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        res.json({ message: 'Hesap başarıyla silindi.' });
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

exports.getUserFullnameAndPhoneNumber = async (req, res) => {
    const userId = req.userId;
    const searchedUserId = req.query.searchedUserId;

    if (!searchedUserId) {
        return res
            .status(400)
            .json({ error: 'searchedUserId parametresi gerekli' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        const searchedUser = await User.findById(searchedUserId);
        if (!searchedUser) {
            return res
                .status(404)
                .json({ error: 'Aranan kullanıcı bulunamadı' });
        }

        res.status(200).json({
            success: true,
            fullname: searchedUser.fullname,
            phoneNumber: searchedUser.phoneNumber,
        });
    } catch (error) {
        console.error('Kullanıcı adı getirilemedi:', error);
        res.status(500).json({
            success: false,
            error: 'Kullanıcı adı getirilemedi.',
        });
    }
};
