import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, ArrowLeft, Camera } from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { alterarNome, alterarEmail, alterarTelefone, alterarSenha } from "../../api/usuarios";
import { alterarFotoPorUsuarioId } from "../../api/barbeiros";

export default function Perfil() {
  const { auth } = useAuth();
  const toast = useToast();

  return (
    <div className="min-h-screen bg-ink">
      <PublicNavbar />

      <section className="mx-auto max-w-2xl px-6 py-12">
        <Link to="/inicio" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <h1 className="font-display text-2xl font-semibold text-cream">Meu perfil</h1>
        <p className="mt-1 text-sm text-muted">Atualize os dados da sua conta.</p>

        <div className="mt-8 space-y-6">
          {auth.isBarbeiro && <FotoForm idUsuario={auth.id} toast={toast} />}
          <NomeForm idUsuario={auth.id} toast={toast} />
          <EmailForm idUsuario={auth.id} toast={toast} />
          <TelefoneForm idUsuario={auth.id} toast={toast} />
          <SenhaForm idUsuario={auth.id} toast={toast} />
        </div>
      </section>
    </div>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-display text-base font-semibold text-cream">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function FotoForm({ idUsuario, toast }) {
  const [urlFoto, setUrlFoto] = useState("");
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await alterarFotoPorUsuarioId(idUsuario, urlFoto);
      toast.success("Foto atualizada com sucesso!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card icon={Camera} title="Foto de perfil">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-4">
          {urlFoto && !failed ? (
            <img
              src={urlFoto}
              alt=""
              onError={() => setFailed(true)}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-3 text-gold">
              <User className="h-6 w-6" />
            </span>
          )}
          <div className="flex-1">
            <Input
              label="URL da foto"
              placeholder="https://..."
              value={urlFoto}
              onChange={(e) => {
                setUrlFoto(e.target.value);
                setFailed(false);
              }}
              required
            />
          </div>
        </div>
        <Button type="submit" loading={loading}>
          Salvar
        </Button>
      </form>
    </Card>
  );
}

function NomeForm({ idUsuario, toast }) {
  const [novoNome, setNovoNome] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await alterarNome(idUsuario, novoNome);
      toast.success("Nome alterado com sucesso!");
      setNovoNome("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card icon={User} title="Nome">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <Input
          label="Novo nome"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          className="flex-1 min-w-[200px]"
          required
        />
        <Button type="submit" loading={loading}>
          Salvar
        </Button>
      </form>
    </Card>
  );
}

function EmailForm({ idUsuario, toast }) {
  const [emailAntigo, setEmailAntigo] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await alterarEmail(idUsuario, emailAntigo, novoEmail);
      toast.success("E-mail alterado com sucesso!");
      setEmailAntigo("");
      setNovoEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card icon={Mail} title="E-mail">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="E-mail atual"
          type="email"
          icon={Mail}
          value={emailAntigo}
          onChange={(e) => setEmailAntigo(e.target.value)}
          required
        />
        <Input
          label="Novo e-mail"
          type="email"
          icon={Mail}
          value={novoEmail}
          onChange={(e) => setNovoEmail(e.target.value)}
          required
        />
        <Button type="submit" loading={loading}>
          Salvar
        </Button>
      </form>
    </Card>
  );
}

function TelefoneForm({ idUsuario, toast }) {
  const [telefoneAntigo, setTelefoneAntigo] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await alterarTelefone(idUsuario, telefoneAntigo, novoTelefone);
      toast.success("Telefone alterado com sucesso!");
      setTelefoneAntigo("");
      setNovoTelefone("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card icon={Phone} title="Telefone">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Telefone atual"
          type="tel"
          icon={Phone}
          value={telefoneAntigo}
          onChange={(e) => setTelefoneAntigo(e.target.value)}
          required
        />
        <Input
          label="Novo telefone"
          type="tel"
          icon={Phone}
          value={novoTelefone}
          onChange={(e) => setNovoTelefone(e.target.value)}
          required
        />
        <Button type="submit" loading={loading}>
          Salvar
        </Button>
      </form>
    </Card>
  );
}

function SenhaForm({ idUsuario, toast }) {
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await alterarSenha(idUsuario, senhaAntiga, novaSenha);
      toast.success("Senha alterada com sucesso!");
      setSenhaAntiga("");
      setNovaSenha("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card icon={Lock} title="Senha">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Senha atual"
          type="password"
          icon={Lock}
          value={senhaAntiga}
          onChange={(e) => setSenhaAntiga(e.target.value)}
          minLength={6}
          required
        />
        <Input
          label="Nova senha"
          type="password"
          icon={Lock}
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          minLength={6}
          required
        />
        <Button type="submit" loading={loading}>
          Salvar
        </Button>
      </form>
    </Card>
  );
}
