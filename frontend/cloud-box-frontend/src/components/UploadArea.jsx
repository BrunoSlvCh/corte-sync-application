import { useCallback, useRef, useState } from 'react';
import { UploadCloud, X, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadArquivo } from '../services/fileService';
import { getErrorMessage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { MAX_FILE_SIZE_BYTES } from '../utils/constants';
import { formatBytes } from '../utils/formatters';

// status: 'uploading' | 'done' | 'error'
let queueId = 0;

export default function UploadArea({ onUploaded }) {
  const { userId } = useAuth();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [queue, setQueue] = useState([]);

  const handleFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      files.forEach((file) => {
        const id = ++queueId;

        // Validação local do limite de 50MB — o mesmo limite configurado
        // no backend (spring.servlet.multipart.max-file-size). Evita
        // gastar tempo enviando um arquivo que o backend vai rejeitar
        // com 413 Payload Too Large.
        if (file.size > MAX_FILE_SIZE_BYTES) {
          toast.error(
            `"${file.name}" (${formatBytes(file.size)}) excede o limite de ${formatBytes(
              MAX_FILE_SIZE_BYTES
            )} por arquivo.`
          );
          setQueue((prev) => [...prev, { id, name: file.name, progress: 0, status: 'error' }]);
          return;
        }

        setQueue((prev) => [...prev, { id, name: file.name, progress: 0, status: 'uploading' }]);

        uploadArquivo(userId, file, (percent) => {
          setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, progress: percent } : q)));
        })
          .then(() => {
            setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'done', progress: 100 } : q)));
            toast.success(`"${file.name}" enviado com sucesso!`);
            onUploaded?.();
            // Remove da fila visível após um pequeno intervalo.
            setTimeout(() => {
              setQueue((prev) => prev.filter((q) => q.id !== id));
            }, 2500);
          })
          .catch((error) => {
            setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'error' } : q)));

            const status = error?.response?.status;
            if (status === 413) {
              toast.error(`"${file.name}" excede o limite de ${formatBytes(MAX_FILE_SIZE_BYTES)} permitido pelo servidor.`);
            } else {
              // Cobre 409 (arquivo duplicado), 400, 500, etc. — usa a
              // mensagem real que o backend devolveu.
              toast.error(getErrorMessage(error, `Falha ao enviar "${file.name}".`));
            }
          });
      });
    },
    [userId, onUploaded]
  );

  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragging
            ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-500/10'
            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <UploadCloud size={22} />
        </span>
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
            Arraste arquivos aqui ou clique para selecionar
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Envie um ou mais arquivos para o seu Cloud Box · até {formatBytes(MAX_FILE_SIZE_BYTES)} por arquivo
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {queue.length > 0 && (
        <ul className="mt-4 space-y-2">
          {queue.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-200">{item.name}</span>

              {item.status === 'uploading' && (
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all dark:bg-blue-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
              {item.status === 'done' && <CheckCircle2 size={18} className="text-emerald-500" />}
              {item.status === 'error' && <AlertCircle size={18} className="text-rose-500" />}

              {item.status !== 'uploading' && (
                <button
                  type="button"
                  onClick={() => setQueue((prev) => prev.filter((q) => q.id !== item.id))}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Remover da lista"
                >
                  <X size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
