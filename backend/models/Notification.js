import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "comment", "follow"], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Helper: create a notification unless the user is acting on their own content
notificationSchema.statics.notify = async function ({ recipient, sender, type, post }) {
  if (recipient.toString() === sender.toString()) return;
  // Avoid duplicate like/follow notifications when toggling repeatedly
  if (type !== "comment") {
    const exists = await this.findOne({ recipient, sender, type, post: post || undefined });
    if (exists) return;
  }
  await this.create({ recipient, sender, type, post });
};

export default mongoose.model("Notification", notificationSchema);
