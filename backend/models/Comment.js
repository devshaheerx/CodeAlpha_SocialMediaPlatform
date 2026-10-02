import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: [true, "Comment cannot be empty"], trim: true, maxlength: 300 },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
