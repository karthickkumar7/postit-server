const router = require('express').Router();
const jwtVerify = require('../middleware/jwtVerify');
const commentController = require('../controller/comment');

// get post comments
router.get('/:id', commentController.getCommentsByPostId);

// create a comment
router.post('/create', jwtVerify, commentController.createComment);

// delete comment
router.delete('/delete/:id', jwtVerify, commentController.deleteComment);

// update comment
router.put('/update/:id', jwtVerify, commentController.updateComment);

// like comment
router.put('/like/:id', jwtVerify, commentController.likeComment);

// dislike comment
router.put('/dislike/:id', jwtVerify, commentController.dislikeComment);

module.exports = router;
