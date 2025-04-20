import { API_BASE } from "./config.js";

let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
const postsPerPage = 5;

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(`${API_BASE}/posts`);
  allPosts = await res.json();
  filteredPosts = allPosts;

  renderPosts(filteredPosts);
  renderFilters([...new Set(allPosts.map(p => p.category))]);

  document.getElementById("searchInput").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    filteredPosts = allPosts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      (post.tags && post.tags.join(" ").toLowerCase().includes(query))
    );
    currentPage = 1;
    renderPosts(filteredPosts);
  });
});

function renderPosts(posts) {
  const container = document.getElementById("blogContainer");
  const pagination = document.getElementById("paginationControls");
  container.innerHTML = "";

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pagePosts = posts.slice(start, end);

  if (pagePosts.length === 0) {
    container.innerHTML = "<p>No posts found.</p>";
    return;
  }

  pagePosts.forEach(post => {
    container.innerHTML += `
      <article class="blog-post">
        <h2><a href="post.html?slug=${slugify(post.title)}">${post.title}</a></h2>
        <p><small>${post.date} • ${estimateReadTime(post.content)} min read</small></p>
        ${post.image ? `<img src="http://localhost:3000/uploads/${post.image}" />` : ""}
        <div class="post-content">${post.content}</div>
        <div class="post-tags">${(post.tags || []).map(tag => `<span class="tag">${tag}</span>`).join(" ")}</div>
        
    <div class="social-icons">
      <a href="#" title="Share on Facebook"><i class="fab fa-facebook-f"></i></a>
      <a href="#" title="Share on Twitter"><i class="fab fa-twitter"></i></a>
      <a href="#" title="Share on LinkedIn"><i class="fab fa-linkedin-in"></i></a>
    </div>
      </article>
    `;
  });

  // render pagination buttons
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = (i === currentPage ? "active" : "");
    btn.addEventListener("click", () => {
      goToPage(i);
    });
    pagination.appendChild(btn);
  }
}

function renderFilters(categories) {
  const filterBox = document.getElementById("categoryFilters");
  filterBox.innerHTML = '<strong>Filter by category:</strong><br>';

  const allBtn = document.createElement("button");
  allBtn.className = "category-btn";
  allBtn.textContent = "All";
  allBtn.addEventListener("click", () => {
    resetFilter();
  });
  filterBox.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat || "Uncategorized";
    btn.addEventListener("click", () => {
      filterCategory(cat || "Uncategorized");
    });
    filterBox.appendChild(btn);
  });
}

function resetFilter() {
  filteredPosts = allPosts;
  currentPage = 1;
  renderPosts(filteredPosts);
}

function filterCategory(cat) {
  filteredPosts = allPosts.filter(p => (p.category || "Uncategorized") === cat);
  currentPage = 1;
  renderPosts(filteredPosts);
}

function goToPage(pageNum) {
  currentPage = pageNum;
  renderPosts(filteredPosts);
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function estimateReadTime(html) {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
