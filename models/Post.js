const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: 5,
            maxLength: 220,
        },
        desc: {
            type: String,
            required: true,
            minLength: 5,
            maxLength: 2000,
        },

        author: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },

        tags: {
            type: [String],
            required: true,
        },

        likes: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
        dislikes: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],

        comments: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Comment',
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
