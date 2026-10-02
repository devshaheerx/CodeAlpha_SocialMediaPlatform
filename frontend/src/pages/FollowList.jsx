import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import api, { getErrorMessage } from "../api/axios";
import UserCard from "../components/UserCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";

// /u/:username/followers and /u/:username/following
export default function FollowList({ type }) {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setUsers(null);
    api
      .get(`/users/${username}`)
      .then(async (res) => {
        setProfile(res.data.user);
        const list = await api.get(`/users/${res.data.user._id}/${type}`);
        setUsers(list.data.users);
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, [username, type]);

  const tab = ({ isActive }) =>
    `flex-1 border-b-2 py-3 text-center text-sm font-semibold transition ${
      isActive ? "border-brand-500" : "muted border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
    }`;

  if (error) return <EmptyState title="User not found" text={error} />;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg leading-tight font-extrabold">{profile?.name || "..."}</h1>
          <p className="muted text-xs">@{username}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex border-b border-zinc-100 dark:border-zinc-800">
          <NavLink to={`/u/${username}/followers`} className={tab}>Followers</NavLink>
          <NavLink to={`/u/${username}/following`} className={tab}>Following</NavLink>
        </div>
        <div className="p-2">
          {users === null ? (
            <Loader />
          ) : users.length === 0 ? (
            <EmptyState
              icon={Users}
              title={type === "followers" ? "No followers yet" : "Not following anyone yet"}
            />
          ) : (
            users.map((u) => <UserCard key={u._id} user={u} />)
          )}
        </div>
      </div>
    </div>
  );
}
