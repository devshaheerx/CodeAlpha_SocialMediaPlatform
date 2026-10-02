import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-extrabold text-brand-500">404</p>
      <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
      <p className="muted mt-1">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">Go home</Link>
    </div>
  );
}
