const Comment = require('../models/Comment');
const Product = require('../models/Product');

exports.addComment = async (req, res) => {
    const { productId, content, stars } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ error: 'Ürün bulunamadı.' });

        const comment = await Comment.create({
            product: productId,
            user: req.userId,
            content,
            stars,
        });

        const populatedComment = await comment.populate('user', 'fullname');

        res.status(201).json({
            success: true,
            data: {
                date: populatedComment.createdAt,
                fullname: populatedComment.user.fullname,
                content: populatedComment.content,
                stars: populatedComment.stars,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Yorum eklenirken bir hata oluştu.' });
    }
};

exports.getCommentsByProductId = async (req, res) => {
    const { productId } = req.params;

    try {
        const comments = await Comment.find({ product: productId })
            .populate('user', 'fullname')
            .sort({ createdAt: -1 });

        const formatted = comments.map((comment) => ({
            date: comment.createdAt,
            fullname: comment.user.fullname,
            content: comment.content,
            stars: comment.stars,
        }));

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Yorumlar getirilirken bir hata oluştu.',
        });
    }
};
