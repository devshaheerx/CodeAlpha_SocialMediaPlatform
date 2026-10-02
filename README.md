<div align="center">

# Pulse — Mini Social Media Platform

A full-stack social media app built with the **MERN stack** for **Task 2** of the **CodeAlpha Full Stack Development Internship**.

Create a profile, share posts with images, like and comment, follow people, and get a personalized feed.

</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Author](#author)

---

## Features

### Core requirements (CodeAlpha Task 2)

| Requirement | Implementation |
|---|---|
| **User profiles** | Avatar, name, @username, bio, join date, follower/following counts, user's posts, edit profile with photo upload |
| **Posts** | Create text and/or image posts; view, edit and delete your own posts |
| **Comments** | Comment on any post; delete your own comments; post owners can moderate comments on their posts |
| **Like system** | Like/unlike toggle with live counts (no double-counting) |
| **Follow system** | Follow/unfollow users, followers and following lists |
| **Personalized feed** | Shows posts from people you follow plus your own, newest first |
| **Database** | MongoDB stores users, posts, comments, followers and notifications |

### Additional features

- **Authentication**: JWT stored in httpOnly cookies, bcrypt password hashing, login with email or username, session persists on refresh
- **Image uploads**: posts and avatars stored on Cloudinary (JPG/PNG/WEBP/GIF, max 2 MB)
- **Notifications**: alerts for likes, comments and new followers, with an unread badge
- **Search**: find people by name or username
- **Who to follow**: suggestions ranked by follower count
- **Explore page**: discover posts from everyone
- **In-app confirmations**: delete confirmations and status messages appear as notifications at the top of the screen (no browser pop-ups)
- **Optimistic UI**: likes and follows update instantly and roll back if the request fails
- **Pagination**: "Load more" on every post list
- **Dark/light mode**: follows system preference and remembers your choice
- **Fully responsive**: tested from 320px phones to 1920px monitors
  - Phones: top bar + bottom tab bar
  - Tablets & laptops: compact icon sidebar
  - Desktops: full sidebar + "Who to follow" panel
- **Security**: Helmet headers, CORS restricted to the frontend URL, rate limiting on auth routes, input validation, ownership checks on every edit/delete

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router 7, Tailwind CSS v4, Axios, Context API, lucide-react, react-hot-toast |
| **Backend** | Node.js, Express, Mongoose, JSON Web Token, bcrypt, Multer 2, Cloudinary, express-validator, Helmet, express-rate-limit |
| **Database** | MongoDB Atlas |

---

## Project Structure

```
CodeAlpha_SocialMediaPlatform/
├── backend/
│   ├── config/          # MongoDB connection, Cloudinary setup
│   ├── controllers/     # auth, users, posts, comments, notifications
│   ├── middleware/      # auth guard, file upload, validation, error handler
│   ├── models/          # User, Post, Comment, Notification
│   ├── routes/          # Express routers
│   ├── utils/           # JWT helper, async wrapper, seed script
│   └── server.js
│
└── frontend/
    ├── public/
    └── src/
        ├── api/         # Axios instance
        ├── components/  # PostCard, CreatePost, CommentSection, FollowButton, Layout, ...
        ├── context/     # AuthContext, ThemeContext
        ├── hooks/       # usePosts (pagination)
        ├── pages/       # Feed, Explore, Profile, EditProfile, PostDetail, Notifications, ...
        ├── utils/       # date formatting, confirmation toast
        ├── App.jsx
        └── main.jsx
```

---

## Database Design

| Collection | Key fields |
|---|---|
| **users** | `username` (unique), `name`, `email` (unique), `password` (hashed), `avatar`, `bio`, `followers[]`, `following[]` |
| **posts** | `author → User`, `text`, `image`, `likes[] → User`, `commentsCount`, `edited` |
| **comments** | `post → Post`, `author → User`, `text` |
| **notifications** | `recipient → User`, `sender → User`, `type` (like / comment / follow), `post → Post`, `read` |

Followers are stored as arrays of user IDs on both users, so follow/unfollow uses `$addToSet` / `$pull`. Deleting a post also removes its comments, related notifications and its Cloudinary image.

---

## API Endpoints

Base URL: `/api` · 🔒 = requires login

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in with email or username |
| POST | `/auth/logout` | Log out |
| GET 🔒 | `/auth/me` | Get the current user |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET 🔒 | `/users/:username` | Get a profile |
| PUT 🔒 | `/users/me` | Update profile (multipart: `name`, `bio`, `avatar`) |
| POST 🔒 | `/users/:id/follow` | Follow / unfollow (toggle) |
| GET 🔒 | `/users/:id/followers` | Followers list |
| GET 🔒 | `/users/:id/following` | Following list |
| GET 🔒 | `/users/search?q=` | Search users |
| GET 🔒 | `/users/suggestions` | Who to follow |

### Posts
| Method | Endpoint | Description |
|---|---|---|
| GET 🔒 | `/posts/feed?page=` | Personalized feed |
| GET 🔒 | `/posts/explore?page=` | All posts |
| GET 🔒 | `/posts/user/:userId?page=` | A user's posts |
| GET 🔒 | `/posts/:id` | Single post |
| POST 🔒 | `/posts` | Create post (multipart: `text`, `image`) |
| PUT 🔒 | `/posts/:id` | Edit own post |
| DELETE 🔒 | `/posts/:id` | Delete own post |
| POST 🔒 | `/posts/:id/like` | Like / unlike (toggle) |

### Comments
| Method | Endpoint | Description |
|---|---|---|
| GET 🔒 | `/posts/:id/comments` | Get comments |
| POST 🔒 | `/posts/:id/comments` | Add a comment |
| DELETE 🔒 | `/comments/:id` | Delete a comment (author or post owner) |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET 🔒 | `/notifications` | List notifications |
| GET 🔒 | `/notifications/unread-count` | Unread count |
| PUT 🔒 | `/notifications/read` | Mark all as read |

---

## Getting Started

### Prerequisites
- Node.js 18 or newer
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free tier works)
- A [Cloudinary](https://cloudinary.com) account for image uploads (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/devshaheerx/CodeAlpha_SocialMediaPlatform.git
cd CodeAlpha_SocialMediaPlatform
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env     # then fill in your values
npm run seed             # optional: adds demo users and posts (clears existing data)
npm run dev              # runs on http://localhost:5000
```

### 3. Frontend (in a second terminal)
```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm run dev              # runs on http://localhost:5173
```

### Demo account
After running the seed script, log in with:
```
Username: demo
Password: password123
```

---

## Environment Variables

### `backend/.env`
| Variable | Description |
|---|---|
| `PORT` | Server port (default `5000`) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend URL (comma-separate multiple URLs) |
| `NODE_ENV` | `development` or `production` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### `frontend/.env`
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL ending in `/api` |

---

## Author

**Syed Shaheer Ahmed**: Full-Stack Developer (MERN)

[LinkedIn](https://linkedin.com/in/syedshaheerahmed) · [GitHub](https://github.com/devshaheerx)

---

<div align="center">

Built as part of the **CodeAlpha Full Stack Development Internship**

</div>
