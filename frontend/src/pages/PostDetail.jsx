import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api, { getErrorMessage } from "../api/axios";
import PostCard from "../components/PostCard";
import CommentSection from "../components/CommentSection";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setPost(null);
    api
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data.post))
      .catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  if (error) {
    return (
      <EmptyState title="Post not found" text="It may have been deleted.">
        <Link to="/" className="btn-primary">Go home</Link>
      </EmptyState>
    );
  }
  if (!post) return <Loader />;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-extrabold">Post</h1>
      </div>

      <PostCard
        post={post}
        detail
        onUpdate={(p) => setPost((prev) => ({ ...prev, ...p }))}
        onDelete={() => navigate("/", { replace: true })}
      />

      <CommentSection
        post={post}
        onCountChange={(d) => setPost((p) => ({ ...p, commentsCount: p.commentsCount + d }))}
      />
    </div>
  );
}
