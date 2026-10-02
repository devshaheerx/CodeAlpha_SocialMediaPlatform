import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, FileText } from "lucide-react";
import api, { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import usePosts from "../hooks/usePosts";
import Avatar from "../components/Avatar";
import FollowButton from "../components/FollowButton";
import CreatePost from "../components/CreatePost";
import PostList from "../components/PostList";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import { formatCount } from "../utils/format";

export default function Profile() {
  const { username } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setProfile(null);
    setError("");
    api
      .get(`/users/${username}`)
      .then((res) => setProfile(res.data.user))
      .catch((err) => setError(getErrorMessage(err)));
  }, [username]);

  const posts = usePosts(profile ? `/posts/user/${profile._id}` : null);
  const isMe = profile && me._id === profile._id;
  // Keep my own header in sync after editing profile
  const shown = isMe ? { ...profile, ...me } : profile;

  if (error) {
    return (
      <EmptyState title="User not found" text={`We couldn't find @${username}.`}>
        <Link to="/explore" className="btn-primary">Back to Explore</Link>
      </EmptyState>
    );
  }
  if (!profile) return <Loader />;

  const joined = new Date(shown.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => history.back()} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg leading-tight font-extrabold">{shown.name}</h1>
          <p className="muted text-xs">Profile</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand-500 via-rose-400 to-orange-300 sm:h-40" />
        <div className="px-5 pb-5">
          <div className="-mt-12 flex items-end justify-between">
            <Avatar user={shown} size="xl" className="ring-4 ring-white dark:ring-zinc-900" />
            {isMe ? (
              <Link to="/settings/profile" className="btn-outline">Edit profile</Link>
            ) : (
              <FollowButton
                key={profile._id}
                targetUser={profile}
                onChange={(r) => setProfile((p) => ({ ...p, isFollowing: r.isFollowing, followersCount: r.followersCount }))}
              />
            )}
          </div>

          <h2 className="mt-3 text-xl font-extrabold">{shown.name}</h2>
          <p className="muted text-sm">@{shown.username}</p>
          {shown.bio && <p className="mt-3 whitespace-pre-wrap">{shown.bio}</p>}
          <p className="muted mt-3 flex items-center gap-1.5 text-sm">
            <CalendarDays className="h-4 w-4" /> Joined {joined}
          </p>

          <div className="mt-3 flex gap-5 text-sm">
            <Link to={`/u/${shown.username}/following`} className="hover:underline">
              <span className="font-bold">{formatCount(shown.followingCount)}</span> <span className="muted">Following</span>
            </Link>
            <Link to={`/u/${shown.username}/followers`} className="hover:underline">
              <span className="font-bold">{formatCount(profile.followersCount)}</span> <span className="muted">Followers</span>
            </Link>
          </div>
        </div>
      </div>

      {isMe && <CreatePost onCreated={posts.addPost} />}

      <h3 className="muted pt-2 text-sm font-semibold tracking-wide uppercase">Posts</h3>
      <PostList
        {...posts}
        empty={
          <EmptyState
            icon={FileText}
            title={isMe ? "You haven't posted yet" : "No posts yet"}
            text={isMe ? "Share your first update with your followers." : `@${shown.username} hasn't posted anything.`}
          />
        }
      />
    </div>
  );
}
