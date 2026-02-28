"use client";

import { useState, useEffect, useRef } from "react";
import {
    Plus, Search, User, BadgeCheck, Edit2, Trash2,
    X, Save, AlertTriangle, Upload, Link as LinkIcon
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Pilot = {
    id: string;
    nome: string;
    cargo: string;
    descricao?: string | null;
    foto_url?: string | null;
    ativo: boolean;
    ordem: number;
};

const DEFAULT_PILOT_IMG = "/assets/default-pilot.png";
const emptyForm = { nome: "", cargo: "", descricao: "", foto_url: "", ordem: 0 };

const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export default function PilotsPage() {
    const [pilots, setPilots] = useState<Pilot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [imageMode, setImageMode] = useState<"url" | "upload">("url");
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { fetchPilots(); }, []);

    const fetchPilots = async () => {
        try {
            const res = await fetch("/api/admin/pilots");
            const data = await res.json();
            if (Array.isArray(data)) setPilots(data); else setPilots([]);
        } catch { setPilots([]); } finally { setIsLoading(false); }
    };

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, foto_url: data.url }));
                setPreviewUrl(data.url);
            }
        } catch (err) { console.error("Upload error:", err); }
        finally { setUploading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...formData, foto_url: formData.foto_url || null, descricao: formData.descricao || null };
        if (modalMode === "create") {
            await fetch("/api/admin/pilots", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        } else if (modalMode === "edit" && editingId) {
            await fetch(`/api/admin/pilots/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        }
        closeModal();
        fetchPilots();
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await fetch(`/api/admin/pilots/${deleteId}`, { method: "DELETE" });
        setDeleteId(null);
        fetchPilots();
    };

    const openEdit = (p: Pilot) => {
        setFormData({ nome: p.nome, cargo: p.cargo, descricao: p.descricao || "", foto_url: p.foto_url || "", ordem: p.ordem });
        setEditingId(p.id);
        setModalMode("edit");
        setPreviewUrl(p.foto_url || null);
        setImageMode(p.foto_url && !p.foto_url.startsWith("/uploads") ? "url" : "url");
    };

    const closeModal = () => {
        setModalMode(null); setEditingId(null); setFormData(emptyForm);
        setPreviewUrl(null); setImageMode("url");
    };

    const filteredPilots = pilots.filter(p =>
        p.nome.toLowerCase().includes(search.toLowerCase()) ||
        p.cargo.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gerenciar Tripulação</h1>
                    <p className="text-slate-500 text-sm">Administre os pilotos, instrutores e equipe da FS Brothers.</p>
                </div>
                <button onClick={() => { setFormData(emptyForm); setModalMode("create"); setPreviewUrl(null); }} className="cursor-pointer flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                    <Plus className="w-5 h-5" /> Novo Membro
                </button>
            </div>

            {/* Create / Edit Modal */}
            {modalMode && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={closeModal} className="cursor-pointer absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{modalMode === "create" ? "Novo Tripulante" : "Editar Tripulante"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} type="text" placeholder="Nome Completo" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            <input required value={formData.cargo} onChange={e => setFormData({ ...formData, cargo: e.target.value })} type="text" placeholder="Cargo (ex: Comandante Master)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} type="text" placeholder="Descrição (Opcional)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                                <div className="relative">
                                    <input required value={formData.ordem} onChange={e => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })} type="number" min="0" placeholder="Ordem (0, 1, ...)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ordem de Listagem</label>
                                </div>
                            </div>

                            {/* Image Section */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700">Foto do Membro</label>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setImageMode("url")} className={cn("cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all border", imageMode === "url" ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600")}>
                                        <LinkIcon className="w-3.5 h-3.5" /> Via Link
                                    </button>
                                    <button type="button" onClick={() => setImageMode("upload")} className={cn("cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all border", imageMode === "upload" ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600")}>
                                        <Upload className="w-3.5 h-3.5" /> Upload
                                    </button>
                                </div>

                                {imageMode === "url" ? (
                                    <input value={formData.foto_url} onChange={e => {
                                        const val = e.target.value;
                                        setFormData({ ...formData, foto_url: val });
                                        if (!val) {
                                            setPreviewUrl(null);
                                        } else {
                                            try { new URL(val); setPreviewUrl(val); } catch { /* ignore invalid URL during typing */ }
                                        }
                                    }} type="url" placeholder="Cole a URL da imagem aqui" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="cursor-pointer w-full border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-orange-400 hover:bg-orange-50/30 transition-all"
                                    >
                                        <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-xs text-slate-400 font-medium">{uploading ? "Enviando..." : "Clique para selecionar uma imagem"}</p>
                                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); }} />
                                    </div>
                                )}

                                {/* Preview */}
                                {(previewUrl || formData.foto_url) && (
                                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0 bg-slate-200">
                                            <Image
                                                src={(formData.foto_url && (formData.foto_url.startsWith("/") || isValidUrl(formData.foto_url))) ? formData.foto_url : DEFAULT_PILOT_IMG}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-500 truncate">{formData.foto_url || "Nenhuma imagem"}</p>
                                        </div>
                                        <button type="button" onClick={() => { setFormData({ ...formData, foto_url: "" }); setPreviewUrl(null); }} className="cursor-pointer p-1 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="cursor-pointer w-full bg-orange-500 text-white font-bold py-4 mt-2 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> {modalMode === "create" ? "Cadastrar Membro" : "Salvar Alterações"}
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
                        <p className="text-sm text-slate-500 mb-6">O membro será removido permanentemente.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="cursor-pointer flex-1 py-3 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
                            <button onClick={handleDelete} className="cursor-pointer flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Excluir</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cards Grid */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Pesquisar por nome ou cargo..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 py-2 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-6">
                    {isLoading ? (
                        <div className="col-span-full py-12 text-center text-slate-400 font-medium italic">Carregando tripulação...</div>
                    ) : filteredPilots.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-400 font-medium">Nenhum membro encontrado.</div>
                    ) : filteredPilots.map((pilot) => (
                        <div key={pilot.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rotate-45 transition-colors", pilot.ativo ? "bg-green-500/10" : "bg-slate-100")} />
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-50 relative group-hover:border-orange-200 transition-colors">
                                            <Image
                                                src={(pilot.foto_url && (pilot.foto_url.startsWith("/") || isValidUrl(pilot.foto_url))) ? pilot.foto_url : DEFAULT_PILOT_IMG}
                                                alt={pilot.nome}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        {pilot.ativo && (
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"><BadgeCheck className="w-3 h-3 text-white" /></div>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(pilot)} className="cursor-pointer p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => setDeleteId(pilot.id)} className="cursor-pointer p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{pilot.nome}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">{pilot.cargo}</p>
                                        <span className="text-[10px] font-bold text-slate-300">#{pilot.ordem}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <p className="text-xs text-slate-500 line-clamp-1 flex-1">{pilot.descricao || "Sem descrição"}</p>
                                    <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ml-2 shrink-0", pilot.ativo ? "text-green-600 bg-green-50" : "text-slate-400 bg-slate-100")}>{pilot.ativo ? "Ativo" : "Inativo"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
