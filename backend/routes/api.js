import express from "express";
import fs from "fs-extra";

const router = express.Router();
const postsPath = "./data/posts.json";
const commentsPath = "./data/comments.json";

router.get("/posts", async (_, res) => {
  const posts = await fs.readJson(postsPath).catch(() => []);
  res.json(posts.reverse());
});

router.get("/comments/:postId", async (req, res) => {
  const comments = await fs.readJson(commentsPath).catch(() => ({}));
  res.json(comments[req.params.postId] || []);
});

router.post("/comments/:postId", async (req, res) => {
  const comments = await fs.readJson(commentsPath).catch(() => ({}));
  if (!comments[req.params.postId]) comments[req.params.postId] = [];
  comments[req.params.postId].push({ ...req.body, date: new Date().toISOString() });
  await fs.writeJson(commentsPath, comments, { spaces: 2 });
  res.json({ message: "Comment added" });
});

router.get("/post/:slug", async (req, res) => {
  const posts = await fs.readJson(postsPath);
  const slug = req.params.slug;
  const post = posts.find(p => slugify(p.title) === slug);
  if (post) res.json(post);
  else res.status(404).json({ error: "Post not found" });
});

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default router;
