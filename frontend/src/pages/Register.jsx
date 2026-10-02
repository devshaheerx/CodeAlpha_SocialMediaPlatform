import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AuthShell from "./AuthShell";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const usernameValid = /^[a-zA-Z0-9_]{3,20}$/.test(form.username);

  const submit = async (e) => {
    e.preventDefault();
    if (!usernameValid) return toast.error("Username must be 3-20 letters, numbers or underscores");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setBusy(true);
    try {
      await register(form);
      toast.success("Account created! Follow a few people to fill your feed.");
      navigate("/explore", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Pulse in less than a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-500 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" className="input" value={form.name} onChange={set("name")} required maxLength={50} />
        </div>
        <div>
          <label className="label" htmlFor="username">Username</label>
          <div className="relative">
            <span className="muted absolute top-1/2 left-4 -translate-y-1/2 text-sm">@</span>
            <input id="username" className="input pl-8" value={form.username} onChange={set("username")} required maxLength={20} />
          </div>
          {form.username && !usernameValid && (
            <p className="mt-1 text-xs text-brand-600">3-20 characters: letters, numbers and underscores only</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" value={form.email} onChange={set("email")} required autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" value={form.password} onChange={set("password")} required minLength={6} autoComplete="new-password" />
        </div>
        <button type="submit" disabled={busy} className="btn-primary w-full py-3">
          {busy ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </AuthShell>
  );
}
