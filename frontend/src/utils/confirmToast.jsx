import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

/*
  In-app confirmation shown as a notification (replaces the browser's confirm()).
  Usage:  if (!(await confirmToast({ title: "Delete this post?" }))) return;
  Resolves true when the user clicks the confirm button, false on Cancel or timeout.
*/
export default function confirmToast({
  title,
  message = "This can't be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
} = {}) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (id, value) => {
      if (settled) return;
      settled = true;
      toast.dismiss(id);
      resolve(value);
    };

    const id = toast.custom(
      (t) => (
        <div
          role="alertdialog"
          aria-label={title}
          className={`w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900 ${
            t.visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <div className="flex gap-3">
            <span className="h-fit rounded-full bg-red-50 p-2 text-red-600 dark:bg-red-500/10">
              <Trash2 className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
              {message && <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{message}</p>}
              <div className="mt-3 flex justify-end gap-2">
                <button onClick={() => finish(t.id, false)} className="btn-outline px-4 py-1.5" autoFocus>
                  {cancelText}
                </button>
                <button
                  onClick={() => finish(t.id, true)}
                  className="btn bg-red-600 px-4 py-1.5 text-white hover:bg-red-700"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: 10000, id: `confirm-${Date.now()}` }
    );

    // If the user ignores it, treat it as "Cancel" when it disappears
    setTimeout(() => finish(id, false), 10000);
  });
}