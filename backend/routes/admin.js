import express from "express";
import fs from "fs-extra";
import multer from "multer";
import path from "path";

const router = express.Router();
const postsPath = "./data/posts.json";

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "public/uploads"),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const isLoggedIn = (req, res, next) => req.session.loggedIn ? next() : res.redirect("/admin/login");

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@example.com" && password === "admin123") {
    req.session.loggedIn = true;
    res.redirect("/admin/dashboard");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
});

router.get("/dashboard", isLoggedIn, async (_, res) => {
  const posts = await fs.readJson(postsPath).catch(() => []);
  res.render("dashboard", { posts });
});

router.get("/add", isLoggedIn, (req, res) => {
  res.render("form", { post: null });
});

router.post("/add", isLoggedIn, upload.single("image"), async (req, res) => {
  const { title, content, category, tags } = req.body;
  const posts = await fs.readJson(postsPath).catch(() => []);
  posts.push({
    id: Date.now().toString(),
    title,
    content,
    category,
    tags: tags.split(",").map(t => t.trim()),
    date: new Date().toISOString(),
    image: req.file ? req.file.filename : null
  });
  await fs.writeJson(postsPath, posts, { spaces: 2 });
  res.redirect("/admin/dashboard");
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const posts = await fs.readJson(postsPath);
  const post = posts.find(p => p.id === req.params.id);
  res.render("form", { post });
});

router.post("/edit/:id", isLoggedIn, upload.single("image"), async (req, res) => {
  const posts = await fs.readJson(postsPath);
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    const { title, content, category, tags } = req.body;
    posts[index] = {
      ...posts[index],
      title,
      content,
      category,
      tags: tags.split(",").map(t => t.trim()),
      image: req.file ? req.file.filename : posts[index].image
    };
    await fs.writeJson(postsPath, posts, { spaces: 2 });
  }
  res.redirect("/admin/dashboard");
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
  let posts = await fs.readJson(postsPath);
  posts = posts.filter(p => p.id !== req.params.id);
  await fs.writeJson(postsPath, posts, { spaces: 2 });
  res.redirect("/admin/dashboard");
});

export default router;
