const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const followUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const _id = req.user._id;

    // find users
    const user = await User.findOne({ _id });
    const userToFollow = await User.findOne({ _id: userId });

    // chcck if users exists
    if (!user || !userToFollow)
        return res.status(400).json({ msg: 'No user found!' });

    //  check if alredy following
    if (user.following.includes(userToFollow._id)) {
        return res.status(409).json({ msg: 'already following' });
    }

    await user.updateOne({ $push: { following: userToFollow._id } });
    await userToFollow.updateOne({ $push: { followers: user._id } });

    return res.status(200).json({ msg: 'follow successful' });
});

const unFollowUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const _id = req.user._id;

    // find users
    const user = await User.findOne({ _id });
    const userToFollow = await User.findOne({ _id: userId });

    // chcck if users exists
    if (!user || !userToFollow)
        return res.status(400).json({ msg: 'No user found!' });

    //  check if following
    if (!user.following.includes(userToFollow._id)) {
        return res.status(409).json({ msg: 'not following the user' });
    }

    await user.updateOne({ $pull: { following: userToFollow._id } });
    await userToFollow.updateOne({ $pull: { followers: user._id } });

    return res.status(200).json({ msg: 'unfollow successful' });
});

const getFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const following = await User.findOne({ _id: userId })
        .populate('following')
        .select('following');

    return res.status(200).json({ msg: 'following users', following });
});

const getFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const followers = await User.findOne({ _id: userId })
        .populate('followers')
        .select('followers');

    return res.status(200).json({ msg: 'user followers', followers });
});

module.exports = {
    followUser,
    unFollowUser,
    getFollowing,
    getFollowers,
};
