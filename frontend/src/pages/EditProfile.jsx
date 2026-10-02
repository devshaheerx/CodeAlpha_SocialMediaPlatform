import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef();

  const pick = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) return toast.error("Image must be smaller than 2 MB");
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setRemoveAvatar(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const form = new FormData();
      form.append("name", name.trim());
      form.append("bio", bio);
      if (file) form.append("avatar", file);
      if (removeAvatar) form.append("removeAvatar", "true");
      const res = await api.put("/users/me", form);
      updateUser(res.data.user);
      toast.success("Profile updated");
      navigate(`/u/${user.username}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const shownAvatar = removeAvatar ? { ...user, avatar: "" } : preview ? { ...user, avatar: preview } : user;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-extrabold">Edit profile</h1>
      </div>

      <form onSubmit={submit} className="card space-y-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          <button type="button" onClick={() => fileRef.current?.click()} className="group relative rounded-full" aria-label="Change photo">
            <Avatar user={{ ...shownAvatar, name }} size="xl" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition group-hover:opacity-100">
              <Camera className="h-6 w-6" />
            </span>
          </button>
          <div className="space-y-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline whitespace-nowrap">
              Change photo
            </button>
            {(user.avatar || preview) && !removeAvatar && (
              <button
                type="button"
                onClick={() => {
                  setRemoveAvatar(true);
                  setFile(null);
                  setPreview("");
                }}
                className="block text-sm text-red-600 hover:underline"
              >
                Remove photo
              </button>
            )}
            <p className="muted text-xs">JPG, PNG or WEBP, up to 2 MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
        </div>

        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} required maxLength={50} />
        </div>

        <div>
          <label className="label" htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            className="input resize-none"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 160))}
            placeholder="Tell people a little about yourself"
          />
          <p className="muted mt-1 text-right text-xs">{bio.length}/160</p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
          <button type="submit" disabled={busy || !name.trim()} className="btn-primary py-2.5 sm:py-2">
            {busy ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
