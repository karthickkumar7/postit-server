const {
    verifyUsername,
    verifyPassword,
    verifyEmail,
    verifyDesc,
} = require('../utils/verification/auth');

const loginVerify = (req, res, next) => {
    const { email, password } = req.body;

    if (!verifyEmail(email) || !verifyPassword(password))
        return res.status(400).json({ error: 'Invalid credentials!' });
    next();
};

const registerVerify = (req, res, next) => {
    const { username, password, email } = req.body;
    if (
        !verifyUsername(username) ||
        !verifyPassword(password) ||
        !verifyEmail(email)
    )
        return res.status(400).json({ error: 'invalid credentials!' });
    next();
};

module.exports = {
    loginVerify,
    registerVerify,
};
