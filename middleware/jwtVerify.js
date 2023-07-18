const jwt = require('jsonwebtoken');

const jwtVerify = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'unauthorized!' });

    jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET, {}, (err, user) => {
        if (err) return res.status(403).json({ error: 'forbidden!' });
        req.user = user;
        next();
    });
};

module.exports = jwtVerify;
