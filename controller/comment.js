const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const asyncHandler = require('express-async-handler');

const getCommentsByPostId = asyncHandler(async (req, res) => {
    const postId = req.params.id;

    const comments = await Post.findOne({ _id: postId })
        .populate('comments')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username',
            },
        })
        .select('comments');

    return res.status(200).json({ comments });
});

const createComment = asyncHandler(async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.user._id;

    const post = await Post.findOne({ _id: postId });
    if (!post) return res.status(400).json({ error: 'no post found' });

    const createdComment = await Comment.create({
        author: userId,
        post: postId,
        content,
    });

    await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { comments: createdComment._id } }
    );
    const user = await User.findOne({ _id: userId });
    const comment = {
        ...createdComment._doc,
        author: {
            _id: user._id,
            username: user.username,
        },
    };

    return res.status(201).json({ msg: 'comment added', comment });
});

const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params.id;
    const _id = req.user._id;

    const comment = await Comment.findOne({ _id: commentId });

    // check if user is author
    if (comment.author.toString() !== _id)
        return res
            .status(401)
            .json({ msg: 'you are unauthorized to perform this action' });

    await Comment.findOneAndDelete({ _id: commentId });

    // remove the comment from the post
    await Post.findOneAndUpdate(
        { _id: comment.post.toString() },
        { $pull: { comments: comment._id.toString() } }
    );

    return res.status(200).json({ msg: 'comment removed', comment });
});

const updateComment = asyncHandler(async (req, res) => {
    const commentId = req.params.id;
    const _id = req.user._id;
    const { content } = req.body;

    const comment = await Comment.findOne({ _id: commentId });

    // check if user is author
    if (comment.author.toString() !== _id)
        return res
            .status(401)
            .json({ msg: 'you are not authorized to perform this action!' });

    await comment.updateOne({ content });

    return res.status(200).json({ msg: 'comment updated' });
});

const likeComment = asyncHandler(async (req, res) => {
    const commentId = req.params.id;
    const _id = req.user._id;

    const comment = await Comment.findOne({ _id: commentId });

    if (comment.likes.includes(_id)) {
        await comment.updateOne({ $pull: { likes: _id } });
        return res.status(200).json({ msg: 'removed like' });
    }

    // if disliked, remove
    if (comment.dislikes.includes(_id)) {
        await comment.updateOne({ $pull: { dislikes: _id } });
    }

    await comment.updateOne({ $push: { likes: _id } });
    return res.status(200).json({ msg: 'comment liked' });
});

const dislikeComment = asyncHandler(async (req, res) => {
    const commentId = req.params.id;
    const _id = req.user._id;

    const comment = await Comment.findOne({ _id: commentId });

    if (comment.dislikes.includes(_id)) {
        await comment.updateOne({ $pull: { dislikes: _id } });
        return res.status(200).json({ msg: 'removed dislike' });
    }

    // if liked, remove
    if (comment.likes.includes(_id)) {
        await comment.updateOne({ $pull: { likes: _id } });
    }

    await comment.updateOne({ $push: { dislikes: _id } });
    return res.status(200).json({ msg: 'comment disliked' });
});

module.exports = {
    getCommentsByPostId,
    createComment,
    deleteComment,
    updateComment,
    likeComment,
    dislikeComment,
};
