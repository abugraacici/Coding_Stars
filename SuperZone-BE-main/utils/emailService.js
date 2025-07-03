const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const register = (otp) => {
    return `
            <h2>Merhaba,</h2>
            <p>Kayıt işleminizi tamamlamak için aşağıdaki OTP kodunu kullanın:</p>
            <h3 style="color: #2c3e50;">${otp}</h3>
            <p>Bu kod 3 dakika boyunca geçerlidir.</p>
            <p>Teşekkürler,<br/>SuperZone Ekibi</p>
        `;
};

const forgotPassword = (otp) => {
    return `
            <h2>Merhaba,</h2>
            <p>Şifre sıfırlama işleminizi tamamlamak için aşağıdaki OTP kodunu kullanın:</p>
            <h3 style="color: #2c3e50;">${otp}</h3>
            <p>Bu kod 3 dakika boyunca geçerlidir.</p>
            <p>Teşekkürler,<br/>SuperZone Ekibi</p>
        `;
};

exports.sendOTPEmail = async (to, otp, type = 'register') => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to,
        subject: 'SuperZone - OTP Doğrulama Kodunuz',
        html: type === 'register' ? register(otp) : forgotPassword(otp),
    };

    await transporter.sendMail(mailOptions);
};
