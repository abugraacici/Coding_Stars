import './ImageSelectorStyle.css';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';

const ImageSelector = ({ onImageSelect, imageUrl = '' }) => {
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(imageUrl);

    useEffect(() => {
        if (previewUrl !== imageUrl) {
            if (typeof imageUrl === 'string' || imageUrl === '')
                setPreviewUrl(imageUrl);
            else {
                const objectUrl = URL.createObjectURL(imageUrl);
                setPreviewUrl(objectUrl);
            }
        }
    }, [imageUrl]);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Lütfen sadece JPG dosyası seçin.');
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        onImageSelect(file);
    };

    return (
        <div>
            {previewUrl && (
                <div>
                    <img
                        className="selected-image"
                        src={previewUrl}
                        alt="Seçilen Görsel"
                    />
                </div>
            )}
            <button
                className="select-image"
                type="button"
                onClick={handleButtonClick}
            >
                Resim Seç
            </button>
            <input
                type="file"
                accept=".jpg,.jpeg"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default ImageSelector;
