import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      match: [/^[a-z0-9_]+$/, "Username can only contain letters, numbers and underscores"],
    },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: "" },
    avatarPublicId: { type: String, default: "", select: false },
    bio: { type: String, default: "", maxlength: 160 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

userSchema.index({ name: "text", username: "text" });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Public shape sent to the client
userSchema.methods.toPublic = function (viewerId) {
  return {
    _id: this._id,
    username: this.username,
    name: this.name,
    avatar: this.avatar,
    bio: this.bio,
    followersCount: this.followers.length,
    followingCount: this.following.length,
    isFollowing: viewerId ? this.followers.some((id) => id.equals(viewerId)) : false,
    createdAt: this.createdAt,
  };
};

export default mongoose.model("User", userSchema);
