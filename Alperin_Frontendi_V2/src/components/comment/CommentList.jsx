import './CommentListStyle.css';

import { MdStar } from 'react-icons/md';

const templateImage =
    'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

export default function CommentList({ comments }) {
    const renderStars = (comment) => {
        const stars = [...Array(comment.stars)];
        const emptyStars = [...Array(5 - comment.stars)];
        const starSize = 18;

        return (
            <>
                {stars.map((_, i) => (
                    <MdStar key={i} color="#f1c40f" size={starSize} />
                ))}
                {emptyStars.map((_, i) => (
                    <MdStar key={i} color="#ccc" size={starSize} />
                ))}
            </>
        );
    };

    return (
        <div className="comment-list">
            {comments.length === 0 && (
                <p className="comment-empty">Henüz yorum yok.</p>
            )}

            {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                    <img
                        src={templateImage}
                        alt="Yorum İkonu"
                        className="comment-image"
                    />
                    <div className="comment-content">
                        <div className="comment-header">
                            <strong>{comment.fullname}</strong>
                            <div className="comment-stars">
                                {renderStars(comment)}
                            </div>
                        </div>
                        <p className="comment-text">{comment.content}</p>
                        <div className="comment-date">
                            {formatDate(comment.date)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
