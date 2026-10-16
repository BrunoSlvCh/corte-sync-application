import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Scissors } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import { useToast } from "../../context/ToastContext";
import { formatBRL } from "../../utils/format";
import {
  listarServicos,
  criarServico,
  alterarNomeServico,
  alterarPrecoServico,
  alterarDuracaoServico,
  alterarCategoriaServico,
  deletarServico,
} from "../../api/servicos";

const emptyForm = { nomeServico: "", precoServico: "", duracaoServico: "", categoria: "", status: true };

export default function AdminServicos() {
  const toast = useToast();
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    listarServicos()
      .then(setServicos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setForm(emptyForm);
    setCreateOpen(true);
  }

  function openEdit(servico) {
    setEditTarget(servico);
    setForm({
      nomeServico: servico.nomeServico,
      precoServico: servico.precoServico,
      duracaoServico: servico.duracaoServico,
      categoria: servico.categoria,
      status: servico.status,
    });
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await criarServico({
        ...form,
        precoServico: parseFloat(form.precoServico),
        duracaoServico: parseInt(form.duracaoServico, 10),
      });
      toast.success("Serviço criado com sucesso!");
      setCreateOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const original = editTarget;
      const nomeAtual = original.nomeServico;

      if (form.categoria !== original.categoria) {
        await alterarCategoriaServico(nomeAtual, form.categoria);
      }
      if (parseFloat(form.precoServico) !== parseFloat(original.precoServico)) {
        await alterarPrecoServico(nomeAtual, parseFloat(form.precoServico));
      }
      if (parseInt(form.duracaoServico, 10) !== original.duracaoServico) {
        await alterarDuracaoServico(nomeAtual, parseInt(form.duracaoServico, 10));
      }
      if (form.nomeServico !== original.nomeServico) {
        await alterarNomeServico(nomeAtual, form.nomeServico);
      }

      toast.success("Serviço atualizado com sucesso!");
      setEditTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deletarServico(deleteTarget.nomeServico);
      toast.success("Serviço removido com sucesso!");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-cream">Serviços</h1>
          <p className="mt-1 text-sm text-muted">Gerencie os serviços oferecidos na sua barbearia.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Adicionar serviço
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface">
        {loading && <p className="p-6 text-sm text-muted">Carregando...</p>}
        {error && <p className="p-6 text-sm text-danger">{error}</p>}

        {!loading && !error && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Duração</th>
                <th className="px-6 py-3 font-medium">Preço</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((s) => (
                <tr key={s.nomeServico} className="border-b border-border/60 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 text-gold">
                        <Scissors className="h-4 w-4" />
                      </span>
                      <span className="font-medium text-cream">{s.nomeServico}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-cream/70">{s.duracaoServico} min</td>
                  <td className="px-6 py-4 text-cream/70">{formatBRL(s.precoServico)}</td>
                  <td className="px-6 py-4">
                    <Badge tone={s.status ? "success" : "danger"}>
                      {s.status ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-3 hover:text-gold"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-3 hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {servicos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted">
                    Nenhum serviço cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Adicionar serviço">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nome do serviço"
            placeholder="Ex: Corte Masculino"
            value={form.nomeServico}
            onChange={(e) => setForm((f) => ({ ...f, nomeServico: e.target.value }))}
            required
          />
          <Input
            label="Duração (minutos)"
            type="number"
            placeholder="Ex: 30"
            value={form.duracaoServico}
            onChange={(e) => setForm((f) => ({ ...f, duracaoServico: e.target.value }))}
            required
          />
          <Input
            label="Preço (R$)"
            type="number"
            step="0.01"
            placeholder="Ex: 40.00"
            value={form.precoServico}
            onChange={(e) => setForm((f) => ({ ...f, precoServico: e.target.value }))}
            required
          />
          <Input
            label="Categoria"
            placeholder="Ex: Corte"
            value={form.categoria}
            onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
            required
          />
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Status</span>
            <select
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
              value={form.status ? "true" : "false"}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value === "true" }))}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </label>
          <Button type="submit" className="w-full" loading={saving}>
            Salvar
          </Button>
        </form>
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Editar serviço">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Nome do serviço"
            value={form.nomeServico}
            onChange={(e) => setForm((f) => ({ ...f, nomeServico: e.target.value }))}
            required
          />
          <Input
            label="Duração (minutos)"
            type="number"
            value={form.duracaoServico}
            onChange={(e) => setForm((f) => ({ ...f, duracaoServico: e.target.value }))}
            required
          />
          <Input
            label="Preço (R$)"
            type="number"
            step="0.01"
            value={form.precoServico}
            onChange={(e) => setForm((f) => ({ ...f, precoServico: e.target.value }))}
            required
          />
          <Input
            label="Categoria"
            value={form.categoria}
            onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
            required
          />
          <p className="text-xs text-muted">
            O status ativo/inativo não pode ser alterado por esta API após a criação do serviço.
          </p>
          <Button type="submit" className="w-full" loading={saving}>
            Salvar alterações
          </Button>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remover serviço">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/15 text-danger">
            <Trash2 className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm text-cream">
            Tem certeza que deseja remover <strong>"{deleteTarget?.nomeServico}"</strong>?
          </p>
          <p className="mt-1 text-xs text-muted">Esta ação não poderá ser desfeita.</p>
          <div className="mt-6 flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="danger" className="flex-1" loading={saving} onClick={handleDelete}>
              Remover
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
