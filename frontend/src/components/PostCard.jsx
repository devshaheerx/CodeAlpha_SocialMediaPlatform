import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { formatCount, timeAgo } from "../utils/format";
import confirmToast from "../utils/confirmToast";
import Avatar from "./Avatar";

export default function PostCard({ post, onUpdate, onDelete, detail = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likesCount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.text);
  const [saving, setSaving] = useState(false);
  const menuRef = useRef();

  const isOwner = user?._id === post.author?._id;

  useEffect(() => {
    setLiked(post.isLiked);
    setLikes(post.likesCount);
  }, [post.isLiked, post.likesCount]);

  // Close the ⋯ menu when clicking outside it
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => !menuRef.current?.contains(e.target) && setMenuOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const toggleLike = async () => {
    // Optimistic update
    const prev = { liked, likes };
    setLiked(!liked);
    setLikes(likes + (liked ? -1 : 1));
    try {
      const res = await api.post(`/posts/${post._id}/like`);
      setLiked(res.data.isLiked);
      setLikes(res.data.likesCount);
      onUpdate?.({ _id: post._id, isLiked: res.data.isLiked, likesCount: res.data.likesCount });
    } catch (err) {
      setLiked(prev.liked);
      setLikes(prev.likes);
      toast.error(getErrorMessage(err));
    }
  };

  const remove = async () => {
    setMenuOpen(false);
    if (!(await confirmToast({ title: "Delete this post?", message: "It will be removed along with its comments." }))) return;
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success("Post deleted");
      onDelete?.(post._id);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/posts/${post._id}`, { text: draft });
      onUpdate?.(res.data.post);
      setEditing(false);
      toast.success("Post updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const openDetail = () => !detail && !editing && navigate(`/post/${post._id}`);

  return (
    <article
      onClick={openDetail}
      className={`card p-3 sm:p-4 ${detail ? "" : "cursor-pointer transition hover:border-zinc-300 dark:hover:border-zinc-700"}`}
    >
      <div className="flex gap-3">
        <Link to={`/u/${post.author.username}`} onClick={(e) => e.stopPropagation()}>
          <Avatar user={post.author} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 text-sm">
              <Link
                to={`/u/${post.author.username}`}
                onClick={(e) => e.stopPropagation()}
                className="truncate font-semibold hover:underline"
              >
                {post.author.name}
              </Link>
              <span className="muted max-w-full truncate">@{post.author.username}</span>
              <span className="muted whitespace-nowrap">
                · {timeAgo(post.createdAt)}
                {post.edited && <span className="text-xs"> (edited)</span>}
              </span>
            </div>

            {isOwner && (
              <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="muted -mt-1 rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Post options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {menuOpen && (
                  <div className="card absolute right-0 z-10 mt-1 w-36 overflow-hidden py-1 shadow-lg">
                    <button
                      onClick={() => {
                        setEditing(true);
                        setDraft(post.text);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={remove}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {editing ? (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value.slice(0, 500))}
                rows={3}
                className="input resize-none"
                autoFocus
              />
              <div className="mt-2 flex justify-end gap-2">
                <button onClick={() => setEditing(false)} className="btn-outline px-3 py-1.5">
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving || (!draft.trim() && !post.image)}
                  className="btn-primary px-3 py-1.5"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            post.text && (
              <p className={`mt-1 whitespace-pre-wrap break-words ${detail ? "text-base sm:text-lg" : "text-[15px]"}`}>{post.text}</p>
            )
          )}

          {post.image && (
            <img
              src={post.image}
              alt=""
              loading="lazy"
              className="mt-3 max-h-[480px] w-full rounded-xl border border-zinc-200 object-cover dark:border-zinc-800"
            />
          )}

          <div className="mt-3 flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={toggleLike}
              className={`group flex items-center gap-1.5 text-sm transition ${liked ? "text-brand-500" : "muted hover:text-brand-500"}`}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <span className="rounded-full p-1.5 transition group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10">
                <Heart className={`h-[18px] w-[18px] ${liked ? "fill-current" : ""}`} />
              </span>
              {formatCount(likes)}
            </button>
            <Link
              to={`/post/${post._id}`}
              className="group muted flex items-center gap-1.5 text-sm transition hover:text-sky-500"
            >
              <span className="rounded-full p-1.5 transition group-hover:bg-sky-50 dark:group-hover:bg-sky-500/10">
                <MessageCircle className="h-[18px] w-[18px]" />
              </span>
              {formatCount(post.commentsCount)}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}