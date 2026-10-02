const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-base", xl: "h-24 w-24 text-2xl" };

// Shows the user's photo, or their initials on a colored circle
export default function Avatar({ user, size = "md", className = "" }) {
  const cls = `${sizes[size]} shrink-0 rounded-full object-cover ${className}`;
  if (user?.avatar) return <img src={user.avatar} alt={user.name} className={cls} />;

  const initials = (user?.name || user?.username || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={`${cls} flex items-center justify-center bg-gradient-to-br from-brand-400 to-orange-400 font-bold text-white`}>
      {initials}
    </div>
  );
}
