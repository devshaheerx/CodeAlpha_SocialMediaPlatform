import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, trim: true, maxlength: 500, default: "" },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "", select: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0 },
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });

postSchema.pre("validate", function (next) {
  if (!this.text && !this.image) {
    this.invalidate("text", "A post needs text or an image");
  }
  next();
});

postSchema.methods.toPublic = function (viewerId) {
  return {
    _id: this._id,
    author: this.author,
    text: this.text,
    image: this.image,
    likesCount: this.likes.length,
    isLiked: viewerId ? this.likes.some((id) => id.equals(viewerId)) : false,
    commentsCount: this.commentsCount,
    edited: this.edited,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model("Post", postSchema);
