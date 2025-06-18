export const passwordRules = [
    {
        test: /.+/,
        message: 'Şifre boş olamaz.',
    },
    {
        test: /.{8,}/,
        message: 'Şifre en az 8 karakter olmalı.',
    },
    {
        test: /[a-z]/,
        message: 'Şifre küçük harf içermeli.',
    },
    {
        test: /[A-Z]/,
        message: 'Şifre büyük harf içermeli.',
    },
    {
        test: /\d/,
        message: 'Şifre sayı içermeli.',
    },
    {
        test: /[^a-zA-Z0-9]/,
        message: 'Şifre özel karakter içermeli.',
    },
];

export const emailRules = [
    {
        test: /.+/,
        message: 'E-posta adresi boş olamaz.',
    },
    {
        test: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Geçerli bir e-posta adresi girin.',
    },
];

export const emptyFieldRules = [
    {
        test: /.+/,
        message: 'Bu alan boş bırakılamaz.',
    },
];

export const phoneRules = [
    {
        test: /.+/,
        message: 'Telefon numarası boş olamaz.',
    },
    {
        test: /^\d{10}$/,
        message:
            'Telefon numarası 10 haneli olmalı ve sadece rakamlardan oluşmalı.',
    },
];
