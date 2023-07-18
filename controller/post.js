const User = require('../models/User');
const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');

//
//
//create a new post
const createPost = asyncHandler(async (req, res) => {
    const _id = req.user._id;
    const user = await User.findOne({ _id });
    if (!user) throw new Error('Invalid user');

    // create a post
    const createdPost = await Post.create({
        ...req.body,
        author: req.user._id,
    });

    // update user
    await user.updateOne({ $push: { createdPosts: createdPost._id } });

    return res.status(201).json({ msg: 'post created', post: createdPost });
});

//
//
//get authors posts
const authorsPosts = asyncHandler(async (req, res) => {
    const _id = req.user._id;

    const authorsPosts = await Post.find({ author: _id }).populate(
        'author',
        'username'
    );

    return res.status(200).json({ posts: authorsPosts });
});

//
//
//get posts by id
const getPostById = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId }).populate(
        'author',
        'username'
    );
    return res.status(200).json({ post });
});

// update post
const updatePost = asyncHandler(async (req, res) => {
    const postBody = req.body;
    const postId = req.params.id;

    // check if author is user
    const post = await Post.findOne({ _id: postId });
    if (post.author.toString() !== req.user._id)
        return res
            .status(401)
            .json({ msg: 'unauthorized to perform this action!' });

    await post.updateOne(postBody);
    return res.status(200).json({ msg: 'updated successfully!' });
});

//
//
//
const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const _id = req.user._id;

    const post = await Post.findOne({ _id: postId });

    // check post exists
    if (!post) return res.status(404).json({ error: 'no post found!' });

    // check if author is user
    if (post.author.toString() !== _id)
        return res
            .status(401)
            .json({ msg: 'unauthorized to perform this action!' });

    await post.deleteOne();
    await User.findOneAndUpdate({ _id }, { $pull: { createdPosts: postId } });
    return res.status(200).json({ msg: 'post deleted!', post });
});

//patch /save
//
//save post
const savePost = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.id;
    const user = await User.findOne({ _id: userId });
    const post = await Post.findOne({ _id: postId });
    const postAlreadySaved = user.savedPosts.includes(postId);

    if (postAlreadySaved)
        return res.status(409).json({ error: 'post already saved!' });
    if (!post) return res.status(404).json({ error: "post doesn't exists!" });

    await user.updateOne({ $push: { savedPosts: postId } });

    return res.status(200).json({ msg: 'post saved!', post });
});

//patch /unsave
//
//
const unsavePost = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.id;
    const user = await User.findOne({ _id: userId });
    const post = await Post.findOne({ _id: postId });
    const postAlreadySaved = user.savedPosts.includes(postId);

    if (!postAlreadySaved)
        return res.status(409).json({ error: 'post not saved!' });
    if (!post) return res.status(404).json({ error: "post doesn't exists!" });

    await user.updateOne({ $pull: { savedPosts: postId } });

    return res.status(200).json({ msg: 'post unsaved!' });
});

//
//
// TODODO
const likeDislikePost = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findOne({ _id: postId });
    const postExists = post.likes.includes(postId);
    // remove
    if (postExists) {
        await post.updateOne({ $pull: { likes: postId } });
        await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { likedPosts: postId } }
        );
        return res.status(200).json({ msg: 'unliked post' });
    } else {
        // save
        await post.updateOne({ $push: { likes: postId } });
        await User.findOneAndUpdate(
            { _id: userId },
            { $push: { likedPosts: postId } }
        );
        return res.status(200).json({ msg: 'liked post' });
    }
});

//
//
//get saved posts
const getSavedPosts = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId })
        .populate('savedPosts')
        .populate({
            path: 'savedPosts',
            populate: {
                path: 'author',
                select: 'username',
            },
        })
        .lean();
    const savedPosts = user.savedPosts;

    return res.status(200).json({ posts: savedPosts });
});

//
//
// get liked posts
const getLikedPosts = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId }).populate('likedPosts');
    const likedPosts = user.likedPosts;

    return res.status(200).json({ posts: likedPosts });
});

//
//
// get author posts length
const getAuthorPostsLength = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const count = await Post.find({ author: userId }).count();
    return res.status(200).json({ count });
});

const getPostsByTagName = asyncHandler(async (req, res) => {
    const tagname = req.params.tagname;

    const posts = await Post.find({ tags: { $all: [tagname] } }).populate(
        'author',
        'username'
    );

    return res.status(200).json({ posts });
});

module.exports = {
    createPost,
    authorsPosts,
    getPostById,
    updatePost,
    deletePost,
    getSavedPosts,
    likeDislikePost,
    getLikedPosts,
    savePost,
    unsavePost,
    getAuthorPostsLength,
    getPostsByTagName,
};
