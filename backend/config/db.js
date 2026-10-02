import mongoose from "mongoose";

// Reuse the connection across serverless invocations on Vercel
let cached = global._mongoose || { conn: null, promise: null };
global._mongoose = cached;

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((m) => {
      console.log("MongoDB connected Successfully!");
      return m;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
};

export default connectDB;
