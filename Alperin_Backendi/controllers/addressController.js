const User = require('../models/User');

exports.addAddress = async (req, res) => {
    const { label, city, district, description } = req.body;

    if (!label || !city || !district) {
        return res
            .status(400)
            .json({ error: 'Adres adı, şehir ve ilçe gerekli' });
    }
    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

        const newAddress = { label, city, district, description };

        if (user.addresses.length === 0) {
            newAddress.isSelected = true;
        }

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({ success: true, addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.deleteAddress = async (req, res) => {
    const { addressId } = req.params;

    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

        user.addresses = user.addresses.filter(
            (address) => address._id.toString() !== addressId
        );

        await user.save();
        res.json({ success: true, addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.selectAddress = async (req, res) => {
    const { addressId } = req.params;

    try {
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

        const addressExists = user.addresses.some(
            (addr) => addr._id.toString() === addressId
        );
        if (!addressExists)
            return res.status(404).json({ error: 'Adres bulunamadı' });

        user.addresses.forEach((addr) => {
            addr.isSelected = addr._id.toString() === addressId;
        });

        await user.save();
        res.json({ success: true, addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('addresses');
        if (!user)
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

        res.json({ addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.updateAddress = async (req, res) => {
    const userId = req.userId;
    const { addressId, addressData } = req.body;

    try {
        const user = await User.findOne({ _id: userId, isDeleted: false });
        if (!user)
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

        const address = user.addresses.id(addressId);
        if (!address)
            return res.status(404).json({ error: 'Adres bulunamadı' });

        Object.assign(address, addressData);
        await user.save();

        res.json({ message: 'Adres güncellendi', address });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};
