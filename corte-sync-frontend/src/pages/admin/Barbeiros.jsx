import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, User, ChevronLeft, ChevronRight, Check } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import { useToast } from "../../context/ToastContext";
import { IMAGES } from "../../utils/images";
import {
  listarBarbeiros,
  criarBarbeiro,
  alterarDescricaoBarbeiro,
  alterarStatusBarbeiro,
  deletarBarbeiro,
} from "../../api/barbeiros";

const emptyCreateForm = {
  nome: "",
  email: "",
  senha: "",
  telefone: "",
  descricao: "",
  urlFoto: "",
  status: true,
};

const STEPS = ["Conta", "Perfil", "Confirmar"];

export default function AdminBarbeiros() {
  const toast = useToast();
  const [barbeiros, setBarbeiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editForm, setEditForm] = useState({ descricao: "" });
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  function load() {
    setLoading(true);
    listarBarbeiros()
      .then(setBarbeiros)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setCreateForm(emptyCreateForm);
    setCreateStep(1);
    setCreateOpen(true);
  }

  function openEdit(barbeiro) {
    setEditTarget(barbeiro);
    setEditForm({ descricao: barbeiro.descricao || "" });
  }

  function updateCreateForm(patch) {
    setCreateForm((f) => ({ ...f, ...patch }));
  }

  const step1Valid = createForm.nome.trim() && createForm.email.trim() && createForm.senha.trim().length >= 6 && createForm.telefone.trim();

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await criarBarbeiro(createForm);
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
      if (editForm.descricao !== editTarget.descricao) {
        await alterarDescricaoBarbeiro(editTarget.id, editForm.descricao);
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

  async function handleToggleStatus(barbeiro) {
    setTogglingId(barbeiro.id);
    try {
      await alterarStatusBarbeiro(barbeiro.id, !barbeiro.status);
      toast.success(`Barbeiro marcado como ${!barbeiro.status ? "Ativo" : "Inativo"}.`);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <AdminLayout>
      <div className="relative overflow-hidden rounded-xl border border-border">
        <img src={IMAGES.adminBarbeiros} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(11,14,20,0.92) 30%, rgba(11,14,20,0.55) 100%)" }}
        />
        <div className="relative flex flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-cream">Barbeiros</h1>
            <p className="mt-1 text-sm text-muted">Gerencie os barbeiros da sua barbearia.</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Cadastrar barbeiro
          </Button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
        {loading && <p className="p-6 text-sm text-muted">Carregando...</p>}
        {error && <p className="p-6 text-sm text-danger">{error}</p>}

        {!loading && !error && (
          <table className="w-full min-w-[640px] text-left text-sm">
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
                      <BarberAvatar urlFoto={b.urlFoto} />
                      <span className="font-medium text-cream">{b.nome}</span>
                    </div>
                  </td>
                  <td className="max-w-xs truncate px-6 py-4 text-cream/70">{b.descricao}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(b)}
                      disabled={togglingId === b.id}
                      className="disabled:opacity-50"
                      title="Clique para alternar o status"
                    >
                      <Badge tone={b.status ? "success" : "danger"}>
                        {b.status ? "Ativo" : "Inativo"}
                      </Badge>
                    </button>
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

      {/* Create modal — step by step */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Cadastrar barbeiro" width="max-w-lg">
        <MiniStepper steps={STEPS} current={createStep} />

        <form onSubmit={handleCreate} className="mt-6">
          {createStep === 1 && (
            <div className="space-y-4">
              <Input
                label="Nome do barbeiro"
                placeholder="Ex: Lucas Ferreira"
                value={createForm.nome}
                onChange={(e) => updateCreateForm({ nome: e.target.value })}
                required
              />
              <Input
                label="E-mail"
                type="email"
                placeholder="lucas@corte-sync.com"
                value={createForm.email}
                onChange={(e) => updateCreateForm({ email: e.target.value })}
                required
              />
              <Input
                label="Senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={createForm.senha}
                onChange={(e) => updateCreateForm({ senha: e.target.value })}
                minLength={6}
                required
              />
              <Input
                label="Telefone"
                type="tel"
                placeholder="(11) 98765-4321"
                value={createForm.telefone}
                onChange={(e) => updateCreateForm({ telefone: e.target.value })}
                required
              />
            </div>
          )}

          {createStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 p-3">
                <BarberAvatar urlFoto={createForm.urlFoto} size="h-12 w-12" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cream">{createForm.nome || "Novo barbeiro"}</p>
                  <p className="truncate text-xs text-muted">{createForm.email}</p>
                </div>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">Descrição</span>
                <textarea
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
                  rows={3}
                  placeholder="Especialista em degradê e cortes modernos..."
                  value={createForm.descricao}
                  onChange={(e) => updateCreateForm({ descricao: e.target.value })}
                />
              </label>
              <Input
                label="URL da foto"
                placeholder="https://..."
                value={createForm.urlFoto}
                onChange={(e) => updateCreateForm({ urlFoto: e.target.value })}
              />
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">Status</span>
                <select
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
                  value={createForm.status ? "true" : "false"}
                  onChange={(e) => updateCreateForm({ status: e.target.value === "true" })}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </label>
            </div>
          )}

          {createStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-2 p-4">
                <BarberAvatar urlFoto={createForm.urlFoto} size="h-16 w-16" />
                <div className="min-w-0">
                  <p className="truncate font-display text-lg text-cream">{createForm.nome}</p>
                  <p className="truncate text-sm text-muted">{createForm.email}</p>
                  <Badge tone={createForm.status ? "success" : "danger"} className="mt-2">
                    {createForm.status ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <SummaryRow label="Telefone" value={createForm.telefone || "—"} />
                <SummaryRow label="Descrição" value={createForm.descricao || "—"} />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between border-t border-border pt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCreateStep((s) => Math.max(1, s - 1))}
              disabled={createStep === 1}
            >
              <ChevronLeft className="h-4 w-4" /> Voltar
            </Button>

            {createStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCreateStep((s) => s + 1)}
                disabled={createStep === 1 && !step1Valid}
              >
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" loading={saving}>
                Cadastrar barbeiro
              </Button>
            )}
          </div>
        </form>
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title={`Editar ${editTarget?.nome ?? "barbeiro"}`}>
        <form onSubmit={handleEdit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Descrição</span>
            <textarea
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
              rows={3}
              value={editForm.descricao}
              onChange={(e) => setEditForm((f) => ({ ...f, descricao: e.target.value }))}
              required
            />
          </label>
          <p className="text-xs text-muted">
            A foto de perfil agora é gerenciada pelo próprio barbeiro, na tela "Meu perfil" dele.
          </p>
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

function MiniStepper({ steps, current }) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "current" : "upcoming";
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                  state === "done"
                    ? "border-gold bg-gold text-ink"
                    : state === "current"
                    ? "border-gold text-gold"
                    : "border-border text-muted"
                }`}
              >
                {state === "done" ? <Check className="h-3.5 w-3.5" /> : n}
              </div>
              <span className={`text-[11px] ${state === "upcoming" ? "text-muted" : "text-cream"}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-3 mb-4 h-px w-10 sm:w-16 ${n < current ? "bg-gold" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-2">
      <span className="shrink-0 text-muted">{label}</span>
      <span className="text-right text-cream/90">{value}</span>
    </div>
  );
}

function BarberAvatar({ urlFoto, size = "h-8 w-8" }) {
  const [failed, setFailed] = useState(false);

  if (urlFoto && !failed) {
    return (
      <img
        src={urlFoto}
        alt=""
        onError={() => setFailed(true)}
        className={`${size} rounded-full object-cover`}
      />
    );
  }

  return (
    <span className={`flex ${size} items-center justify-center rounded-full bg-surface-3 text-gold`}>
      <User className="h-4 w-4" />
    </span>
  );
}
