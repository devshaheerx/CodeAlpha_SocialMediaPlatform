import { Loader2 } from "lucide-react";

export default function Loader({ full = false }) {
  return (
    <div className={`flex items-center justify-center ${full ? "min-h-screen" : "py-10"}`}>
      <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
    </div>
  );
}

export function PostSkeleton() {
  return (
    <div className="card animate-pulse p-4">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
