import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import CreatePost from "../components/CreatePost";
import PostList from "../components/PostList";
import Suggestions from "../components/Suggestions";
import EmptyState from "../components/EmptyState";

export default function Feed() {
  const feed = usePosts("/posts/feed");

  return (
    <div className="flex gap-6">
      <div className="min-w-0 flex-1 space-y-4">
        <h1 className="text-xl font-extrabold">Home</h1>
        <CreatePost onCreated={feed.addPost} />
        <PostList
          {...feed}
          empty={
            <EmptyState icon={Users} title="Your feed is empty" text="Follow people to see their posts here, or share your first post above.">
              <Link to="/explore" className="btn-primary">Explore people</Link>
            </EmptyState>
          }
        />
      </div>
      <aside className="hidden w-72 shrink-0 lg:block xl:w-80">
        <div className="sticky top-5">
          <Suggestions />
        </div>
      </aside>
    </div>
  );
}
