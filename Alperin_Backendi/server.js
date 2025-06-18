const express = require('express');
const cors = require('cors');
require('dotenv').config();

const cron = require('node-cron');
const { updateDeliveryStatuses } = require('./utils/orderService');
cron.schedule('0 */2 * * *', () => {
    const now = new Date();
    const time = now.toLocaleString('tr-TR');
    console.log(`${time}\nSipariş durumu güncelleme çalışıyor...`);
    updateDeliveryStatuses().catch(console.error);
});

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const addressRoutes = require('./routes/addressRoutes');
const productRoutes = require('./routes/productRoutes');
const commentRoutes = require('./routes/commentRoutes');
const orderRoutes = require('./routes/orderRoutes');

const BASE_ENDPOINT = '/api/v1';

app.use(`${BASE_ENDPOINT}/auth`, authRoutes);
app.use(`${BASE_ENDPOINT}/user`, userRoutes);
app.use(`${BASE_ENDPOINT}/search-history`, searchRoutes);
app.use(`${BASE_ENDPOINT}/categories`, categoryRoutes);
app.use(`${BASE_ENDPOINT}/addresses`, addressRoutes);
app.use(`${BASE_ENDPOINT}/products`, productRoutes);
app.use(`${BASE_ENDPOINT}/comments`, commentRoutes);
app.use(`${BASE_ENDPOINT}/orders`, orderRoutes);

app.get(BASE_ENDPOINT, (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        const now = new Date();
        const time = now.toLocaleString('tr-TR');
        console.log(`${time}\tSunucu ${PORT} portunda çalışıyor...`);
    });
});
