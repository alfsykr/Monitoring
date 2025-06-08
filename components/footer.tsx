export const Footer = () => {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-8 p-4 bg-card/30 rounded-lg border border-border/50">
      <p className="text-base font-medium text-slate-900 dark:text-slate-50">© 2025 M. Alfi Syukri</p>
      <div className="flex flex-wrap gap-x-2">
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Universitas Negeri Jakarta
        </a>
      </div>
    </footer>
  );
};