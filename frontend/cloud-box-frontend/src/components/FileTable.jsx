import { useState } from 'react';
import { Download, Pencil, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import FileIcon from './FileIcon';
import Modal from './Modal';
import EmptyState from './EmptyState';
import { formatBytes, formatDate } from '../utils/formatters';
import { downloadArquivo, deletarArquivo, renomearArquivo } from '../services/fileService';
import { getErrorMessage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function FileTable({ arquivos, loading, onChanged }) {
  const { userId } = useAuth();
  const [downloadingId, setDownloadingId] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null); // arquivo sendo renomeado
  const [newName, setNewName] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // arquivo a excluir
  const [deleting, setDeleting] = useState(false);

  async function handleDownload(arquivo) {
    setDownloadingId(arquivo._key);
    try {
      await downloadArquivo(userId, arquivo.nome);
    } catch (error) {
      toast.error(getErrorMessage(error, `Não foi possível baixar "${arquivo.nome}".`));
    } finally {
      setDownloadingId(null);
    }
  }

  function openRename(arquivo) {
    setRenameTarget(arquivo);
    setNewName(arquivo.nome);
  }

  async function confirmRename() {
    if (!renameTarget || !newName.trim() || newName === renameTarget.nome) {
      setRenameTarget(null);
      return;
    }
    setRenaming(true);
    try {
      await renomearArquivo(userId, renameTarget.nome, newName.trim());
      toast.success('Arquivo renomeado com sucesso!');
      setRenameTarget(null);
      onChanged?.();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível renomear o arquivo.'));
    } finally {
      setRenaming(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deletarArquivo(deleteTarget.nome, userId);
      toast.success('Arquivo excluído.');
      setDeleteTarget(null);
      onChanged?.();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível excluir o arquivo.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 size={18} className="animate-spin" />
          Carregando arquivos...
        </div>
      ) : arquivos.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Tamanho</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Enviado em</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {arquivos.map((arquivo) => (
                <tr key={arquivo._key} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileIcon nome={arquivo.nome} />
                      <span className="truncate font-medium text-slate-900 dark:text-slate-50">
                        {arquivo.nome}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {formatBytes(arquivo.tamanho)}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 sm:table-cell dark:text-slate-400">
                    {formatDate(arquivo.dataUpload)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleDownload(arquivo)}
                        disabled={downloadingId === arquivo._key}
                        title="Baixar"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
                      >
                        {downloadingId === arquivo._key ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => openRename(arquivo)}
                        title="Renomear"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(arquivo)}
                        title="Excluir"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de renomear */}
      <Modal open={Boolean(renameTarget)} onClose={() => setRenameTarget(null)} title="Renomear arquivo">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && confirmRename()}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setRenameTarget(null)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmRename}
            disabled={renaming}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {renaming && <Loader2 size={14} className="animate-spin" />}
            Salvar
          </button>
        </div>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Excluir arquivo">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Tem certeza que deseja excluir{' '}
          <span className="font-medium text-slate-900 dark:text-slate-50">"{deleteTarget?.nome}"</span>?
          Essa ação não pode ser desfeita.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {deleting && <Loader2 size={14} className="animate-spin" />}
            Excluir
          </button>
        </div>
      </Modal>
    </div>
  );
}
