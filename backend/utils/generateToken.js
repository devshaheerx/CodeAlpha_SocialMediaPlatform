import jwt from "jsonwebtoken";

const isProd = () => process.env.NODE_ENV === "production";

export const cookieOptions = () => ({
  httpOnly: true,
  secure: isProd(), // HTTPS only in production
  sameSite: isProd() ? "none" : "lax", // "none" is needed for cross-domain Vercel deploys
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
  res.cookie("token", token, cookieOptions());
  return token;
};

export default generateToken;
