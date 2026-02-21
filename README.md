# 🎬 MovieCritic: Full-Stack Movie Review Platform

A premium, full-stack movie platform where users can browse films, share reviews, manage watchlists, and explore detailed cinematic data. Built with a focus on modern UI/UX, performance, and secure data management.

---

## ✨ Key Features

### **For Users**
*   **Dynamic Discovery**: Explore featured and trending films on a polished glassmorphic home page.
*   **Smart Search & Filter**: Real-time debounced search (by title, director, or cast) combined with genre-based filtering.
*   **Deep Perspectives**: Individual movie pages featuring detailed synopses, cast info, community ratings, and trailers.
*   **Interactive Reviews**: Rate movies (1-5 stars) and write text reviews with instant average rating updates.
*   **Personalized Profile**: Manage your own "Review History" and a curated "Watchlist" with one-click updates.
*   **Cinematic Trailers**: Integrated YouTube embed player with a fallback "Watch on YouTube" system for restricted content.

### **For Admins**
*   **Movie Management**: Dedicated dashboard for adding new movies.
*   **Media Handling**: Multipart form-data support for high-quality movie poster uploads.
*   **Metadata Control**: Manage genres, release years, directors, and trailers.

### **Core Infrastructure**
*   **State-of-the-art Auth**: Secure JWT-based authentication using HttpOnly Cookies for maximum XSS protection.
*   **Relational Integrity**: PostgreSQL with Drizzle ORM for type-safe, complex queries and high-performance joins.
*   **Responsive Design**: Mobile-first architecture built with Tailwind CSS and Shadcn UI.

---

## 🛠️ Tech Stack

**Frontend:**
*   **Framework**: React 18 (Vite)
*   **Styling**: Tailwind CSS & Shadcn UI
*   **Icons**: Lucide React
*   **State Management**: Redux Toolkit (Session & Auth)
*   **Navigation**: React Router DOM
*   **Data Fetching**: Axios

**Backend:**
*   **Runtime**: Node.js & Express
*   **Database**: PostgreSQL
*   **ORM**: Drizzle ORM
*   **Auth**: JWT (JSON Web Tokens) & Bcrypt
*   **File Uploads**: Multer
*   **Validation**: Zod (Planned)

---

## 🚀 Getting Started

### **Prerequisites**
*   Node.js (v18+)
*   PostgreSQL Database (Local or Cloud like Neon/ElephantSQL)
*   Bun or NPM/NPX

### **1. Clone the repository**
```bash
git clone <repository-url>
cd movie-critic-platform
```

### **2. Setup Backend**
```bash
cd Backend
bun install
```
Create a `.env` file in the `Backend` directory:
```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
```
Run migrations and start the server:
```bash
bun run db:push  # Push schema to DB
bun run dev      # Start dev server
```

### **3. Setup Frontend**
```bash
cd ../Frontend
bun install
bun run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```bash
├── Backend
│   ├── src
│   │   ├── config        # DB connection
│   │   ├── controllers   # Request logic
│   │   ├── middlewares   # Auth & File upload
│   │   ├── routes        # API Endpoints
│   │   ├── schema        # Drizzle SQL Definitions
│   │   └── services      # Business logic & Queries
│   └── public            # Static assets (Movie Posters)
├── Frontend
│   ├── src
│   │   ├── components    # Shared UI Components
│   │   ├── pages         # Page Views (Home, Profile, etc.)
│   │   ├── redux         # State Management
│   │   └── lib           # API Config (Axios)
```

---

## 📡 API Architecture

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/movies` | Fetch all movies (Filtered/Search) |
| `POST` | `/api/movies` | Create new movie (Admin) |
| `GET` | `/api/movies/:id` | Get movie details & reviews |
| `POST` | `/api/movies/:id/reviews` | Submit a movie review |
| `GET` | `/api/users/:id` | Get user profile & history |
| `POST` | `/api/users/watchlist/:id` | Add movie to watchlist |
| `DELETE` | `/api/users/watchlist/:id` | Remove from watchlist |

---

<!-- ## 🎯 Future Enhancements
*   [ ] **Pagination**: Implementing cursor-based pagination for movie grids.
*   [ ] **Admin RBAC**: Strict backend role-based access control.
*   [ ] **TMDB Integration**: Auto-fetching movie details using external APIs.
*   [ ] **Deployment**: Docker containerization and CI/CD pipelines. -->

---

## 📄 License
This project is for educational/interview purposes. Free to use for personal growth!
