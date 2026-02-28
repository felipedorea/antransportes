"use client";

import { useState, useEffect } from "react";
import {
    Plus, Search, AppWindow, Download, Edit2, Trash2,
    CheckCircle2, XCircle, X, Save, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

type App = {
    id: string;
    nome: string;
    descricao: string;
    versao: string;
    download_url: string;
    ativo: boolean;
};

const emptyForm = { nome: "", descricao: "", versao: "", download_url: "" };

export default function AppsPage() {
    const [apps, setApps] = useState<App[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => { fetchApps(); }, []);

    const fetchApps = async () => {
        try {
            const res = await fetch("/api/admin/apps");
            const data = await res.json();
            if (Array.isArray(data)) setApps(data); else setApps([]);
        } catch { setApps([]); } finally { setIsLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === "create") {
            await fetch("/api/admin/apps", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
        } else if (modalMode === "edit" && editingId) {
            await fetch(`/api/admin/apps/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
        }
        closeModal();
        fetchApps();
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await fetch(`/api/admin/apps/${deleteId}`, { method: "DELETE" });
        setDeleteId(null);
        fetchApps();
    };

    const openEdit = (a: App) => {
        setFormData({ nome: a.nome, descricao: a.descricao || "", versao: a.versao || "", download_url: a.download_url });
        setEditingId(a.id);
        setModalMode("edit");
    };

    const closeModal = () => { setModalMode(null); setEditingId(null); setFormData(emptyForm); };

    const filteredApps = apps.filter(a =>
        a.nome.toLowerCase().includes(search.toLowerCase()) ||
        (a.descricao && a.descricao.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Aplicativos e Mods</h1>
                    <p className="text-slate-500 text-sm">Gerencie as ferramentas essenciais para sua experiência de voo.</p>
                </div>
                <button onClick={() => { setFormData(emptyForm); setModalMode("create"); }} className="cursor-pointer flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
                    <Plus className="w-5 h-5" /> Novo Software
                </button>
            </div>

            {/* Create / Edit Modal */}
            {modalMode && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 relative">
                        <button onClick={closeModal} className="cursor-pointer absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{modalMode === "create" ? "Novo Software" : "Editar Software"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} type="text" placeholder="Nome do Software" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
                            <input required value={formData.versao} onChange={e => setFormData({ ...formData, versao: e.target.value })} type="text" placeholder="Versão (ex: 1.0.0)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
                            <input required value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} type="text" placeholder="Descrição" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
                            <input required value={formData.download_url} onChange={e => setFormData({ ...formData, download_url: e.target.value })} type="url" placeholder="Link de Download (URL)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
                            <button type="submit" className="cursor-pointer w-full bg-purple-600 text-white font-bold py-4 mt-2 rounded-xl shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> {modalMode === "create" ? "Cadastrar Software" : "Salvar Alterações"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-8 h-8 text-red-500" /></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Confirmar Exclusão</h3>
                        <p className="text-sm text-slate-500 mb-6">O software será removido permanentemente.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="cursor-pointer flex-1 py-3 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
                            <button onClick={handleDelete} className="cursor-pointer flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Excluir</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden text-slate-900">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Pesquisar por nome ou descrição..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 py-2 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                                <th className="px-6 py-4 border-b border-slate-100">Nome / Software</th>
                                <th className="px-6 py-4 border-b border-slate-100">Versão</th>
                                <th className="px-6 py-4 border-b border-slate-100">Descrição</th>
                                <th className="px-6 py-4 border-b border-slate-100">Status</th>
                                <th className="px-6 py-4 border-b border-slate-100 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">Carregando aplicativos...</td></tr>
                            ) : filteredApps.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">Nenhum software cadastrado.</td></tr>
                            ) : filteredApps.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all"><AppWindow className="w-5 h-5" /></div>
                                            <span className="text-sm font-bold text-slate-900">{app.nome}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black tracking-widest border border-slate-200 uppercase">v{app.versao}</span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs"><p className="text-xs text-slate-500 line-clamp-1">{app.descricao}</p></td>
                                    <td className="px-6 py-4">
                                        {app.ativo ? (
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 w-fit"><CheckCircle2 className="w-3 h-3" />ESTÁVEL</span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 w-fit"><XCircle className="w-3 h-3" />SUSPENSO</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a href={app.download_url} target="_blank" rel="noopener noreferrer" className="cursor-pointer p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"><Download className="w-4 h-4" /></a>
                                            <button onClick={() => openEdit(app)} className="cursor-pointer p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleteId(app.id)} className="cursor-pointer p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
