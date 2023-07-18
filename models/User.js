const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        desc: {
            type: String,
            default: "I'm a New User",
            minLength: 10,
            maxLength: 2000,
        },

        following: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
        followers: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],

        savedPosts: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Post',
            },
        ],

        likedPosts: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Post',
            },
        ],
        createdPosts: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Post',
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
