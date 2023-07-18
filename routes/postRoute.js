const router = require('express').Router();
const postVerify = require('../middleware/postVerify');
const jwtVerify = require('../middleware/jwtVerify');
const post = require('../controller/post');

// create a post
router.post('/create', postVerify.verifyPost, jwtVerify, post.createPost);
// get authors post
router.get('/myposts', jwtVerify, post.authorsPosts);
// delete author post
router.delete('/delete/:id', jwtVerify, post.deletePost);
// update post
router.put('/update/:id', jwtVerify, post.updatePost);
// get posts by tag
router.get('/tag/:tagname', post.getPostsByTagName);

// save a post
router.patch('/save/:id', jwtVerify, post.savePost);
// unsave a post
router.patch('/unsave/:id', jwtVerify, post.unsavePost);
// get all saved posts
router.get('/savedposts', jwtVerify, post.getSavedPosts);
// like and dislike a post
router.patch('/likePost/:id', jwtVerify, post.likeDislikePost);
// get liked posts
router.get('/likedposts', jwtVerify, post.getLikedPosts);
// get author posts length
router.get('/mypostslength', jwtVerify, post.getAuthorPostsLength);

// get post by id
router.get('/:id', post.getPostById);

module.exports = router;
