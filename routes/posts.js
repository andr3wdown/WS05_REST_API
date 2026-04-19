const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/Post');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.post('/', async (req, res) => {
  if (!req.body.title || !req.body.content || !req.body.author) {
    return res.status(400).json({ error: 'Title, content, and author are required' });
  }
  const post = new Post(req.body);
  await post.save();
  return res.status(201).json(post);
});

router.get('/', async (req, res) => {
  const posts = await Post.find();
  return res.status(200).json(posts);
});

router.get('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  return res.status(200).json(post);
});

router.put('/:id', async (req, res) => {
  if (!req.body.title || !req.body.content || !req.body.author) {
    return res.status(400).json({ error: 'Title, content, and author are required' });
  }
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  return res.status(200).json(post);
});

router.delete('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  return res.status(200).json({ message: 'Post deleted successfully!' });
});

module.exports = router;