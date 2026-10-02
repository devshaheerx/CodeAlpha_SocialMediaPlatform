import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import FollowButton from "./FollowButton";

export default function UserCard({ user, compact = false }) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800/60">
      <Link to={`/u/${user.username}`} className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar user={user} size={compact ? "sm" : "md"} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="muted truncate text-xs">@{user.username}</p>
          {!compact && user.bio && (
            <p className="mt-0.5 line-clamp-1 text-xs text-zinc-600 dark:text-zinc-400">{user.bio}</p>
          )}
        </div>
      </Link>
      <FollowButton targetUser={user} size="sm" />
    </div>
  );
}
