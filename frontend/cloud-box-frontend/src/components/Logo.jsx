import { Box } from 'lucide-react';

export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white dark:bg-blue-500">
        <Box size={18} strokeWidth={2.25} />
      </span>
      <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        Cloud Box
      </span>
    </div>
  );
}
