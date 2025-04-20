import { API_BASE } from "./config.js";

const slug = new URLSearchParams(window.location.search).get("slug");

fetch(`${API_BASE}/post/${slug}`)
  .then(res => res.json())
  .then(post => {
    const main = document.getElementById("postContent");
    main.innerHTML = `
      <article class="blog-post">
        <h2>${post.title}</h2>
        <p><small>${post.date} • ${estimateReadTime(post.content)} min read</small></p>
        ${post.image ? `<img src="http://localhost:3000/uploads/${post.image}" />` : ""}
        <div class="post-content">${post.content}</div>
        <div class="post-tags">
          ${(post.tags || []).map(tag => `<span class="tag">${tag}</span>`).join(" ")}
        </div>
      </article>

      <section class="comments comment-section">
        <h3>Comments</h3>
        <div id="commentsList">Loading comments...</div>

        <form id="commentForm">
          <input type="text" id="name" placeholder="Your name" required />
          <textarea id="commentText" placeholder="Write a comment..." required></textarea>
          <button type="submit">Submit</button>
        </form>
      </section>
    `;
    loadComments(post.id);
    setupCommentForm(post.id);
  });

function loadComments(postId) {
  fetch(`${API_BASE}/comments/${postId}`)
    .then(res => res.json())
    .then(comments => {
      const list = document.getElementById("commentsList");
      if (!comments.length) {
        list.innerHTML = "<p>No comments yet.</p>";
        return;
      }
      list.innerHTML = comments.map(c => `
        <div class="comment">
          <strong>${c.name}</strong> • <em>${new Date(c.date).toLocaleString()}</em>
          <p>${c.text}</p>
        </div>
      `).join("");
    });
}

function setupCommentForm(postId) {
  document.getElementById("commentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const text = document.getElementById("commentText").value.trim();
    if (!name || !text) return;

    await fetch(`${API_BASE}/comments/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, text })
    });

    document.getElementById("name").value = "";
    document.getElementById("commentText").value = "";
    loadComments(postId);
  });
}

function estimateReadTime(html) {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
