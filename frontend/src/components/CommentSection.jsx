import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Send, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/format";
import confirmToast from "../utils/confirmToast";
import Avatar from "./Avatar";
import Loader from "./Loader";

export default function CommentSection({ post, onCountChange }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get(`/posts/${post._id}/comments`)
      .then((res) => setComments(res.data.comments))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [post._id]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      const res = await api.post(`/posts/${post._id}/comments`, { text: text.trim() });
      setComments((c) => [...c, res.data.comment]);
      onCountChange?.(1);
      setText("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!(await confirmToast({ title: "Delete this comment?" }))) return;
    try {
      await api.delete(`/comments/${id}`);
      setComments((c) => c.filter((x) => x._id !== id));
      onCountChange?.(-1);
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const isPostOwner = user?._id === post.author._id;

  return (
    <section className="card">
      <form onSubmit={submit} className="flex items-center gap-3 border-b border-zinc-100 p-4 dark:border-zinc-800">
        <Avatar user={user} size="sm" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 300))}
          placeholder="Write a comment..."
          className="input flex-1 rounded-full"
        />
        <button type="submit" disabled={busy || !text.trim()} className="btn-primary h-10 w-10 p-0" aria-label="Send comment">
          <Send className="h-4 w-4" />
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : comments.length === 0 ? (
        <p className="muted py-10 text-center text-sm">No comments yet. Be the first!</p>
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {comments.map((c) => (
            <li key={c._id} className="group flex gap-3 p-4">
              <Link to={`/u/${c.author.username}`}>
                <Avatar user={c.author} size="sm" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5 text-sm">
                  <Link to={`/u/${c.author.username}`} className="font-semibold hover:underline">
                    {c.author.name}
                  </Link>
                  <span className="muted text-xs">· {timeAgo(c.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-sm break-words whitespace-pre-wrap">{c.text}</p>
              </div>
              {(c.author._id === user?._id || isPostOwner) && (
                <button
                  onClick={() => remove(c._id)}
                  className="muted self-start rounded-full p-1.5 opacity-100 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-red-500/10"
                  aria-label="Delete comment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}