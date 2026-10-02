import { Link } from "react-router-dom";

// Split-screen wrapper used by Login and Register
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-500 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-orange-400/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-rose-700/50 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2 text-2xl font-extrabold text-white">
          <span className="rounded-xl bg-white/20 p-1.5">
            <svg viewBox="0 0 32 32" className="h-7 w-7">
              <path d="M5 17h5l3-7 5 13 3-6h6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Pulse
        </Link>
        <div className="relative text-white">
          <h2 className="text-5xl leading-tight font-extrabold">
            Share moments.
            <br />
            Follow people.
            <br />
            Feel the pulse.
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/80">
            Post updates, like and comment on what matters, and build your circle.
          </p>
        </div>
        <p className="relative text-sm text-white/70">Built with MongoDB, Express, React and Node.js</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <img src="/favicon.svg" alt="" className="mb-6 h-10 w-10 lg:hidden" />
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            <p className="muted mt-1">{subtitle}</p>
          </div>
          {children}
          <p className="muted mt-6 text-center text-sm">{footer}</p>
        </div>
      </div>
    </div>
  );
}
