import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import api from "../api/axios";
import Avatar from "../components/Avatar";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import { timeAgo } from "../utils/format";

const meta = {
  like: { icon: Heart, color: "text-brand-500 bg-brand-50 dark:bg-brand-500/10", text: "liked your post" },
  comment: { icon: MessageCircle, color: "text-sky-500 bg-sky-50 dark:bg-sky-500/10", text: "commented on your post" },
  follow: { icon: UserPlus, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10", text: "started following you" },
};

export default function Notifications() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api
      .get("/notifications")
      .then((res) => {
        setItems(res.data.notifications);
        // Mark as read after showing them (unread ones stay highlighted this visit)
        if (res.data.unreadCount > 0) api.put("/notifications/read").catch(() => {});
      })
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-extrabold">Notifications</h1>

      {items === null ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" text="When people like, comment on your posts or follow you, you'll see it here." />
      ) : (
        <ul className="card divide-y divide-zinc-100 overflow-hidden dark:divide-zinc-800">
          {items.map((n) => {
            const m = meta[n.type];
            const Icon = m.icon;
            const to = n.type === "follow" || !n.post ? `/u/${n.sender.username}` : `/post/${n.post._id}`;
            return (
              <li key={n._id}>
                <Link
                  to={to}
                  className={`flex gap-3 p-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
                    !n.read ? "bg-brand-50/60 dark:bg-brand-500/5" : ""
                  }`}
                >
                  <span className={`h-fit rounded-full p-2 ${m.color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Avatar user={n.sender} size="sm" />
                    <p className="mt-2 text-sm">
                      <span className="font-semibold">{n.sender.name}</span> {m.text}
                      <span className="muted"> · {timeAgo(n.createdAt)}</span>
                    </p>
                    {n.post?.text && <p className="muted mt-1 line-clamp-2 text-sm">{n.post.text}</p>}
                  </div>
                  {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
