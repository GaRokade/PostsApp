const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

// Create Post
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "username");
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Like Post
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
    } else {
      post.likes = post.likes.filter((id) => id.toString() !== req.body.userId);
    }
    await post.save();
    res.json("Post liked/unliked");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Comment on Post
// Update Post
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Post
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/comment/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ userId: req.body.userId, text: req.body.text });
    await post.save();
    res.json("Comment added");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
