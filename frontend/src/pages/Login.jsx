import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AuthShell from "./AuthShell";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await login(form.identifier, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to see what's happening."
      footer={
        <>
          New to Pulse?{" "}
          <Link to="/register" className="font-semibold text-brand-500 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="identifier">Email or username</label>
          <input id="identifier" className="input" value={form.identifier} onChange={set("identifier")} required autoComplete="username" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" value={form.password} onChange={set("password")} required autoComplete="current-password" />
        </div>
        <button type="submit" disabled={busy} className="btn-primary w-full py-3">
          {busy ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
