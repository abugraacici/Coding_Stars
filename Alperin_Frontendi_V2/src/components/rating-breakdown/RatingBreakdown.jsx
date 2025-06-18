import './RatingBreakdownStyle.css';

export default function RatingBreakdown({ comments }) {
    const total = comments.length;
    const starCounts = [5, 4, 3, 2, 1].map((star) => {
        const count = comments.filter((c) => c.stars === star).length;
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
        return { star, count, percent };
    });

    return (
        <div className="rating-breakdown">
            {starCounts.map(({ star, count, percent }) => (
                <div key={star} className="rating-row">
                    <span className="star-label">{star} yıldız</span>
                    <div className="bar-wrapper">
                        <div
                            className="bar-fill"
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>
                    <span className="percent-label">{count}</span>
                </div>
            ))}
        </div>
    );
}
