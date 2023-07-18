const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// expires haedcoded 8h
const createToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '8h',
    });
    return token;
};

// register
// post
// auth/register
const register = asyncHandler(async (req, res) => {
    const { username, password, email, desc } = req.body;

    //  check if email alredy exists
    const user = await User.findOne({ email });
    if (user) return res.status(409).json({ error: 'Email already exists' });

    //  hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  create user
    const createdUser = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        desc,
        password: hashedPassword,
    });

    // create token
    const token = createToken({
        _id: createdUser._id,
        email: createdUser.email,
        username: createdUser.username,
    });

    return res.status(201).json({ msg: 'register successfull', token });
});

// login
// post
// auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //  check if user exists
    const user = await User.findOne({ email: email.toLowerCase() })
        .lean()
        .exec();
    if (!user)
        return res.status(404).json({ error: 'Incorrect email/password' });

    // check for password
    const isPasssword = await bcrypt.compare(password, user.password);
    if (!isPasssword)
        return res.status(404).json({ error: 'Incorrect email/password' });

    //  create token
    const token = createToken({
        _id: user._id,
        email: user.email,
        username: user.username,
    });

    return res.status(200).json({ msg: 'login successfull!', token });
});

module.exports = {
    register,
    login,
};
