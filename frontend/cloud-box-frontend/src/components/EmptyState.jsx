import { FolderOpen } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500">
        <FolderOpen size={22} />
      </span>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
        Nenhum arquivo por aqui ainda
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Envie seu primeiro arquivo usando a área acima.
      </p>
    </div>
  );
}
