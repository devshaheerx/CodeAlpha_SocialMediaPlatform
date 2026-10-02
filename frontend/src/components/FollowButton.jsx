import { useState } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Follow / Unfollow toggle with optimistic UI
export default function FollowButton({ targetUser, onChange, size = "md" }) {
  const { user, updateUser } = useAuth();
  const [following, setFollowing] = useState(targetUser.isFollowing);
  const [busy, setBusy] = useState(false);
  const [hover, setHover] = useState(false);

  if (!user || user._id === targetUser._id) return null;

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    const next = !following;
    setFollowing(next);
    setBusy(true);
    try {
      const res = await api.post(`/users/${targetUser._id}/follow`);
      setFollowing(res.data.isFollowing);
      updateUser({ followingCount: user.followingCount + (res.data.isFollowing ? 1 : -1) });
      onChange?.(res.data);
    } catch (err) {
      setFollowing(!next); // revert
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const pad = size === "sm" ? "px-3 py-1 text-xs !min-w-[4.75rem] shrink-0" : "";
  return following ? (
    <button
      onClick={toggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`btn-outline ${pad} min-w-24 hover:border-red-300 hover:text-red-600 dark:hover:border-red-900`}
    >
      {hover ? "Unfollow" : "Following"}
    </button>
  ) : (
    <button onClick={toggle} className={`btn-primary ${pad} min-w-24`}>
      Follow
    </button>
  );
}
