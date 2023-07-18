const router = require('express').Router();
const auth = require('../controller/auth');
const user = require('../controller/user');
const credentialsVerify = require('../middleware/authVerify');
const jwtVerify = require('../middleware/jwtVerify');

router.post('/login', credentialsVerify.loginVerify, auth.login);

router.post('/register', credentialsVerify.registerVerify, auth.register);

router.put('/follow', jwtVerify, user.followUser);

router.put('/unfollow', jwtVerify, user.unFollowUser);

// get followers
router.get('/followers', user.getFollowers);

// get followings
router.get('/followings', user.getFollowing);

module.exports = router;
