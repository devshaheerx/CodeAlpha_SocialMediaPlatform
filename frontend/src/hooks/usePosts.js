import { useCallback, useEffect, useState } from "react";
import api, { getErrorMessage } from "../api/axios";

// Paginated post list for any endpoint that returns { posts, hasMore }
export default function usePosts(endpoint) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (p) => {
      if (!endpoint) return;
      p === 1 ? setLoading(true) : setLoadingMore(true);
      try {
        const res = await api.get(endpoint, { params: { page: p } });
        setPosts((prev) => (p === 1 ? res.data.posts : [...prev, ...res.data.posts]));
        setHasMore(res.data.hasMore);
        setPage(p);
        setError("");
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [endpoint]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const addPost = (post) => setPosts((prev) => [post, ...prev]);
  const updatePost = (post) => setPosts((prev) => prev.map((p) => (p._id === post._id ? { ...p, ...post } : p)));
  const removePost = (id) => setPosts((prev) => prev.filter((p) => p._id !== id));

  return {
    posts,
    hasMore,
    loading,
    loadingMore,
    error,
    loadMore: () => load(page + 1),
    reload: () => load(1),
    addPost,
    updatePost,
    removePost,
  };
}
