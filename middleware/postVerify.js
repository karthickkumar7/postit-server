const verifyPost = (req, res, next) => {
    const { title, desc, tags } = req.body;

    if (!title || !desc || !tags?.length)
        throw new Error('fields cannot be empty');

    if (tags.length > 6) throw new Error('tags must be upto 6');

    if (title.length < 5) throw new Error('title must be atleast 5 characters');

    if (title.length > 120)
        throw new Error('title must be atleast 5 characters');

    if (desc.length < 5)
        throw new Error('description must be atleast 5 characters');

    next();
};

module.exports = {
    verifyPost,
};
