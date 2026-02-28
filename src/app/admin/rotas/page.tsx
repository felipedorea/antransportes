"use client";

import { useState, useEffect } from "react";
import {
    Plus, Search, Plane, Clock, Navigation, Edit2, Trash2,
    CheckCircle2, XCircle, X, Save, AlertTriangle, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

type Route = {
    id: string;
    numero_voo: string;
    origem: string;
    destino: string;
    distancia_nm: number;
    duracao_media: string;
    aeronave: string;
    simbrief_link?: string | null;
    ativo: boolean;
};

const emptyForm = { numero_voo: "", origem: "", destino: "", distancia_nm: "", duracao_media: "", aeronave: "", simbrief_link: "" };

function formatDuration(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return digits.slice(0, digits.length - 2) + ":" + digits.slice(digits.length - 2);
}

export default function RoutesPage() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => { fetchRoutes(); }, []);

    const fetchRoutes = async () => {
        try {
            const res = await fetch("/api/admin/routes");
            const data = await res.json();
            if (Array.isArray(data)) setRoutes(data); else setRoutes([]);
        } catch { setRoutes([]); } finally { setIsLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...formData, distancia_nm: Number(formData.distancia_nm), simbrief_link: formData.simbrief_link || null };
        if (modalMode === "create") {
            await fetch("/api/admin/routes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        } else if (modalMode === "edit" && editingId) {
            await fetch(`/api/admin/routes/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        }
        closeModal();
        fetchRoutes();
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await fetch(`/api/admin/routes/${deleteId}`, { method: "DELETE" });
        setDeleteId(null);
        fetchRoutes();
    };

    const openEdit = (r: Route) => {
        setFormData({ numero_voo: r.numero_voo, origem: r.origem, destino: r.destino, distancia_nm: String(r.distancia_nm), duracao_media: r.duracao_media, aeronave: r.aeronave, simbrief_link: r.simbrief_link || "" });
        setEditingId(r.id);
        setModalMode("edit");
    };

    const closeModal = () => { setModalMode(null); setEditingId(null); setFormData(emptyForm); };

    const filteredRoutes = routes.filter(r =>
        r.numero_voo.toLowerCase().includes(search.toLowerCase()) ||
        r.origem.toLowerCase().includes(search.toLowerCase()) ||
        r.destino.toLowerCase().includes(search.toLowerCase()) ||
        r.aeronave.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gerenciar Rotas</h1>
                    <p className="text-slate-500 text-sm">Visualize, crie e gerencie as rotas oficiais da FS Brothers.</p>
                </div>
                <button onClick={() => { setFormData(emptyForm); setModalMode("create"); }} className="cursor-pointer flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                    <Plus className="w-5 h-5" /> Nova Rota
                </button>
            </div>

            {/* Create / Edit Modal */}
            {modalMode && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 relative">
                        <button onClick={closeModal} className="cursor-pointer absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{modalMode === "create" ? "Nova Rota" : "Editar Rota"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required value={formData.numero_voo} onChange={e => setFormData({ ...formData, numero_voo: e.target.value })} type="text" placeholder="Número do Voo (ex: FSB101)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            <div className="grid grid-cols-2 gap-4">
                                <input required value={formData.origem} onChange={e => setFormData({ ...formData, origem: e.target.value.toUpperCase() })} type="text" placeholder="Origem (ICAO)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 uppercase" />
                                <input required value={formData.destino} onChange={e => setFormData({ ...formData, destino: e.target.value.toUpperCase() })} type="text" placeholder="Destino (ICAO)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 uppercase" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required value={formData.distancia_nm} onChange={e => setFormData({ ...formData, distancia_nm: e.target.value })} type="number" placeholder="Distância (NM)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                                <input required value={formData.duracao_media} onChange={e => setFormData({ ...formData, duracao_media: formatDuration(e.target.value) })} type="text" placeholder="Duração (hh:mm)" maxLength={5} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            </div>
                            <input required value={formData.aeronave} onChange={e => setFormData({ ...formData, aeronave: e.target.value })} type="text" placeholder="Aeronave (ex: A320neo)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            <input value={formData.simbrief_link} onChange={e => setFormData({ ...formData, simbrief_link: e.target.value })} type="url" placeholder="SimBrief Link (opcional)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            <button type="submit" className="cursor-pointer w-full bg-orange-500 text-white font-bold py-4 mt-2 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> {modalMode === "create" ? "Cadastrar Rota" : "Salvar Alterações"}
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
                        <p className="text-sm text-slate-500 mb-6">Esta ação não pode ser desfeita.</p>
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
                        <input type="text" placeholder="Pesquisar por voo, origem, destino ou aeronave..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 py-2 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                                <th className="px-6 py-4 border-b border-slate-100">Voo</th>
                                <th className="px-6 py-4 border-b border-slate-100">Rota</th>
                                <th className="px-6 py-4 border-b border-slate-100">Aeronave</th>
                                <th className="px-6 py-4 border-b border-slate-100">Detalhes</th>
                                <th className="px-6 py-4 border-b border-slate-100">Status</th>
                                <th className="px-6 py-4 border-b border-slate-100 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium italic">Carregando rotas...</td></tr>
                            ) : filteredRoutes.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">Nenhuma rota encontrada.</td></tr>
                            ) : filteredRoutes.map((route) => (
                                <tr key={route.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{route.numero_voo}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-slate-900">{route.origem}</span>
                                            <div className="w-8 h-[1px] bg-slate-200 relative"><Plane className="w-3 h-3 text-slate-300 absolute -top-1.5 left-1/2 -translate-x-1/2 rotate-90" /></div>
                                            <span className="text-sm font-bold text-slate-900">{route.destino}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm font-medium text-slate-700">{route.aeronave}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><Navigation className="w-3 h-3" />{route.distancia_nm} NM</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{route.duracao_media}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {route.ativo ? (
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 w-fit"><CheckCircle2 className="w-3 h-3" />ATIVO</span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 w-fit"><XCircle className="w-3 h-3" />INATIVO</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {route.simbrief_link && (
                                                <a href={route.simbrief_link} target="_blank" rel="noopener noreferrer" className="cursor-pointer p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="SimBrief"><ExternalLink className="w-4 h-4" /></a>
                                            )}
                                            <button onClick={() => openEdit(route)} className="cursor-pointer p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleteId(route.id)} className="cursor-pointer p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
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
