import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Search, 
  Plus, 
  Ban, 
  Trash2, 
  RefreshCw, 
  Eye, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  User, 
  Calendar, 
  Check, 
  AlertTriangle, 
  Mail, 
  History,
  FileText,
  BookOpen,
  Edit,
  Sparkles,
  Palette,
  Layout,
  Send,
  RotateCcw,
  Code,
  Maximize2,
  Smartphone,
  Monitor,
  X
} from "lucide-react";

import { safeJson } from "../utils/apiHelper";

interface AdminPanelProps {
  sessionToken: string;
  onClose: () => void;
  currentUser: any;
}

export default function AdminPanel({ sessionToken, onClose, currentUser }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"users" | "manual" | "webhooks" | "email_template" | "verses" | "tutorial">("users");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dashboard states
  const [users, setUsers] = useState<any[]>([]);
  const [entitlements, setEntitlements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeEntitlements: 0, totalEvents: 0 });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Email Template states
  const [emailTemplate, setEmailTemplate] = useState<{
    subject: string;
    headerTitle: string;
    headerSubtitle: string;
    bodyGreeting: string;
    bodyText: string;
    buttonText: string;
    footerText: string;
    accentColor: string;
    theme: "dark" | "light" | "modern";
  }>({
    subject: "🎉 Seu Acesso Foi Liberado: Credenciais de Entrada para {{produto}}",
    headerTitle: "Bem-vindo(a), {{nome}}!",
    headerSubtitle: "Sua conta foi criada e está pronta para uso na plataforma.",
    bodyGreeting: "Olá, {{nome}}!",
    bodyText: "Você recebeu acesso exclusivo à plataforma. Abaixo estão suas credenciais de login para entrar na sua conta com total segurança:",
    buttonText: "🚀 Entrar na Plataforma Agora",
    footerText: "Este é um e-mail automático enviado pelo sistema de membros. Se tiver dúvidas, entre em contato com o suporte.",
    accentColor: "#f59e0b",
    theme: "dark"
  });
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Verses states
  const [versesList, setVersesList] = useState<any[]>([]);
  const [versesConfig, setVersesConfig] = useState<any | null>(null);
  const [editingVerse, setEditingVerse] = useState<{ id: string | null; reference: string; theme: string; text: string } | null>(null);

  // Manual Grant Form state
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualProductId, setManualProductId] = useState("infoprodutos_master_v1");
  const [manualOfferId, setManualOfferId] = useState("");
  const [manualOrderId, setManualOrderId] = useState("");
  const [manualExpiresAt, setManualExpiresAt] = useState("");
  const [manualCustomPassword, setManualCustomPassword] = useState("");
  const [manualNotes, setManualNotes] = useState("Liberado manualmente via painel do administrador");

  // Credentials Modal state
  const [generatedCredentialsModal, setGeneratedCredentialsModal] = useState<{
    name: string;
    email: string;
    password?: string;
    code?: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Selected webhook for detail view
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Fetch admin dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard", {
        headers: {
          "x-session-token": sessionToken
        }
      });
      const data = await safeJson(res);
      setUsers(data.users || []);
      setEntitlements(data.entitlements || []);
      setEvents(data.events || []);
      setStats(data.stats || { totalUsers: 0, activeEntitlements: 0, totalEvents: 0 });
    } catch (err: any) {
      setError(err.message || "Erro de rede ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVersesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/verses");
      const data = await safeJson(res);
      setVersesList(data.verses || []);
      setVersesConfig(data.config || null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar versículos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailTemplate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/email-template", {
        headers: { "x-session-token": sessionToken }
      });
      const data = await safeJson(res);
      if (data.template) {
        setEmailTemplate(data.template);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar template de e-mail.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmailTemplate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingTemplate(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/email-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken
        },
        body: JSON.stringify(emailTemplate)
      });
      const data = await safeJson(res);
      setSuccess(data.message || "Template de e-mail atualizado com sucesso!");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar template de e-mail.");
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleSendTestEmail = async () => {
    setSendingTestEmail(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/email-template/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken
        },
        body: JSON.stringify({ testEmail: testEmailAddress })
      });
      const data = await safeJson(res);
      setSuccess(data.message || "E-mail de teste disparado com sucesso!");
    } catch (err: any) {
      setError(err.message || "Erro ao disparar e-mail de teste.");
    } finally {
      setSendingTestEmail(false);
    }
  };

  const handleResetEmailTemplate = () => {
    setEmailTemplate({
      subject: "🎉 Seu Acesso Foi Liberado: Credenciais de Entrada para {{produto}}",
      headerTitle: "Bem-vindo(a), {{nome}}!",
      headerSubtitle: "Sua conta foi criada e está pronta para uso na plataforma.",
      bodyGreeting: "Olá, {{nome}}!",
      bodyText: "Você recebeu acesso exclusivo à plataforma. Abaixo estão suas credenciais de login para entrar na sua conta com total segurança:",
      buttonText: "🚀 Entrar na Plataforma Agora",
      footerText: "Este é um e-mail automático enviado pelo sistema de membros. Se tiver dúvidas, entre em contato com o suporte.",
      accentColor: "#f59e0b",
      theme: "dark"
    });
    setSuccess("Valores restaurados para o padrão original. Clique em Salvar para confirmar.");
  };

  const renderPreviewValue = (templateText: string) => {
    if (!templateText) return "";
    return templateText
      .replace(/{{\s*nome\s*}}/gi, "Maria Silva")
      .replace(/{{\s*login\s*}}/gi, "maria.silva@exemplo.com")
      .replace(/{{\s*email\s*}}/gi, "maria.silva@exemplo.com")
      .replace(/{{\s*senha\s*}}/gi, "Membro#2026!Key")
      .replace(/{{\s*codigo\s*}}/gi, "749201")
      .replace(/{{\s*produto\s*}}/gi, "Infoprodutos Master")
      .replace(/{{\s*link_acesso\s*}}/gi, typeof window !== "undefined" ? window.location.origin : "https://minhaplataforma.com");
  };

  useEffect(() => {
    if (activeTab === "verses") {
      fetchVersesData();
    } else if (activeTab === "email_template") {
      fetchEmailTemplate();
    } else {
      fetchDashboardData();
    }
  }, [sessionToken, activeTab]);

  // Handle Manual Grant Access
  const handleManualGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail || !manualName) {
      setError("Nome e e-mail de compra são obrigatórios.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/entitlements/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken
        },
        body: JSON.stringify({
          name: manualName,
          email: manualEmail,
          product_id: manualProductId,
          offer_id: manualOfferId || null,
          order_id: manualOrderId || null,
          expires_at: manualExpiresAt || null,
          notes: manualNotes,
          custom_password: manualCustomPassword || null
        })
      });

      const data = await safeJson(res);

      setSuccess(data.message || "Aluno cadastrado e e-mail enviado com sucesso!");

      if (data.credentials) {
        setGeneratedCredentialsModal({
          name: manualName,
          email: data.credentials.email,
          password: data.credentials.password,
          code: data.credentials.code
        });
      }

      // Reset form fields
      setManualName("");
      setManualEmail("");
      setManualOfferId("");
      setManualOrderId("");
      setManualExpiresAt("");
      setManualCustomPassword("");
      setManualNotes("Liberado manualmente via painel do administrador");
      
      // Refresh dashboard list immediately so user is visible in table
      await fetchDashboardData();
    } catch (err: any) {
      setError(err.message || "Erro ao realizar liberação.");
    } finally {
      setLoading(false);
    }
  };

  // Re-send access credentials email to user
  const handleResendAccess = async (email: string, userName?: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/users/resend-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken
        },
        body: JSON.stringify({ email })
      });

      const data = await safeJson(res);
      setSuccess(data.message || `Acesso reenviado por e-mail para ${email}`);

      if (data.credentials) {
        setGeneratedCredentialsModal({
          name: userName || email.split("@")[0],
          email: data.credentials.email,
          password: data.credentials.password,
          code: data.credentials.code
        });
      }

      await fetchDashboardData();
    } catch (err: any) {
      setError(err.message || "Erro ao reenviar dados de acesso.");
    } finally {
      setLoading(false);
    }
  };

  // Handle manual revocation
  const handleRevokeAccess = async (email: string) => {
    const reason = window.prompt("Motivo para revogar o acesso deste usuário:");
    if (reason === null) return; // cancelled

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/entitlements/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken
        },
        body: JSON.stringify({
          email,
          reason: reason || "Revogado administrativamente pelo painel"
        })
      });

      const data = await safeJson(res);

      setSuccess(data.message);
      fetchDashboardData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Force Session Terminate (kill sharing)
  const handleTerminateSessions = async (userId: string) => {
    if (!window.confirm("Deseja realmente derrubar todas as sessões ativas deste usuário? Ele será desconectado imediatamente.")) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/sessions/terminate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken
        },
        body: JSON.stringify({ user_id: userId })
      });

      const data = await safeJson(res);

      setSuccess(data.message);
      fetchDashboardData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save verses config
  const handleSaveVersesConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!versesConfig) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/verses/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken
        },
        body: JSON.stringify(versesConfig)
      });
      const data = await safeJson(res);
      setSuccess("Configurações de versículos atualizadas com sucesso!");
      setVersesConfig(data.config);
      
      // Notify active components immediately
      const { notifyVersesConfigChanged } = await import("./FloatingVerses");
      notifyVersesConfigChanged();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar configuração.");
    } finally {
      setLoading(false);
    }
  };

  // Save/Add single verse
  const handleSaveVerse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVerse) return;
    if (!editingVerse.reference || !editingVerse.text) {
      setError("Referência e texto do versículo são obrigatórios.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const url = editingVerse.id ? `/api/admin/verses/${editingVerse.id}` : "/api/admin/verses";
      const method = editingVerse.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-session-token": sessionToken
        },
        body: JSON.stringify({
          reference: editingVerse.reference,
          theme: editingVerse.theme,
          text: editingVerse.text
        })
      });

      const data = await safeJson(res);

      setSuccess(editingVerse.id ? "Versículo atualizado com sucesso!" : "Versículo adicionado com sucesso!");
      setEditingVerse(null);
      fetchVersesData();
      
      const { notifyVersesConfigChanged } = await import("./FloatingVerses");
      notifyVersesConfigChanged();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar versículo.");
    } finally {
      setLoading(false);
    }
  };

  // Delete single verse
  const handleDeleteVerse = async (id: string) => {
    if (!window.confirm("Deseja realmente remover este versículo?")) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/verses/${id}`, {
        method: "DELETE",
        headers: {
          "x-session-token": sessionToken
        }
      });

      const data = await safeJson(res);

      setSuccess("Versículo removido com sucesso!");
      fetchVersesData();
      
      const { notifyVersesConfigChanged } = await import("./FloatingVerses");
      notifyVersesConfigChanged();
    } catch (err: any) {
      setError(err.message || "Erro ao remover versículo.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered users search list
  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const isSuperAdmin = currentUser?.email?.toLowerCase().trim() === "ativadordamente7@gmail.com";

  if (!isSuperAdmin) {
    return (
      <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-4 max-w-lg mx-auto shadow-2xl my-12">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-bold text-white">Acesso Restrito ao Administrador</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Este painel e todas as funções internas do sistema são de acesso exclusivo do administrador cadastrado internamente (<strong className="text-amber-400">ativadordamente7@gmail.com</strong>). Nenhum outro e-mail tem permissão de acesso.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer border border-slate-700"
        >
          Voltar para a Ferramenta
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 relative min-h-[550px]">
      {/* Top Header Admin Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-slate-950 p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Shield className="w-5.5 h-5.5 font-bold" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2 flex-wrap">
              Painel de Administração
              <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">Acesso Restrito</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                Administrador: ativadordamente7@gmail.com
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Controle total do sistema: alunos, liberação manual, webhooks Kiwify, e-mails e configurações internas.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition text-xs flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Voltar para Ferramenta</span>
        </button>
      </div>

      {/* Global Alerts inside Admin */}
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex gap-2 items-start">
          <XCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex gap-2 items-start">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950/40 rounded-2xl p-4 border border-slate-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">Usuários Cadastrados</span>
            <strong className="text-2xl font-black text-white block mt-1">{stats.totalUsers}</strong>
          </div>
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
            <User className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-slate-950/40 rounded-2xl p-4 border border-slate-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">Acessos Ativos (Kiwify + Manual)</span>
            <strong className="text-2xl font-black text-emerald-400 block mt-1">{stats.activeEntitlements}</strong>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-slate-950/40 rounded-2xl p-4 border border-slate-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">Eventos de Webhook Recebidos</span>
            <strong className="text-2xl font-black text-amber-400 block mt-1">{stats.totalEvents}</strong>
          </div>
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
            <History className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Admin Sub Navigation Menu */}
      <div className="flex border-b border-slate-800 gap-1.5 scrollbar-none overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${activeTab === "users" ? "border-amber-500 text-amber-400 bg-slate-950/30" : "border-transparent text-slate-400 hover:text-white"}`}
        >
          <User className="w-4 h-4" />
          <span>Alunos & Acessos</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${activeTab === "manual" ? "border-amber-500 text-amber-400 bg-slate-950/30" : "border-transparent text-slate-400 hover:text-white"}`}
        >
          <Plus className="w-4 h-4" />
          <span>Liberar Manualmente</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("webhooks")}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${activeTab === "webhooks" ? "border-amber-500 text-amber-400 bg-slate-950/30" : "border-transparent text-slate-400 hover:text-white"}`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Histórico Webhooks</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("email_template")}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${activeTab === "email_template" ? "border-amber-500 text-amber-400 bg-slate-950/30" : "border-transparent text-slate-400 hover:text-white"}`}
        >
          <Mail className="w-4 h-4" />
          <span>Template de E-mail</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tutorial")}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${activeTab === "tutorial" ? "border-amber-500 text-amber-400 bg-slate-950/30" : "border-transparent text-slate-400 hover:text-white"}`}
        >
          <FileText className="w-4 h-4" />
          <span>Como Conectar Kiwify</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("verses")}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${activeTab === "verses" ? "border-amber-500 text-amber-400 bg-slate-950/30" : "border-transparent text-slate-400 hover:text-white"}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Versículos Bíblicos</span>
        </button>
      </div>

      {/* TAB CONTENT: USERS & ACCESS */}
      {activeTab === "users" && (
        <div className="flex flex-col gap-4 flex-1">
          {/* Search bar and refresh */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar usuário por nome ou e-mail de compra..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white p-2.5 rounded-xl border border-slate-800 transition flex items-center justify-center shrink-0 disabled:opacity-50"
              title="Recarregar dados"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-slate-950/50 rounded-2xl border border-slate-850 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-850 bg-slate-950/80 text-slate-400 font-semibold font-mono tracking-wider text-[10px] uppercase">
                    <th className="p-4">Dados do Aluno</th>
                    <th className="p-4">Produto & Compra</th>
                    <th className="p-4">Status Acesso</th>
                    <th className="p-4">Sessões Ativas</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                        Nenhum aluno encontrado correspondente à busca.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isUserAdmin = u.role === "admin" && u.email?.toLowerCase().trim() === "ativadordamente7@gmail.com";
                      const ent = u.entitlement;
                      const hasActive = isUserAdmin || (ent && ent.access_status === "active" && ent.purchase_status === "approved");

                      return (
                        <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-white text-sm flex items-center gap-1.5">
                                {u.name}
                                {isUserAdmin && (
                                  <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.2 rounded border border-red-500/20 font-mono">ADMIN</span>
                                )}
                              </span>
                              <span className="text-slate-500 text-[11px] font-mono">{u.email}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {isUserAdmin ? (
                              <span className="text-slate-400 italic">Bypass Administrativo</span>
                            ) : ent ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold font-mono text-[11px] text-slate-300 uppercase">{ent.product_id}</span>
                                <span className="text-[10px] text-slate-500 font-mono">Pedido: {ent.order_id} ({ent.source})</span>
                              </div>
                            ) : (
                              <span className="text-slate-600 italic">Sem compra registrada</span>
                            )}
                          </td>
                          <td className="p-4">
                            {hasActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                ATIVO
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono uppercase">
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                BLOQUEADO
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">{u.activeSessionsCount}</span>
                              {u.activeSessionsCount > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleTerminateSessions(u.id)}
                                  className="text-orange-400 hover:text-orange-300 font-semibold text-[10px] underline hover:no-underline font-mono"
                                  title="Derrubar todas as sessões para evitar compartilhamento"
                                >
                                  Derrubar
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleResendAccess(u.email, u.name)}
                                disabled={loading}
                                className="bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/20 px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition disabled:opacity-50 shrink-0"
                                title="Reenviar e-mail com login e senha de acesso para o aluno"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Reenviar Credenciais</span>
                              </button>
                              {!isUserAdmin && ent && ent.access_status === "active" && (
                                <button
                                  type="button"
                                  onClick={() => handleRevokeAccess(u.email)}
                                  className="bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 p-1.5 rounded-lg transition"
                                  title="Revogar acesso deste aluno"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {isUserAdmin && (
                                <span className="text-slate-600 text-[10px] italic">Imune</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MANUAL LIBERATION */}
      {activeTab === "manual" && (
        <form onSubmit={handleManualGrantSubmit} className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 max-w-2xl">
          <div className="border-b border-slate-850 pb-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Plus className="w-4.5 h-4.5 text-amber-500" />
              Cadastrar Liberação Manual de Aluno
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">O usuário será registrado na base, cadastrado no sistema e receberá as credenciais (login, senha e código) por e-mail.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nome Completo do Aluno *</label>
              <input
                type="text"
                required
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">E-mail de Cadastro *</label>
              <input
                type="email"
                required
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                placeholder="Ex: joao@email.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Senha Personalizada de Acesso (Opcional)</label>
              <input
                type="text"
                value={manualCustomPassword}
                onChange={(e) => setManualCustomPassword(e.target.value)}
                placeholder="Deixe em branco para gerar automática"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">ID do Produto *</label>
              <input
                type="text"
                required
                value={manualProductId}
                onChange={(e) => setManualProductId(e.target.value)}
                placeholder="Ex: infoprodutos_master_v1"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">ID da Oferta (Opcional)</label>
              <input
                type="text"
                value={manualOfferId}
                onChange={(e) => setManualOfferId(e.target.value)}
                placeholder="Ex: oferta_lancamento"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">ID do Pedido (Opcional)</label>
              <input
                type="text"
                value={manualOrderId}
                onChange={(e) => setManualOrderId(e.target.value)}
                placeholder="Deixe em branco para gerar aleatório"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Data de Expiração (Opcional)</label>
              <input
                type="date"
                value={manualExpiresAt}
                onChange={(e) => setManualExpiresAt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Observações Internas / Motivo</label>
            <textarea
              rows={2}
              value={manualNotes}
              onChange={(e) => setManualNotes(e.target.value)}
              placeholder="Ex: Aluno de mentoria manual, liberado vitalício."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-2"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Adicionar Aluno Manualmente</span>
          </button>
        </form>
      )}

      {/* TAB CONTENT: WEBHOOK LOGS */}
      {activeTab === "webhooks" && (
        <div className="flex flex-col md:flex-row gap-6 flex-1">
          {/* List of events */}
          <div className="flex-1 max-h-[400px] overflow-y-auto bg-slate-950/50 rounded-2xl border border-slate-850 p-2 scrollbar-thin">
            <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold p-2 border-b border-slate-850 mb-2">Eventos Recebidos ({events.length})</h4>
            <div className="flex flex-col gap-1.5">
              {events.length === 0 ? (
                <div className="text-center text-slate-600 p-8 text-xs italic">Nenhum evento registrado ainda.</div>
              ) : (
                events.map(ev => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-3 ${selectedEventId === ev.id ? "bg-amber-500/10 border-amber-500/40 text-white" : "bg-slate-900/40 border-slate-850 hover:bg-slate-900 text-slate-300"}`}
                  >
                    <div className="flex flex-col gap-0.5 truncate">
                      <span className="font-mono text-[11px] truncate font-bold text-slate-200">ID: {ev.order_id}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Status: <strong className="text-slate-400">{ev.event_type}</strong> • {new Date(ev.created_at).toLocaleString("pt-BR")}</span>
                    </div>
                    <div>
                      {ev.processing_status === "success" ? (
                        <span className="text-emerald-400 font-bold text-[9px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">OK</span>
                      ) : (
                        <span className="text-rose-400 font-bold text-[9px] bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-mono">ERRO</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Details of selected event */}
          <div className="flex-1 bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col gap-3 min-h-[300px]">
            <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold border-b border-slate-850 pb-2 flex items-center justify-between">
              <span>Detalhes do Evento</span>
              {selectedEventId && <span className="text-[9px] font-mono text-slate-500">Hash MD5: {events.find(e => e.id === selectedEventId)?.payload_hash.substring(0,8)}...</span>}
            </h4>
            
            {selectedEventId ? (
              (() => {
                const ev = events.find(e => e.id === selectedEventId);
                if (!ev) return <div className="text-slate-500 text-xs italic">Evento não encontrado.</div>;
                return (
                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[350px]">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Identificador Externo:</span>
                        <strong className="text-white font-mono break-all">{ev.external_event_id}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Status Recebido:</span>
                        <strong className="text-amber-400 font-mono">{ev.event_type}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Código do Pedido:</span>
                        <strong className="text-white font-mono">{ev.order_id}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Processado em:</span>
                        <span className="text-slate-300 font-mono">{new Date(ev.processed_at).toLocaleString("pt-BR")}</span>
                      </div>
                    </div>

                    {ev.error_message && (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-mono">
                        <strong className="text-rose-300 block mb-0.5">Erro no Processamento:</strong>
                        {ev.error_message}
                      </div>
                    )}

                    <div className="flex-1 flex flex-col gap-1">
                      <span className="text-slate-500 text-[10px] block">Payload JSON Completo:</span>
                      <pre className="p-3 bg-slate-900 border border-slate-850 rounded-xl font-mono text-[10px] text-emerald-400 overflow-x-auto select-all max-h-[180px] leading-relaxed">
                        {JSON.stringify(ev.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-slate-600 text-xs italic">
                Selecione um evento de webhook da lista ao lado para inspecionar os detalhes do payload JSON.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: KIWIFY TUTORIAL */}
      {activeTab === "tutorial" && (
        <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 text-xs text-slate-300 max-w-3xl leading-relaxed">
          <div className="border-b border-slate-850 pb-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Mail className="w-4.5 h-4.5 text-amber-500" />
              Como Conectar sua Conta Kiwify (Tutorial Passo a Passo)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Siga as instruções abaixo para que as vendas liberem o acesso automaticamente aos seus alunos.</p>
          </div>

          <ol className="list-decimal list-inside flex flex-col gap-2.5 font-sans">
            <li>Acesse a sua conta administrativa na <a href="https://kiwify.com.br" target="_blank" rel="noopener" className="text-amber-400 underline hover:no-underline font-bold">Kiwify</a>.</li>
            <li>No menu lateral esquerdo, vá em <strong className="text-white font-semibold">"Apps"</strong> e selecione <strong className="text-white font-semibold">"Webhooks"</strong>.</li>
            <li>Clique no botão verde <strong className="text-white font-semibold">"Criar webhook"</strong> no canto superior direito.</li>
            <li>Insira um nome amigável como: <code className="bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded text-amber-400 font-mono text-[11px]">Liberador de Acesso Fábrica de Infoprodutos</code>.</li>
            <li>No campo <strong className="text-white font-semibold">URL do Webhook</strong>, preencha exatamente com a URL de produção da sua API:
              <pre className="bg-slate-950 p-2 border border-slate-850 rounded-xl font-mono text-emerald-400 text-[10px] mt-1 select-all break-all inline-block w-full">
                {`${window.location.origin}/functions/v1/kiwify-webhook`}
              </pre>
            </li>
            <li>Selecione o <strong className="text-white font-semibold">Produto</strong> que você quer vender e que deve liberar o acesso a esta ferramenta.</li>
            <li>No seletor de <strong className="text-white font-semibold">Eventos</strong>, marque obrigatoriamente:
              <ul className="list-disc list-inside pl-4 mt-1 font-mono text-[11px] text-slate-400 flex flex-col gap-0.5">
                <li>✓ Compra aprovada</li>
                <li>✓ Reembolsado (cancela acesso)</li>
                <li>✓ Chargeback (cancela acesso)</li>
                <li>✓ Assinatura cancelada (se usar modelo de assinatura)</li>
              </ul>
            </li>
            <li>No final da página de criação, você verá o campo <strong className="text-white font-semibold">Segredo (Token Secreto)</strong>. Copie o valor e cadastre-o na sua plataforma como a variável de ambiente:
              <code className="block bg-slate-950 border border-slate-850 p-2 rounded-xl text-amber-400 font-mono text-[10px] mt-1">KIWIFY_WEBHOOK_SECRET="seu_token_secreto_copiado"</code>
            </li>
            <li>Se você quiser restringir o acesso apenas a um ID de produto específico da sua conta Kiwify, cadastre o ID na variável de ambiente:
              <code className="block bg-slate-950 border border-slate-850 p-2 rounded-xl text-amber-400 font-mono text-[10px] mt-1">KIWIFY_ALLOWED_PRODUCT_IDS="ID_DO_SEU_PRODUTO_AQUI"</code>
              <span className="text-[10px] text-slate-500 mt-1 block">Dica: Se tiver mais de um, separe por vírgulas. Sem essa variável cadastrada, qualquer compra de qualquer produto na sua conta Kiwify integrada liberará o acesso.</span>
            </li>
            <li>Salve as configurações na Kiwify.</li>
            <li>Utilize o botão de <strong className="text-white font-semibold">"Testar Webhook"</strong> na Kiwify para simular uma compra aprovada de teste e observe se o evento aparece na guia "Histórico Webhooks" deste painel.</li>
          </ol>
        </div>
      )}

      {/* TAB CONTENT: EMAIL TEMPLATE EDITOR */}
      {activeTab === "email_template" && (
        <div className="flex flex-col gap-6 flex-1">
          {/* Header Description Card */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Mail className="w-4.5 h-4.5 text-amber-500" />
                Editor de Template de E-mail de Boas-Vindas & Acesso
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Personalize o assunto, textos, botões e paleta de cores do e-mail automático disparado ao cadastrar alunos ou reenviar credenciais.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowEmailPreviewModal(true)}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                title="Abrir visualização em tela cheia com dados preenchidos"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Preview Interativo</span>
              </button>
              <button
                type="button"
                onClick={handleResetEmailTemplate}
                className="bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                title="Restaurar padrão original"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Padrão</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveEmailTemplate()}
                disabled={savingTemplate}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-amber-500/10 disabled:opacity-50"
              >
                {savingTemplate ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Salvar Template</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: EDITOR FORM CONTROLS */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              
              {/* Dynamic Variables Legend Card */}
              <div className="bg-slate-950/60 border border-amber-500/20 rounded-2xl p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    Variáveis Dinâmicas do E-mail
                  </span>
                  <span className="text-[10px] text-slate-500">Clique para copiar o tag</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                  {[
                    { tag: "{{nome}}", label: "Nome do Aluno" },
                    { tag: "{{login}}", label: "E-mail / Login" },
                    { tag: "{{senha}}", label: "Senha Gerada" },
                    { tag: "{{codigo}}", label: "Código Acesso" },
                    { tag: "{{produto}}", label: "Infoproduto" },
                    { tag: "{{link_acesso}}", label: "Link do Sistema" }
                  ].map((v) => (
                    <button
                      key={v.tag}
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(v.tag);
                        setSuccess(`Variável ${v.tag} copiada para a área de transferência!`);
                        setTimeout(() => setSuccess(null), 3000);
                      }}
                      className="bg-slate-900 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 px-2.5 py-1 rounded-lg text-slate-300 hover:text-amber-300 transition flex items-center gap-1 text-[11px]"
                      title={`Copiar ${v.tag}`}
                    >
                      <span className="font-bold text-amber-400">{v.tag}</span>
                      <span className="text-[10px] text-slate-500 font-sans">({v.label})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Fields Form */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 text-xs text-slate-300">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-850 pb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-500" />
                  Textos da Mensagem
                </h4>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Assunto do E-mail (Subject)
                  </label>
                  <input
                    type="text"
                    value={emailTemplate.subject}
                    onChange={(e) => setEmailTemplate({ ...emailTemplate, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Título do Banner de Cabeçalho
                    </label>
                    <input
                      type="text"
                      value={emailTemplate.headerTitle}
                      onChange={(e) => setEmailTemplate({ ...emailTemplate, headerTitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Subtítulo do Cabeçalho
                    </label>
                    <input
                      type="text"
                      value={emailTemplate.headerSubtitle}
                      onChange={(e) => setEmailTemplate({ ...emailTemplate, headerSubtitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Saudação de Entrada (Greeting)
                  </label>
                  <input
                    type="text"
                    value={emailTemplate.bodyGreeting}
                    onChange={(e) => setEmailTemplate({ ...emailTemplate, bodyGreeting: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Mensagem de Boas-Vindas / Texto do Corpo
                  </label>
                  <textarea
                    rows={3}
                    value={emailTemplate.bodyText}
                    onChange={(e) => setEmailTemplate({ ...emailTemplate, bodyText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Texto do Botão de Acesso (CTA)
                    </label>
                    <input
                      type="text"
                      value={emailTemplate.buttonText}
                      onChange={(e) => setEmailTemplate({ ...emailTemplate, buttonText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Texto do Rodapé (Footer)
                    </label>
                    <input
                      type="text"
                      value={emailTemplate.footerText}
                      onChange={(e) => setEmailTemplate({ ...emailTemplate, footerText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Visual Styles & Colors Card */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 text-xs text-slate-300">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-850 pb-2 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-500" />
                  Aparência, Cores e Tema
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">
                      Cor de Destaque / Accent Button
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={emailTemplate.accentColor}
                        onChange={(e) => setEmailTemplate({ ...emailTemplate, accentColor: e.target.value })}
                        className="w-9 h-9 rounded-xl bg-transparent border border-slate-800 cursor-pointer shrink-0"
                      />
                      <div className="flex gap-1.5">
                        {[
                          { name: "Dourado", hex: "#f59e0b" },
                          { name: "Esmeralda", hex: "#10b981" },
                          { name: "Azul", hex: "#3b82f6" },
                          { name: "Rosa", hex: "#ec4899" },
                          { name: "Roxo", hex: "#8b5cf6" },
                          { name: "Laranja", hex: "#f97316" }
                        ].map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => setEmailTemplate({ ...emailTemplate, accentColor: c.hex })}
                            className={`w-6 h-6 rounded-full border transition transform hover:scale-110 ${emailTemplate.accentColor === c.hex ? "ring-2 ring-white border-transparent" : "border-slate-700"}`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">
                      Tema Visual do Card
                    </label>
                    <div className="flex gap-2">
                      {[
                        { id: "dark", label: "Escuro (Dark)" },
                        { id: "light", label: "Claro (Light)" },
                        { id: "modern", label: "Moderno (Navy)" }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setEmailTemplate({ ...emailTemplate, theme: t.id as any })}
                          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${emailTemplate.theme === t.id ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"}`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Email Dispatch Card */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex flex-col gap-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-amber-500" />
                  Testar Disparo em Caixa de Entrada Real
                </h4>
                <p className="text-[11px] text-slate-400">
                  Insira seu e-mail para receber um disparo de teste real e validar a entregabilidade e o layout na sua caixa de entrada.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="Seu e-mail para teste..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
                  />
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={sendingTestEmail}
                    className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                  >
                    {sendingTestEmail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Enviar E-mail de Teste</span>
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: REALTIME LIVE PREVIEW */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-500" />
                  Pré-visualização do E-mail em Tempo Real
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailPreviewModal(true)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 transition"
                    title="Expandir visualização em tela cheia"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Expandir</span>
                  </button>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                    Live
                  </span>
                </div>
              </div>

              {/* Email Client Simulator Container */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                {/* Email Client Header Bar */}
                <div className="bg-slate-950 border-b border-slate-800 p-3.5 flex flex-col gap-2 font-sans text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Caixa de Entrada Simulada</span>
                    <span className="text-[10px] text-slate-500 font-mono">Hoje, 14:32</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">De:</span>
                    <strong className="text-slate-200 block text-xs">Membros &lt;onboarding@resend.dev&gt;</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Assunto:</span>
                    <span className="text-amber-400 font-bold block text-xs break-words">
                      {renderPreviewValue(emailTemplate.subject)}
                    </span>
                  </div>
                </div>

                {/* Email Body Preview */}
                <div
                  className="p-6 overflow-y-auto max-h-[620px]"
                  style={{
                    backgroundColor: emailTemplate.theme === "light" ? "#f8fafc" : "#090d16",
                    color: emailTemplate.theme === "light" ? "#1e293b" : "#f8fafc"
                  }}
                >
                  <div
                    className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg border"
                    style={{
                      backgroundColor: emailTemplate.theme === "light" ? "#ffffff" : "#0f172a",
                      borderColor: emailTemplate.theme === "light" ? "#e2e8f0" : "#1e293b"
                    }}
                  >
                    {/* Header Banner */}
                    <div
                      className="p-6 text-center border-b"
                      style={{
                        background: emailTemplate.theme === "light"
                          ? "linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)"
                          : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                        borderColor: emailTemplate.theme === "light" ? "#e2e8f0" : "#1e293b"
                      }}
                    >
                      <div
                        className="inline-block rounded-xl px-3 py-1 mb-2 border text-[10px] font-extrabold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${emailTemplate.accentColor}15`,
                          borderColor: `${emailTemplate.accentColor}40`,
                          color: emailTemplate.accentColor
                        }}
                      >
                        Acesso Confirmado
                      </div>
                      <h2
                        className="text-lg font-extrabold"
                        style={{ color: emailTemplate.theme === "light" ? "#0f172a" : "#ffffff" }}
                      >
                        {renderPreviewValue(emailTemplate.headerTitle)}
                      </h2>
                      <p
                        className="text-xs mt-1"
                        style={{ color: emailTemplate.theme === "light" ? "#64748b" : "#94a3b8" }}
                      >
                        {renderPreviewValue(emailTemplate.headerSubtitle)}
                      </p>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 text-xs">
                      {emailTemplate.bodyGreeting && (
                        <p
                          className="font-bold text-sm mb-2"
                          style={{ color: emailTemplate.theme === "light" ? "#0f172a" : "#ffffff" }}
                        >
                          {renderPreviewValue(emailTemplate.bodyGreeting)}
                        </p>
                      )}
                      <p
                        className="leading-relaxed mb-4"
                        style={{ color: emailTemplate.theme === "light" ? "#475569" : "#cbd5e1" }}
                      >
                        {renderPreviewValue(emailTemplate.bodyText)}
                      </p>

                      {/* Credentials Box */}
                      <div
                        className="rounded-xl p-4 my-4 border font-mono"
                        style={{
                          backgroundColor: emailTemplate.theme === "light" ? "#f1f5f9" : "#020617",
                          borderColor: emailTemplate.theme === "light" ? "#cbd5e1" : "#334155"
                        }}
                      >
                        <div className="mb-3">
                          <span
                            className="text-[10px] uppercase font-bold block mb-0.5"
                            style={{ color: emailTemplate.theme === "light" ? "#64748b" : "#64748b" }}
                          >
                            Seu E-mail / Login:
                          </span>
                          <span
                            className="font-bold text-xs break-all"
                            style={{ color: emailTemplate.accentColor }}
                          >
                            maria.silva@exemplo.com
                          </span>
                        </div>

                        <div className="mb-3">
                          <span
                            className="text-[10px] uppercase font-bold block mb-0.5"
                            style={{ color: emailTemplate.theme === "light" ? "#64748b" : "#64748b" }}
                          >
                            Sua Senha Inicial de Acesso:
                          </span>
                          <span className="font-bold text-emerald-400 text-xs px-2 py-0.5 rounded border border-slate-700 bg-slate-900 inline-block">
                            Membro#2026!Key
                          </span>
                        </div>

                        <div>
                          <span
                            className="text-[10px] uppercase font-bold block mb-0.5"
                            style={{ color: emailTemplate.theme === "light" ? "#64748b" : "#64748b" }}
                          >
                            Código de Verificação:
                          </span>
                          <span className="font-bold text-cyan-400 text-xs px-2 py-0.5 rounded border border-slate-700 bg-slate-900 inline-block">
                            749201
                          </span>
                        </div>
                      </div>

                      {/* Button */}
                      <div className="text-center my-6">
                        <span
                          className="inline-block px-6 py-3 rounded-xl font-extrabold text-slate-950 text-xs shadow-md"
                          style={{ backgroundColor: emailTemplate.accentColor }}
                        >
                          {renderPreviewValue(emailTemplate.buttonText)}
                        </span>
                      </div>

                      <p
                        className="text-[10px] text-center italic"
                        style={{ color: emailTemplate.theme === "light" ? "#94a3b8" : "#64748b" }}
                      >
                        Dica de segurança: Recomendamos que você altere sua senha no seu primeiro login.
                      </p>
                    </div>

                    {/* Footer */}
                    <div
                      className="p-4 border-t text-center text-[10px]"
                      style={{
                        backgroundColor: emailTemplate.theme === "light" ? "#f1f5f9" : "#020617",
                        borderColor: emailTemplate.theme === "light" ? "#e2e8f0" : "#1e293b",
                        color: emailTemplate.theme === "light" ? "#64748b" : "#475569"
                      }}
                    >
                      {renderPreviewValue(emailTemplate.footerText)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BIBLICAL VERSES EXPERIENCE */}
      {activeTab === "verses" && (
        <div className="flex flex-col gap-6 flex-1">
          {/* 1. Global Configuration Card */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4">
            <div className="border-b border-slate-850 pb-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                Configurações Globais da Experiência Espiritual
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Defina quando, onde e como os versículos bíblicos serão exibidos para os alunos.</p>
            </div>

            {versesConfig && (
              <form onSubmit={handleSaveVersesConfig} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-300">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-850">
                    <div>
                      <span className="font-bold text-white block">Ativar Sistema de Versículos</span>
                      <span className="text-[10px] text-slate-500">Habilita ou desabilita globalmente em todo o sistema.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={versesConfig.active_all}
                      onChange={(e) => setVersesConfig({ ...versesConfig, active_all: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 bg-slate-950 border-slate-800 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-850 flex flex-col gap-2.5">
                    <span className="font-bold text-white block">Locais de Exibição:</span>
                    
                    <div className="flex items-center justify-between">
                      <span>Página de Entrada / Login</span>
                      <input
                        type="checkbox"
                        checked={versesConfig.show_on_login}
                        onChange={(e) => setVersesConfig({ ...versesConfig, show_on_login: e.target.checked })}
                        className="w-3.5 h-3.5 text-emerald-500 bg-slate-950 border-slate-800 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Tela de Geração / Carregamento IA</span>
                      <input
                        type="checkbox"
                        checked={versesConfig.show_on_loading}
                        onChange={(e) => setVersesConfig({ ...versesConfig, show_on_loading: e.target.checked })}
                        className="w-3.5 h-3.5 text-emerald-500 bg-slate-950 border-slate-800 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Painel Principal / Dashboard</span>
                      <input
                        type="checkbox"
                        checked={versesConfig.show_on_dashboard}
                        onChange={(e) => setVersesConfig({ ...versesConfig, show_on_dashboard: e.target.checked })}
                        className="w-3.5 h-3.5 text-emerald-500 bg-slate-950 border-slate-800 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Rodapé do Sistema / Footer</span>
                      <input
                        type="checkbox"
                        checked={versesConfig.show_on_footer}
                        onChange={(e) => setVersesConfig({ ...versesConfig, show_on_footer: e.target.checked })}
                        className="w-3.5 h-3.5 text-emerald-500 bg-slate-950 border-slate-800 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-300">Tempo de Exibição (Segundos)</label>
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={versesConfig.interval_seconds}
                      onChange={(e) => setVersesConfig({ ...versesConfig, interval_seconds: parseInt(e.target.value) || 12 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <span className="text-[10px] text-slate-500">Intervalo entre a transição suave de um versículo para o outro.</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-300">Tema Visual & Brilho</label>
                    <select
                      value={versesConfig.style_theme}
                      onChange={(e) => setVersesConfig({ ...versesConfig, style_theme: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="classic_slate">Classic Slate (Azul Sideral e Prata)</option>
                      <option value="solar_gold">Solar Gold (Dourado de Ofir e Âmbar)</option>
                      <option value="cosmic_emerald">Cosmic Emerald (Esmeralda e Menta)</option>
                    </select>
                    <span className="text-[10px] text-slate-500">Altera a paleta cromática e o glow espiritual emanado pelos textos.</span>
                  </div>

                  <div className="mt-2.5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl transition duration-205 text-xs flex items-center justify-center gap-1.5 disabled:opacity-55"
                    >
                      <Check className="w-4 h-4" />
                      <span>Salvar Configuração Global</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* 2. Verses CRUD Section */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 pb-2 gap-2">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <BookOpen className="w-4.5 h-4.5 text-amber-500" />
                  Banco de Dados de Versículos Cadastrados
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Gerencie os versículos de sabedoria, prosperidade e governança divina cadastrados no sistema.</p>
              </div>
              {!editingVerse && (
                <button
                  type="button"
                  onClick={() => setEditingVerse({ id: null, reference: "", theme: "", text: "" })}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-2 rounded-xl transition text-[11px] flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Versículo</span>
                </button>
              )}
            </div>

            {/* Editing / Adding Form */}
            {editingVerse && (
              <form onSubmit={handleSaveVerse} className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl flex flex-col gap-4 text-xs text-slate-300">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <Edit className="w-3.5 h-3.5 text-emerald-400" />
                  {editingVerse.id ? "Editar Versículo" : "Cadastrar Novo Versículo"}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-300">Referência Bíblica <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Provérbios 10:22"
                      value={editingVerse.reference}
                      onChange={(e) => setEditingVerse({ ...editingVerse, reference: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-300">Tema do Versículo</label>
                    <input
                      type="text"
                      placeholder="Ex: Prosperidade, Sabedoria"
                      value={editingVerse.theme}
                      onChange={(e) => setEditingVerse({ ...editingVerse, theme: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-300">Mensagem / Texto <span className="text-rose-400">*</span></label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Insira o texto completo do versículo..."
                    value={editingVerse.text}
                    onChange={(e) => setEditingVerse({ ...editingVerse, text: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white resize-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingVerse(null)}
                    className="bg-slate-950 hover:bg-slate-850 text-slate-400 px-3 py-2 rounded-xl transition text-[11px]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl transition text-[11px] flex items-center gap-1 disabled:opacity-55"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvar Versículo</span>
                  </button>
                </div>
              </form>
            )}

            {/* Verses Table/List */}
            <div className="max-h-[350px] overflow-y-auto border border-slate-850 rounded-xl bg-slate-950/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-850 text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                    <th className="p-3">Referência</th>
                    <th className="p-3">Tema</th>
                    <th className="p-3">Texto</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  {versesList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-500 italic text-xs">
                        Nenhum versículo cadastrado.
                      </td>
                    </tr>
                  ) : (
                    versesList.map((verse) => (
                      <tr key={verse.id} className="hover:bg-slate-900/30 transition text-xs">
                        <td className="p-3 font-bold text-white whitespace-nowrap">{verse.reference}</td>
                        <td className="p-3">
                          <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-[10px] font-mono border border-amber-500/15 whitespace-nowrap">
                            {verse.theme || "Geral"}
                          </span>
                        </td>
                        <td className="p-3 max-w-xs truncate" title={verse.text}>
                          {verse.text}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingVerse({ id: verse.id, reference: verse.reference, theme: verse.theme || "", text: verse.text })}
                              className="bg-slate-900 hover:bg-slate-800 text-slate-300 p-1.5 rounded transition"
                              title="Editar"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVerse(verse.id)}
                              className="bg-slate-900 hover:bg-slate-800 text-rose-400 p-1.5 rounded transition"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Credenciais de Acesso Geradas e Enviadas */}
      {generatedCredentialsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8.5 h-8.5 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Acesso Cadastrado e Enviado!</h3>
                  <p className="text-[11px] text-slate-400">Credenciais disparadas por e-mail para o aluno</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGeneratedCredentialsModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Nome do Aluno:</span>
                <strong className="text-white font-sans text-sm">{generatedCredentialsModal.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">E-mail / Login de Acesso:</span>
                <span className="text-amber-400 font-bold block">{generatedCredentialsModal.email}</span>
              </div>
              {generatedCredentialsModal.password && (
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Senha de Acesso:</span>
                  <span className="text-emerald-400 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800 block">
                    {generatedCredentialsModal.password}
                  </span>
                </div>
              )}
              {generatedCredentialsModal.code && (
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Código de Primeiro Acesso:</span>
                  <span className="text-cyan-400 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800 block">
                    {generatedCredentialsModal.code}
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[11px] mt-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Disparo efetuado! E-mail com dados de login e senha enviado para <strong>{generatedCredentialsModal.email}</strong>.
              </span>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => {
                  const text = `🎉 Dados de Acesso à Plataforma:\nNome: ${generatedCredentialsModal.name}\nE-mail/Login: ${generatedCredentialsModal.email}\nSenha: ${generatedCredentialsModal.password || '---'}\nCódigo: ${generatedCredentialsModal.code || '---'}`;
                  navigator.clipboard.writeText(text);
                  setCopiedKey(true);
                  setTimeout(() => setCopiedKey(false), 2500);
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-amber-500/10"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Copiar Dados de Acesso</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setGeneratedCredentialsModal(null);
                  setActiveTab("users");
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs transition"
              >
                Ver Lista de Alunos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN / INTERACTIVE EMAIL PREVIEW MODAL */}
      {showEmailPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header Bar */}
            <div className="bg-slate-950 border-b border-slate-800 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Pré-visualização do E-mail em Tempo Real</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                      Dados Fictícios Aplicados
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Veja exatamente como este e-mail será renderizado na caixa de entrada do seu aluno.
                  </p>
                </div>
              </div>

              {/* Viewport & Theme Controls */}
              <div className="flex items-center gap-2">
                {/* Device Selector */}
                <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${previewDevice === "desktop" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
                    title="Visualização Desktop (680px)"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${previewDevice === "mobile" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"}`}
                    title="Visualização Mobile (375px)"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

                {/* Quick Theme Switcher */}
                <div className="hidden md:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1 text-[11px]">
                  {(["dark", "light", "modern"] as const).map((thm) => (
                    <button
                      key={thm}
                      type="button"
                      onClick={() => setEmailTemplate({ ...emailTemplate, theme: thm })}
                      className={`px-2 py-1 rounded-lg capitalize font-bold transition ${emailTemplate.theme === thm ? "bg-slate-800 text-amber-400 border border-slate-700" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      {thm}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowEmailPreviewModal(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white p-2 rounded-xl transition border border-slate-800"
                  title="Fechar Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dummy Data Banner Bar */}
            <div className="bg-slate-950/70 border-b border-slate-850 px-5 py-2 flex items-center gap-2 overflow-x-auto text-[11px] font-mono shrink-0">
              <span className="text-amber-400 font-bold font-sans text-xs shrink-0 flex items-center gap-1">
                <Code className="w-3 h-3" />
                Dados simulados:
              </span>
              <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                <span className="text-slate-500">nome =</span> Maria Silva
              </span>
              <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                <span className="text-slate-500">login =</span> maria.silva@exemplo.com
              </span>
              <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                <span className="text-slate-500">senha =</span> Membro#2026!Key
              </span>
              <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                <span className="text-slate-500">codigo =</span> 749201
              </span>
              <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                <span className="text-slate-500">produto =</span> Infoprodutos Master
              </span>
            </div>

            {/* Simulated Email Viewport Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950 flex justify-center items-start">
              
              <div
                className={`transition-all duration-300 w-full rounded-2xl overflow-hidden shadow-2xl border ${
                  previewDevice === "mobile"
                    ? "max-w-[385px] border-slate-700 bg-slate-900 ring-8 ring-slate-900 rounded-[36px] my-2"
                    : "max-w-[620px] border-slate-800 bg-slate-900"
                }`}
              >
                {/* Mobile Camera Notch (only shown in mobile preview) */}
                {previewDevice === "mobile" && (
                  <div className="bg-slate-900 py-2.5 flex justify-center items-center border-b border-slate-850">
                    <div className="w-16 h-3 bg-slate-950 rounded-full border border-slate-800" />
                  </div>
                )}

                {/* Email Client Top Meta Bar */}
                <div className="bg-slate-950 border-b border-slate-800 p-4 text-xs font-sans flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Simulação do Cliente de E-mail (Gmail / Apple Mail)</span>
                    <span className="text-[10px] text-slate-500 font-mono">Hoje, 14:32</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-mono">ASSUNTO</span>
                    <h4 className="text-amber-400 font-bold text-sm leading-snug break-words mt-0.5">
                      {renderPreviewValue(emailTemplate.subject)}
                    </h4>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                    <div>
                      <span className="text-slate-500">De: </span>
                      <span className="text-slate-300 font-medium">Plataforma &lt;onboarding@resend.dev&gt;</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Para: </span>
                      <span className="text-slate-300 font-medium">Maria Silva &lt;maria.silva@exemplo.com&gt;</span>
                    </div>
                  </div>
                </div>

                {/* Rendered HTML Body */}
                <div
                  className="p-6 md:p-8 font-sans"
                  style={{
                    backgroundColor: emailTemplate.theme === "light" ? "#f8fafc" : "#090d16",
                    color: emailTemplate.theme === "light" ? "#1e293b" : "#f8fafc"
                  }}
                >
                  <div
                    className="max-w-[560px] mx-auto rounded-2xl overflow-hidden shadow-xl border"
                    style={{
                      backgroundColor: emailTemplate.theme === "light" ? "#ffffff" : "#0f172a",
                      borderColor: emailTemplate.theme === "light" ? "#e2e8f0" : "#1e293b"
                    }}
                  >
                    {/* Header Banner */}
                    <div
                      className="p-8 text-center border-b"
                      style={{
                        background: emailTemplate.theme === "light"
                          ? "linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)"
                          : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                        borderColor: emailTemplate.theme === "light" ? "#e2e8f0" : "#1e293b"
                      }}
                    >
                      <div
                        className="inline-block rounded-xl px-4 py-1.5 mb-3 border text-xs font-extrabold uppercase tracking-wider shadow-sm"
                        style={{
                          backgroundColor: `${emailTemplate.accentColor}18`,
                          borderColor: `${emailTemplate.accentColor}50`,
                          color: emailTemplate.accentColor
                        }}
                      >
                        Acesso Confirmado
                      </div>
                      <h2
                        className="text-xl md:text-2xl font-extrabold tracking-tight"
                        style={{ color: emailTemplate.theme === "light" ? "#0f172a" : "#ffffff" }}
                      >
                        {renderPreviewValue(emailTemplate.headerTitle)}
                      </h2>
                      <p
                        className="text-xs md:text-sm mt-1.5"
                        style={{ color: emailTemplate.theme === "light" ? "#64748b" : "#94a3b8" }}
                      >
                        {renderPreviewValue(emailTemplate.headerSubtitle)}
                      </p>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 md:p-8 text-xs md:text-sm">
                      {emailTemplate.bodyGreeting && (
                        <p
                          className="font-extrabold text-base mb-2"
                          style={{ color: emailTemplate.theme === "light" ? "#0f172a" : "#ffffff" }}
                        >
                          {renderPreviewValue(emailTemplate.bodyGreeting)}
                        </p>
                      )}
                      <p
                        className="leading-relaxed mb-5"
                        style={{ color: emailTemplate.theme === "light" ? "#475569" : "#cbd5e1" }}
                      >
                        {renderPreviewValue(emailTemplate.bodyText)}
                      </p>

                      {/* Credentials Box */}
                      <div
                        className="rounded-2xl p-5 my-5 border font-mono shadow-inner"
                        style={{
                          backgroundColor: emailTemplate.theme === "light" ? "#f1f5f9" : "#020617",
                          borderColor: emailTemplate.theme === "light" ? "#cbd5e1" : "#334155"
                        }}
                      >
                        <div className="mb-4">
                          <span
                            className="text-[11px] uppercase font-bold block mb-1"
                            style={{ color: emailTemplate.theme === "light" ? "#64748b" : "#64748b" }}
                          >
                            Seu E-mail / Login
                          </span>
                          <span
                            className="font-bold text-sm md:text-base break-all"
                            style={{ color: emailTemplate.accentColor }}
                          >
                            maria.silva@exemplo.com
                          </span>
                        </div>

                        <div className="mb-4">
                          <span
                            className="text-[11px] uppercase font-bold block mb-1"
                            style={{ color: emailTemplate.theme === "light" ? "#64748b" : "#64748b" }}
                          >
                            Sua Senha Inicial de Acesso
                          </span>
                          <span
                            className="font-extrabold text-emerald-400 text-sm md:text-base px-3 py-1 rounded-lg border border-slate-700 bg-slate-900 inline-block shadow-sm"
                          >
                            Membro#2026!Key
                          </span>
                        </div>

                        <div>
                          <span
                            className="text-[11px] uppercase font-bold block mb-1"
                            style={{ color: emailTemplate.theme === "light" ? "#64748b" : "#64748b" }}
                          >
                            Código de Verificação de Primeiro Acesso
                          </span>
                          <span
                            className="font-extrabold text-cyan-400 text-sm md:text-base px-3 py-1 rounded-lg border border-slate-700 bg-slate-900 inline-block shadow-sm"
                          >
                            749201
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="text-center my-8">
                        <span
                          className="inline-block px-8 py-3.5 rounded-xl font-extrabold text-slate-950 text-sm shadow-xl transition transform hover:scale-105 cursor-pointer"
                          style={{ backgroundColor: emailTemplate.accentColor }}
                        >
                          {renderPreviewValue(emailTemplate.buttonText)}
                        </span>
                      </div>

                      <p
                        className="text-xs text-center italic mt-4"
                        style={{ color: emailTemplate.theme === "light" ? "#94a3b8" : "#64748b" }}
                      >
                        Dica de segurança: Recomendamos que você altere sua senha no seu primeiro login nas configurações do perfil.
                      </p>
                    </div>

                    {/* Footer */}
                    <div
                      className="p-5 border-t text-center text-xs"
                      style={{
                        backgroundColor: emailTemplate.theme === "light" ? "#f1f5f9" : "#020617",
                        borderColor: emailTemplate.theme === "light" ? "#e2e8f0" : "#1e293b",
                        color: emailTemplate.theme === "light" ? "#64748b" : "#475569"
                      }}
                    >
                      {renderPreviewValue(emailTemplate.footerText)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-950 border-t border-slate-800 p-4 px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-400">
                Gostou do resultado? Clique em <strong className="text-white">"Salvar Template"</strong> para aplicar no sistema.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmailPreviewModal(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition border border-slate-800"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleSaveEmailTemplate();
                    setShowEmailPreviewModal(false);
                  }}
                  disabled={savingTemplate}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2 rounded-xl text-xs transition shadow-lg shadow-amber-500/10 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {savingTemplate ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Salvar & Aplicar Template</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
