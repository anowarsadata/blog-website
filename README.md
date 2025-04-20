
# 📰 Blog Website Project

A responsive blog website built using **HTML, CSS, JavaScript (Vanilla)** with a **Node.js/Express JSON-based backend**.

This project allows you to:
- Display blog posts with images, tags, categories
- Filter posts by category or search
- Read full blog posts on a separate page
- Comment on individual posts
- Upload blog posts via a JSON-powered admin panel
- Fully file-based backend (no database)

---

## 🔧 Tech Stack

**Frontend**
- HTML5 + CSS3
- Vanilla JavaScript (ES Modules)
- Font Awesome Icons
- Responsive design (mobile-first)

**Backend**
- Node.js + Express
- File storage (`posts.json`, `comments.json`)
- Multer for image upload

---

## 📂 Project Structure

```
blog-app/
├── frontend/
│   ├── index.html
│   ├── post.html
│   ├── about.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── config.js
│       ├── main.js
│       └── post.js
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── api.js
│   │   └── admin.js
│   ├── posts.json
│   ├── comments.json
│   └── public/uploads/
└── README.md
```

---

## 🚀 Features

- ✅ Home page with all blog posts
- ✅ Category filter and search
- ✅ Pagination (5 posts per page)
- ✅ Post page with:
  - Full content
  - Comment section
  - Comment form
- ✅ Show latest comment and count on homepage
- ✅ Admin panel to:
  - Login
  - Create, edit, delete posts
  - Upload images
- ✅ JSON file-based backend (no DB setup needed)
- ✅ Social share icons (Facebook, Twitter, LinkedIn)
- ✅ Mobile-friendly navigation bar

---

## 🔌 Getting Started

### Backend

1. Go to the `backend` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Server runs at `http://localhost:3000`

### Frontend

cd frontend
npm install -g http-server
npx http-server .


---

## ✍️ Admin Login

- Default login (file-based, hardcoded for demo):
  - **Email:** `admin@example.com`
  - **Password:** `admin123`

---

## 👨‍💻 Author

**Anowar Sadat**  
Email: `anowar.vista@gmail.com`  
GitHub: [@anowarsadata](https://github.com/anowarsadata)

---

## 📄 License

MIT License – use freely with attribution.
