const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },

        post: {
            type: mongoose.Types.ObjectId,
            ref: 'Post',
        },

        content: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 200,
        },

        likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],

        dislikes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

module.exports = new mongoose.model('Comment', commentSchema);
