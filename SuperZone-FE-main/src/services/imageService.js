import axios from 'axios';

const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const uploadImageToImgbb = async (imageFile) => {
    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });

    try {
        const base64Image = await toBase64(imageFile);

        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${API_KEY}`,
            new URLSearchParams({ image: base64Image }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data.data.url;
    } catch (error) {
        return { message: 'Sunucu hatası.' };
    }
};
