import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, Compass, Home, LogOut, Moon, Sun, User } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Avatar from "./Avatar";

// Logo; `compact` hides the word "Pulse" below the xl breakpoint (icon rail)
function Logo({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight" aria-label="Pulse home">
      <img src="/favicon.svg" alt="" className="h-8 w-8" />
      <span className={compact ? "hidden xl:inline" : ""}>Pulse</span>
    </Link>
  );
}

/*
  Responsive layout:
  - < 768px  (phones):          top bar + bottom tab bar
  - 768-1279 (tablets/laptops): slim icon-only sidebar (more room for content)
  - >= 1280  (desktops):        full sidebar with labels
  Pages add a "Who to follow" column from 1024px up.
*/
export default function Layout() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  // Poll unread notification count every 30s (and when the route changes)
  useEffect(() => {
    const fetchCount = () =>
      api
        .get("/notifications/unread-count")
        .then((r) => setUnread(r.data.unreadCount))
        .catch(() => {});
    fetchCount();
    const id = setInterval(fetchCount, 30000);
    return () => clearInterval(id);
  }, [location.pathname]);

  // Scroll to top on page change (important on mobile)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const links = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/notifications", label: "Notifications", icon: Bell, badge: unread },
    { to: `/u/${user.username}`, label: "Profile", icon: User },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const sideItem = (isActive) =>
    `flex items-center justify-center gap-4 rounded-full p-3 text-[15px] transition hover:bg-zinc-100 xl:justify-start xl:px-4 dark:hover:bg-zinc-800/70 ${
      isActive ? "font-bold text-zinc-900 dark:text-white" : "font-medium text-zinc-600 dark:text-zinc-400"
    }`;

  const Badge = ({ n }) =>
    n > 0 && (
      <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
        {n > 9 ? "9+" : n}
      </span>
    );

  return (
    <div className="mx-auto flex max-w-7xl">
      {/* Sidebar: icon rail on tablets, full on desktop */}
      <aside className="sticky top-0 hidden h-screen w-20 shrink-0 flex-col justify-between border-r border-zinc-200 px-3 py-4 md:flex xl:w-64 xl:px-4 dark:border-zinc-800">
        <div>
          <div className="mb-6 flex justify-center pt-2 xl:justify-start xl:px-4">
            <Logo compact />
          </div>
          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon, end, badge }) => (
              <NavLink key={to} to={to} end={end} title={label} className={({ isActive }) => sideItem(isActive)}>
                <span className="relative">
                  <Icon className="h-6 w-6" />
                  <Badge n={badge} />
                </span>
                <span className="hidden xl:inline">{label}</span>
              </NavLink>
            ))}
            <button onClick={toggle} title="Toggle theme" className={sideItem(false) + " w-full cursor-pointer"}>
              {dark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              <span className="hidden xl:inline">{dark ? "Light mode" : "Dark mode"}</span>
            </button>
          </nav>
        </div>

        <div className="flex flex-col items-center gap-2 xl:flex-row xl:gap-3 xl:p-2">
          <Link to={`/u/${user.username}`} title="Your profile">
            <Avatar user={user} />
          </Link>
          <div className="hidden min-w-0 flex-1 xl:block">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="muted truncate text-xs">@{user.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="muted cursor-pointer rounded-full p-2 hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-zinc-50/90 px-4 py-3 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-950/90">
          <Logo />
          <div className="flex items-center gap-1">
            <button onClick={toggle} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Toggle theme">
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button onClick={handleLogout} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Log out">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="px-3 py-4 pb-24 sm:px-4 sm:py-5 md:px-6 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav (respects iPhone home-indicator area) */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-zinc-200 bg-white/95 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-900/95">
        {links.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium ${
                isActive ? "text-brand-500" : "text-zinc-500 dark:text-zinc-400"
              }`
            }
          >
            <span className="relative">
              <Icon className="h-6 w-6" />
              {badge > 0 && <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white dark:ring-zinc-900" />}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
