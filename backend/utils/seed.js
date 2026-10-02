// Seeds demo users, follows, posts, likes and comments.
// Usage: npm run seed   (WARNING: clears existing users/posts/comments/notifications)
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";

const users = [
  { name: "Demo User", username: "demo", email: "demo@pulse.dev", bio: "Exploring Pulse 👋" },
  { name: "Ayesha Khan", username: "ayesha", email: "ayesha@pulse.dev", bio: "UI designer · coffee lover" },
  { name: "Ali Raza", username: "ali_raza", email: "ali@pulse.dev", bio: "Backend dev. Node & Mongo." },
  { name: "Sara Ahmed", username: "sara", email: "sara@pulse.dev", bio: "Photographer from Karachi 📷" },
  { name: "Hamza Malik", username: "hamza", email: "hamza@pulse.dev", bio: "Learning React one hook at a time" },
];

const posts = [
  ["ayesha", "Just finished redesigning my portfolio. Minimal is the way to go ✨"],
  ["ali_raza", "Pro tip: index the fields you query on in MongoDB. Went from 800ms to 12ms."],
  ["sara", "Sunset at Clifton beach today was unreal 🌅"],
  ["hamza", "Finally understood useEffect cleanup functions. Small wins!"],
  ["demo", "Hello Pulse! This is my first post."],
  ["ali_raza", "Express middleware order matters more than you think."],
  ["ayesha", "What's your favourite font pairing for web apps?"],
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Post.deleteMany(), Comment.deleteMany(), Notification.deleteMany()]);

  const created = {};
  for (const u of users) created[u.username] = await User.create({ ...u, password: "password123" });

  const follow = async (a, b) => {
    await User.updateOne({ _id: created[a]._id }, { $addToSet: { following: created[b]._id } });
    await User.updateOne({ _id: created[b]._id }, { $addToSet: { followers: created[a]._id } });
  };
  await follow("demo", "ayesha");
  await follow("demo", "ali_raza");
  await follow("ayesha", "sara");
  await follow("ali_raza", "demo");
  await follow("sara", "ayesha");
  await follow("hamza", "ayesha");
  await follow("hamza", "ali_raza");

  const names = Object.keys(created);
  for (const [author, text] of posts) {
    const likers = names.filter((n) => n !== author).slice(0, Math.floor(Math.random() * 4));
    const post = await Post.create({ author: created[author]._id, text, likes: likers.map((n) => created[n]._id) });
    const commenter = names.find((n) => n !== author);
    await Comment.create({ post: post._id, author: created[commenter]._id, text: "Love this! 🔥" });
    post.commentsCount = 1;
    await post.save();
  }

  console.log("Seeded. Log in with demo / password123");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
