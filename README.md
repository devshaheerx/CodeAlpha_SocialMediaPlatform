# Pulse — Mini Social Media Platform

A full-stack social media app built with the **MERN stack** (MongoDB, Express, React, Node.js) as **Task 2** of the **CodeAlpha Full Stack Development Internship**.

Users can create profiles, share posts with images, like and comment on posts, follow other people, and get a personalized feed.

**Live demo:** _add your Vercel link here_
**Demo login:** `demo` / `password123` (after running the seed script)

---

## Screenshots

_Add screenshots here: Feed, Profile, Post detail, Mobile + dark mode_

---

## Features

### Core requirements (CodeAlpha Task 2)
- **User profiles** — avatar, name, @username, bio, join date, follower/following counts, user's posts, edit profile
- **Posts** — create text and/or image posts, view, edit and delete your own posts
- **Comments** — comment on any post; delete your own comments (post owners can moderate comments on their posts)
- **Like system** — like/unlike toggle with live counts
- **Follow system** — follow/unfollow users, followers and following lists
- **Personalized feed** — posts from people you follow plus your own
- **Database** — MongoDB collections for users, posts, comments and followers

### Extra features
- Secure JWT authentication in httpOnly cookies, bcrypt password hashing
- Image uploads to Cloudinary (posts and avatars)
- Notifications for likes, comments and follows, with unread badge
- User search
- "Who to follow" suggestions (MongoDB aggregation pipeline)
- Explore page with posts from everyone
- Optimistic UI updates for likes and follows
- Pagination ("Load more")
- Dark / light mode
- Fully responsive, tested from 320px phones to 1920px monitors: bottom tab bar on phones, icon sidebar on tablets/laptops, full sidebar + "Who to follow" panel on desktops
- Input validation, rate limiting, Helmet security headers

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, React Router 7, Tailwind CSS v4, Axios, Context API, lucide-react, react-hot-toast |
| Backend | Node.js, Express, Mongoose, JWT, bcrypt, Multer, Cloudinary, express-validator, Helmet, express-rate-limit |
| Database | MongoDB Atlas |
| Deployment | Vercel (frontend and backend as separate projects) |

---

## Project Structure

```
CodeAlpha_SocialMediaPlatform/
├── backend/
│   ├── config/         # MongoDB + Cloudinary setup
│   ├── controllers/    # auth, users, posts, comments, notifications
│   ├── middleware/     # auth guard, upload, validation, error handler
│   ├── models/         # User, Post, Comment, Notification
│   ├── routes/
│   ├── utils/          # token helper, async wrapper, seed script
│   └── server.js
└── frontend/
    └── src/
        ├── api/        # axios instance
        ├── components/ # PostCard, CreatePost, CommentSection, FollowButton, Layout, ...
        ├── context/    # AuthContext, ThemeContext
        ├── hooks/      # usePosts (pagination)
        ├── pages/      # Feed, Explore, Profile, PostDetail, Notifications, ...
        └── utils/
```

---

## API Endpoints

🔒 = requires authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Log in (email or username) |
| POST | `/api/auth/logout` | Log out |
| GET 🔒 | `/api/auth/me` | Current user |
| GET 🔒 | `/api/users/:username` | Get profile |
| PUT 🔒 | `/api/users/me` | Update profile (multipart: name, bio, avatar) |
| POST 🔒 | `/api/users/:id/follow` | Follow / unfollow (toggle) |
| GET 🔒 | `/api/users/:id/followers` | Followers list |
| GET 🔒 | `/api/users/:id/following` | Following list |
| GET 🔒 | `/api/users/search?q=` | Search users |
| GET 🔒 | `/api/users/suggestions` | Who to follow |
| GET 🔒 | `/api/posts/feed?page=` | Personalized feed |
| GET 🔒 | `/api/posts/explore?page=` | All posts |
| GET 🔒 | `/api/posts/user/:userId` | A user's posts |
| GET 🔒 | `/api/posts/:id` | Single post |
| POST 🔒 | `/api/posts` | Create post (multipart: text, image) |
| PUT 🔒 | `/api/posts/:id` | Edit own post |
| DELETE 🔒 | `/api/posts/:id` | Delete own post (+ its comments) |
| POST 🔒 | `/api/posts/:id/like` | Like / unlike (toggle) |
| GET 🔒 | `/api/posts/:id/comments` | Get comments |
| POST 🔒 | `/api/posts/:id/comments` | Add comment |
| DELETE 🔒 | `/api/comments/:id` | Delete comment |
| GET 🔒 | `/api/notifications` | Notifications |
| GET 🔒 | `/api/notifications/unread-count` | Unread count |
| PUT 🔒 | `/api/notifications/read` | Mark all as read |

---

## Run Locally

**Prerequisites:** Node.js 18+, a MongoDB Atlas cluster (free tier works), and optionally a Cloudinary account for image uploads.

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # then fill in your values
npm run seed              # optional: demo users and posts
npm run dev               # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev               # http://localhost:5173
```

### Environment variables

**backend/.env**
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `CLIENT_URL` | Frontend URL (comma-separate multiple) |
| `NODE_ENV` | `development` or `production` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL ending in `/api` |

---

## Deploy to Vercel

1. Push the repo to GitHub.
2. **Backend:** import the repo in Vercel, set the root directory to `backend`, add all backend env vars (set `NODE_ENV=production` and `CLIENT_URL` to your frontend URL).
3. **Frontend:** import the repo again, set the root directory to `frontend`, framework preset **Vite**, add `VITE_API_URL=https://<your-backend>.vercel.app/api`.
4. In MongoDB Atlas → Network Access, allow `0.0.0.0/0` so Vercel can connect.

---

## Author

**Syed Shaheer Ahmed** — Full-Stack Developer (MERN)
[LinkedIn](https://linkedin.com/in/syedshaheerahmed) · [GitHub](https://github.com/devshaheerx)

Built for the **CodeAlpha** Full Stack Development Internship.
