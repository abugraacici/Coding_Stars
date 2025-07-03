const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/emailService');

exports.register = async (req, res) => {
    const { fullname, phoneNumber, email, password } = req.body;

    try {
        const exists = await User.findOne({ email });
        if (exists && !exists.isDeleted) {
            return res.status(400).json({ error: 'Bu email zaten kayıtlı.' });
        }

        if (exists && exists.isDeleted) {
            await User.deleteOne({ _id: exists._id });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

        const user = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            otp,
            otpExpiresAt,
        });

        await sendOTPEmail(email, otp);

        res.status(201).json({
            message: 'OTP gönderildi. Lütfen doğrulayın.',
            userId: user._id,
        });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.isDeleted) {
            return res
                .status(400)
                .json({ error: 'E-posta adresine kayıtlı hesap bulunamadı.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ error: 'Geçersiz e-posta veya şifre' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({
            token,
            fullname: user.fullname,
        });
    } catch (err) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({ email });
        if (!user || user.isDeleted) {
            return res
                .status(400)
                .json({ error: 'E-posta adresine kayıtlı hesap bulunamadı.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

        await sendOTPEmail(email, otp, 'forgot-password');

        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        user.isVerified = false;
        await user.save();

        res.status(201).json({
            message: 'OTP gönderildi. Lütfen doğrulayın.',
            userId: user._id,
        });
    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası', detail: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { userId, password } = req.body;
    try {
        const user = await User.findOne({ _id: userId });
        if (!user || user.isDeleted) {
            return res
                .status(400)
                .json({ error: 'E-posta adresine kayıtlı hesap bulunamadı.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: 'Kullanıcı bulunamadı.' });
        }

        if (user.isVerified) {
            return res
                .status(400)
                .json({ success: false, error: 'Zaten doğrulanmış.' });
        }

        if (user.otp !== otp || user.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                error: 'OTP geçersiz veya süresi dolmuş.',
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Kayıt tamamlandı.' });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Doğrulama hatası',
            detail: err.message,
        });
    }
};
