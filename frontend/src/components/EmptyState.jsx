export default function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-brand-50 p-4 text-brand-500 dark:bg-brand-500/10">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="text-lg font-bold">{title}</h3>
      {text && <p className="muted mt-1 max-w-sm text-sm">{text}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
