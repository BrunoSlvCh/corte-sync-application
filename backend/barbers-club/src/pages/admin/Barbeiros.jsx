import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import { useToast } from "../../context/ToastContext";
import {
  listarBarbeiros,
  criarBarbeiro,
  alterarDescricaoBarbeiro,
  alterarFotoBarbeiro,
  deletarBarbeiro,
} from "../../api/barbeiros";

const emptyForm = { nome: "", descricao: "", urlFoto: "", status: true };

export default function AdminBarbeiros() {
  const toast = useToast();
  const [barbeiros, setBarbeiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    listarBarbeiros()
      .then(setBarbeiros)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setForm(emptyForm);
    setCreateOpen(true);
  }

  function openEdit(barbeiro) {
    setEditTarget(barbeiro);
    setForm({
      nome: barbeiro.nome,
      descricao: barbeiro.descricao || "",
      urlFoto: barbeiro.urlFoto || "",
      status: true,
    });
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await criarBarbeiro(form);
      toast.success("Barbeiro cadastrado com sucesso!");
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
      if (form.descricao !== editTarget.descricao) {
        await alterarDescricaoBarbeiro(editTarget.id, form.descricao);
      }
      if (form.urlFoto !== editTarget.urlFoto) {
        await alterarFotoBarbeiro(editTarget.id, form.urlFoto);
      }
      toast.success("Barbeiro atualizado com sucesso!");
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
      await deletarBarbeiro(deleteTarget.id);
      toast.success("Barbeiro removido com sucesso!");
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
          <h1 className="font-display text-2xl font-semibold text-cream">Barbeiros</h1>
          <p className="mt-1 text-sm text-muted">Gerencie os barbeiros da sua barbearia.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Cadastrar barbeiro
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
                <th className="px-6 py-3 font-medium">Descrição</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {barbeiros.map((b) => (
                <tr key={b.id} className="border-b border-border/60 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 text-gold">
                        <User className="h-4 w-4" />
                      </span>
                      <span className="font-medium text-cream">{b.nome}</span>
                    </div>
                  </td>
                  <td className="max-w-xs truncate px-6 py-4 text-cream/70">{b.descricao}</td>
                  <td className="px-6 py-4">
                    <Badge tone="success">Ativo</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(b)}
                        className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-3 hover:text-gold"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(b)}
                        className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-3 hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {barbeiros.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-muted">
                    Nenhum barbeiro cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Cadastrar barbeiro">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nome do barbeiro"
            placeholder="Ex: Lucas Ferreira"
            value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            required
          />
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Descrição</span>
            <textarea
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
              rows={3}
              placeholder="Especialista em degradê e cortes modernos..."
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              required
            />
          </label>
          <Input
            label="URL da foto"
            placeholder="https://..."
            value={form.urlFoto}
            onChange={(e) => setForm((f) => ({ ...f, urlFoto: e.target.value }))}
            required
          />
          <Button type="submit" className="w-full" loading={saving}>
            Salvar
          </Button>
        </form>
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Editar barbeiro">
        <form onSubmit={handleEdit} className="space-y-4">
          <p className="text-sm text-muted">
            Nome de <strong className="text-cream">{editTarget?.nome}</strong> não pode ser
            alterado por esta API — apenas descrição e foto.
          </p>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Descrição</span>
            <textarea
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
              rows={3}
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              required
            />
          </label>
          <Input
            label="URL da foto"
            value={form.urlFoto}
            onChange={(e) => setForm((f) => ({ ...f, urlFoto: e.target.value }))}
            required
          />
          <Button type="submit" className="w-full" loading={saving}>
            Salvar alterações
          </Button>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remover barbeiro">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/15 text-danger">
            <Trash2 className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm text-cream">
            Tem certeza que deseja remover <strong>{deleteTarget?.nome}</strong>?
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
