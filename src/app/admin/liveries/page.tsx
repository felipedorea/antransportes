"use client";

import { useState, useEffect, useRef } from "react";
import {
    Plus, Search, Plane, Download, Edit2, Trash2,
    Image as ImageIcon, X, Save, AlertTriangle, Upload, Link as LinkIcon
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Livery = {
    id: string;
    nome: string;
    aeronave: string;
    descricao?: string | null;
    pintura_url?: string | null;
    download_url: string;
    ativo: boolean;
};

const emptyForm = { nome: "", aeronave: "", descricao: "", pintura_url: "", download_url: "" };

export default function LiveriesPage() {
    const [liveries, setLiveries] = useState<Livery[]>([]);
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

    useEffect(() => { fetchLiveries(); }, []);

    const fetchLiveries = async () => {
        try {
            const res = await fetch("/api/admin/liveries");
            const data = await res.json();
            if (Array.isArray(data)) setLiveries(data); else setLiveries([]);
        } catch { setLiveries([]); } finally { setIsLoading(false); }
    };

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, pintura_url: data.url }));
                setPreviewUrl(data.url);
            }
        } catch (err) { console.error("Upload error:", err); }
        finally { setUploading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...formData, pintura_url: formData.pintura_url || null, descricao: formData.descricao || null };
        if (modalMode === "create") {
            await fetch("/api/admin/liveries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        } else if (modalMode === "edit" && editingId) {
            await fetch(`/api/admin/liveries/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        }
        closeModal();
        fetchLiveries();
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await fetch(`/api/admin/liveries/${deleteId}`, { method: "DELETE" });
        setDeleteId(null);
        fetchLiveries();
    };

    const openEdit = (l: Livery) => {
        setFormData({ nome: l.nome, aeronave: l.aeronave, descricao: l.descricao || "", pintura_url: l.pintura_url || "", download_url: l.download_url });
        setEditingId(l.id);
        setModalMode("edit");
        setPreviewUrl(l.pintura_url || null);
        setImageMode("url");
    };

    const closeModal = () => {
        setModalMode(null); setEditingId(null); setFormData(emptyForm);
        setPreviewUrl(null); setImageMode("url");
    };

    const filteredLiveries = liveries.filter(l =>
        l.nome.toLowerCase().includes(search.toLowerCase()) ||
        l.aeronave.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gerenciar Liveries</h1>
                    <p className="text-slate-500 text-sm">Organize as pinturas e pacotes visuais da frota.</p>
                </div>
                <button onClick={() => { setFormData(emptyForm); setModalMode("create"); setPreviewUrl(null); }} className="cursor-pointer flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                    <Plus className="w-5 h-5" /> Nova Livery
                </button>
            </div>

            {/* Create / Edit Modal */}
            {modalMode && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={closeModal} className="cursor-pointer absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{modalMode === "create" ? "Nova Livery" : "Editar Livery"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} type="text" placeholder="Nome da Pintura" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            <input required value={formData.aeronave} onChange={e => setFormData({ ...formData, aeronave: e.target.value })} type="text" placeholder="Aeronave (ex: Fenix A320)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            <input value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} type="text" placeholder="Descrição breve (Opcional)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            <input required value={formData.download_url} onChange={e => setFormData({ ...formData, download_url: e.target.value })} type="url" placeholder="Link de Download (URL)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />

                            {/* Image Section */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700">Imagem da Pintura</label>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setImageMode("url")} className={cn("cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all border", imageMode === "url" ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600")}>
                                        <LinkIcon className="w-3.5 h-3.5" /> Via Link
                                    </button>
                                    <button type="button" onClick={() => setImageMode("upload")} className={cn("cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all border", imageMode === "upload" ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600")}>
                                        <Upload className="w-3.5 h-3.5" /> Upload
                                    </button>
                                </div>

                                {imageMode === "url" ? (
                                    <input value={formData.pintura_url} onChange={e => { setFormData({ ...formData, pintura_url: e.target.value }); setPreviewUrl(e.target.value || null); }} type="url" placeholder="Cole a URL da imagem aqui" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
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
                                {(previewUrl || formData.pintura_url) && (
                                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="w-20 h-14 rounded-lg overflow-hidden relative shrink-0 bg-slate-200">
                                            <Image src={previewUrl || formData.pintura_url} alt="Preview" fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-500 truncate">{formData.pintura_url || "Nenhuma imagem"}</p>
                                        </div>
                                        <button type="button" onClick={() => { setFormData({ ...formData, pintura_url: "" }); setPreviewUrl(null); }} className="cursor-pointer p-1 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="cursor-pointer w-full bg-orange-500 text-white font-bold py-4 mt-2 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> {modalMode === "create" ? "Cadastrar Livery" : "Salvar Alterações"}
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
                        <p className="text-sm text-slate-500 mb-6">A livery será removida permanentemente.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="cursor-pointer flex-1 py-3 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
                            <button onClick={handleDelete} className="cursor-pointer flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Excluir</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cards Grid */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden text-slate-900">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Pesquisar por nome ou aeronave..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 py-2 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-6 gap-6">
                    {isLoading ? (
                        <div className="col-span-full py-12 text-center text-slate-400 font-medium italic">Carregando liveries...</div>
                    ) : filteredLiveries.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-400 font-medium">Nenhuma pintura encontrada.</div>
                    ) : filteredLiveries.map((livery) => (
                        <div key={livery.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                            <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                {livery.pintura_url ? (
                                    <Image src={livery.pintura_url} alt={livery.nome} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-12 h-12" /></div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border", livery.ativo ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-slate-900/50 text-slate-400 border-slate-700")}>
                                        {livery.ativo ? "Ativo" : "Inativo"}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{livery.nome}</h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium"><Plane className="w-3.5 h-3.5 text-blue-500" />{livery.aeronave}</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(livery)} className="cursor-pointer p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => setDeleteId(livery.id)} className="cursor-pointer p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                {livery.descricao && (
                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{livery.descricao}</p>
                                )}
                                <div className="flex items-center gap-3 mt-4">
                                    <a href={livery.download_url} target="_blank" rel="noopener noreferrer" className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all border border-slate-800">
                                        <Download className="w-4 h-4" /> Download Link
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
