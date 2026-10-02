import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    // Fallback to Authorization header (handy for Postman)
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return res.status(401).json({ message: "Not authorized, please log in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User no longer exists" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired, please log in again" });
  }
};
