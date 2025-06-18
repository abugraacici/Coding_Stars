import './CommentFormStyle.css';
import { useState } from 'react';
import { MdStar } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function CommentForm({ onSubmit }) {
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (stars === 0 || comment.trim() === '') {
            toast.warning('Lütfen yıldız ve yorum alanlarını doldurun.');
            return;
        }

        const newComment = {
            stars,
            content: comment,
        };

        onSubmit(newComment);
        setStars(0);
        setComment('');
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <div className="stars">
                {[1, 2, 3, 4, 5].map((value) => (
                    <MdStar
                        key={value}
                        size={24}
                        color={value <= stars ? '#f1c40f' : '#ccc'}
                        onClick={() => setStars(value)}
                        style={{ cursor: 'pointer' }}
                    />
                ))}
            </div>
            <textarea
                placeholder="Yorumunuzu yazın..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Gönder</button>
        </form>
    );
}
