"use client";

import { useState, useEffect } from "react";
import {
    Link as LinkIcon,
    Save,
    MessageSquare,
    Instagram,
    Facebook,
    Globe,
    FileText,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function GlobalSettingsPage() {
    const [config, setConfig] = useState({
        whatsapp: "",
        instagram: "",
        facebook: "",
        discord: "",
        formulario: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetch("/api/admin/config")
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setConfig(data);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/admin/config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: "Configurações salvas com sucesso!" });
            } else {
                throw new Error();
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Erro ao salvar configurações." });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Configurações Gerais</h1>
                <p className="text-slate-600 text-sm font-semibold">Gerencie os links de redes sociais e formulários externos de todas as páginas.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-bold">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Redes Sociais */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                <Globe className="w-5 h-5" />
                            </div>
                            <h2 className="font-bold text-slate-900">Redes Sociais</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest px-1">WhatsApp</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={config.whatsapp}
                                        onChange={e => setConfig({ ...config, whatsapp: e.target.value })}
                                        placeholder="Ex: https://wa.me/..."
                                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest px-1">Instagram</label>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={config.instagram}
                                        onChange={e => setConfig({ ...config, instagram: e.target.value })}
                                        placeholder="Link do Instagram"
                                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest px-1">Facebook</label>
                                <div className="relative">
                                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={config.facebook}
                                        onChange={e => setConfig({ ...config, facebook: e.target.value })}
                                        placeholder="Link do Facebook"
                                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Outros Links */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <LinkIcon className="w-5 h-5" />
                            </div>
                            <h2 className="font-bold text-slate-900">Links Externos</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest px-1">Link de Recrutamento</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={config.formulario}
                                        onChange={e => setConfig({ ...config, formulario: e.target.value })}
                                        placeholder="Link do Google Forms ou similar"
                                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest px-1">Discord</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={config.discord}
                                        onChange={e => setConfig({ ...config, discord: e.target.value })}
                                        placeholder="Link de convite do Discord"
                                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all disabled:opacity-50 active:scale-95"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}
