import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

const MAX = 500;

export default function CreatePost({ onCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef();

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) return toast.error("Image must be smaller than 2 MB");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const clearFile = () => {
    setFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("text", text.trim());
      if (file) form.append("image", file);
      const res = await api.post("/posts", form);
      onCreated?.(res.data.post);
      setText("");
      clearFile();
      toast.success("Posted!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remaining = MAX - text.length;

  return (
    <form onSubmit={submit} className="card p-4">
      <div className="flex gap-3">
        <Avatar user={user} />
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            placeholder="What's happening?"
            rows={2}
            className="w-full resize-none bg-transparent pt-2 text-[15px] outline-none placeholder:text-zinc-400"
          />
          {preview && (
            <div className="relative mt-2 inline-block">
              <img src={preview} alt="Preview" className="max-h-72 rounded-xl border border-zinc-200 dark:border-zinc-800" />
              <button
                type="button"
                onClick={clearFile}
                className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-full p-2 text-brand-500 transition hover:bg-brand-50 dark:hover:bg-brand-500/10"
              aria-label="Add image"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickFile} />
            <div className="flex items-center gap-3">
              {text.length > 0 && (
                <span className={`text-xs ${remaining < 50 ? "text-brand-500" : "muted"}`}>{remaining}</span>
              )}
              <button type="submit" disabled={busy || (!text.trim() && !file)} className="btn-primary">
                {busy ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
