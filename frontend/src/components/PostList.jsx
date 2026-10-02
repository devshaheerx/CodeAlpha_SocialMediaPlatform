import PostCard from "./PostCard";
import { PostSkeleton } from "./Loader";

// Renders a usePosts() result: skeletons, error, empty state, posts and "Load more"
export default function PostList({ posts, loading, loadingMore, hasMore, error, loadMore, reload, updatePost, removePost, empty }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button onClick={reload} className="btn-outline mt-3">Try again</button>
      </div>
    );
  }

  if (posts.length === 0) return empty || null;

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <PostCard key={p._id} post={p} onUpdate={updatePost} onDelete={removePost} />
      ))}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button onClick={loadMore} disabled={loadingMore} className="btn-outline">
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
