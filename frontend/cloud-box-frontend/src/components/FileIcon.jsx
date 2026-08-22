import {
  FileText,
  FileImage,
  FileSpreadsheet,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  File,
} from 'lucide-react';
import { getFileExtension } from '../utils/formatters';

// Cada família de extensão recebe um ícone e uma cor de "etiqueta" própria,
// funcionando como um pequeno sistema de identidade visual para o
// gerenciador de arquivos — sem depender de miniaturas reais.
const MAP = {
  pdf: { icon: FileText, color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400' },
  doc: { icon: FileText, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400' },
  docx: { icon: FileText, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400' },
  txt: { icon: FileText, color: 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300' },
  xls: { icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
  xlsx: { icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
  csv: { icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
  png: { icon: FileImage, color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400' },
  jpg: { icon: FileImage, color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400' },
  jpeg: { icon: FileImage, color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400' },
  gif: { icon: FileImage, color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400' },
  svg: { icon: FileImage, color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400' },
  mp4: { icon: FileVideo, color: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400' },
  mov: { icon: FileVideo, color: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400' },
  mp3: { icon: FileAudio, color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400' },
  wav: { icon: FileAudio, color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400' },
  zip: { icon: FileArchive, color: 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300' },
  rar: { icon: FileArchive, color: 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300' },
  json: { icon: FileCode, color: 'text-teal-600 bg-teal-50 dark:bg-teal-500/10 dark:text-teal-400' },
  js: { icon: FileCode, color: 'text-teal-600 bg-teal-50 dark:bg-teal-500/10 dark:text-teal-400' },
  java: { icon: FileCode, color: 'text-teal-600 bg-teal-50 dark:bg-teal-500/10 dark:text-teal-400' },
};

const DEFAULT = { icon: File, color: 'text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-400' };

export default function FileIcon({ nome, size = 20 }) {
  const ext = getFileExtension(nome);
  const { icon: Icon, color } = MAP[ext] ?? DEFAULT;

  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
      <Icon size={size} strokeWidth={2} />
    </span>
  );
}
