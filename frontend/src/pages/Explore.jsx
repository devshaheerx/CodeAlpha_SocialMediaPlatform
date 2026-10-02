import { useEffect, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import api from "../api/axios";
import usePosts from "../hooks/usePosts";
import PostList from "../components/PostList";
import UserCard from "../components/UserCard";
import Suggestions from "../components/Suggestions";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";

export default function Explore() {
  const explore = usePosts("/posts/explore");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);

  // Debounced user search
  useEffect(() => {
    const q = query.trim();
    if (!q) return setResults(null);
    setSearching(true);
    const t = setTimeout(() => {
      api
        .get("/users/search", { params: { q } })
        .then((res) => setResults(res.data.users))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="flex gap-6">
      <div className="min-w-0 flex-1 space-y-4">
        <h1 className="text-xl font-extrabold">Explore</h1>

        <div className="relative">
          <Search className="muted absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people"
            aria-label="Search people by name or username"
            className="input rounded-full py-3 pl-11"
          />
        </div>

        {query.trim() ? (
          <div className="card p-2">
            {searching ? (
              <Loader />
            ) : results?.length ? (
              results.map((u) => <UserCard key={u._id} user={u} />)
            ) : (
              <p className="muted py-8 text-center text-sm">No users found for "{query}"</p>
            )}
          </div>
        ) : (
          <>
            <div className="lg:hidden">
              <Suggestions />
            </div>
            <h2 className="muted pt-2 text-sm font-semibold tracking-wide uppercase">Latest from everyone</h2>
            <PostList
              {...explore}
              empty={<EmptyState icon={Sparkles} title="No posts yet" text="Be the first to share something!" />}
            />
          </>
        )}
      </div>
      <aside className="hidden w-72 shrink-0 lg:block xl:w-80">
        <div className="sticky top-5">
          <Suggestions />
        </div>
      </aside>
    </div>
  );
}
