import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import UploadArea from '../components/UploadArea';
import FileTable from '../components/FileTable';
import { listarArquivos } from '../services/fileService';
import { getErrorMessage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { userId } = useAuth();
  const [arquivos, setArquivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchArquivos = useCallback(async () => {
    setLoading(true);
    try {
      const lista = await listarArquivos(userId);
      setArquivos(lista);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível carregar seus arquivos.'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchArquivos();
  }, [fetchArquivos]);

  const filtrados = arquivos.filter((a) => a.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Meus arquivos</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {arquivos.length} {arquivos.length === 1 ? 'arquivo armazenado' : 'arquivos armazenados'}
          </p>
        </div>

        <div className="mb-8">
          <UploadArea onUploaded={fetchArquivos} />
        </div>

        <div className="mb-3 flex items-center justify-between gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
          />
          <button
            type="button"
            onClick={fetchArquivos}
            title="Atualizar lista"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <FileTable arquivos={filtrados} loading={loading} onChanged={fetchArquivos} />
      </main>
    </div>
  );
}
