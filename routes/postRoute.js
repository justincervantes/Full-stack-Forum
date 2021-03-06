const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussionController");

router.post("/post/createPost", discussionController.createPost);

router.get("/post/:postid", discussionController.getPost);

router.get("/post/:postid/replies", discussionController.getAllReplies);

router.post("/post/:postid/replies/comment", discussionController.addComment);




module.exports = router;
