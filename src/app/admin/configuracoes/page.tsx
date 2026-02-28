"use client";

import { useState, useEffect, useRef } from "react";
import { Shield, User, Save, Upload, Link as LinkIcon, X, CheckCircle2, AlertTriangle, LogOut } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const DEFAULT_AVATAR = "/assets/default-pilot.png";

export default function SettingsPage() {
    const router = useRouter();
    const [profile, setProfile] = useState({ nome: "", email: "", foto_url: "" });
    const [originalEmail, setOriginalEmail] = useState("");
    const [passwords, setPasswords] = useState({ senha: "", confirmar: "" });
    const [imageMode, setImageMode] = useState<"url" | "upload">("url");
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/admin/profile")
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setProfile({ nome: data.nome || "", email: data.email || "", foto_url: data.foto_url || "" });
                    setOriginalEmail(data.email || "");
                    setPreviewUrl(data.foto_url || null);
                }
            })
            .catch(() => { });
    }, []);

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.url) {
                setProfile(prev => ({ ...prev, foto_url: data.url }));
                setPreviewUrl(data.url);
            }
        } catch (err) { console.error("Upload error:", err); }
        finally { setUploading(false); }
    };

    const passwordChanged = passwords.senha.length > 0 && passwords.senha === passwords.confirmar;
    const emailChanged = profile.email !== originalEmail && profile.email.length > 0;
    const willLogout = emailChanged || passwordChanged;

    const handleSaveClick = () => {
        if (willLogout) {
            setShowConfirm(true);
        } else {
            doSave(false);
        }
    };

    const doSave = async (forceLogout: boolean) => {
        setSaving(true);
        setShowConfirm(false);
        try {
            const payload: Record<string, unknown> = {
                nome: profile.nome,
                email: profile.email,
                foto_url: profile.foto_url || null,
            };

            if (passwordChanged) {
                payload.senha = passwords.senha;
            }

            const res = await fetch("/api/admin/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok && forceLogout) {
                await fetch("/api/auth/logout", { method: "POST" });
                sessionStorage.removeItem("admin_session_active");
                router.push("/admin/login");
                return;
            }

            if (res.ok) {
                setSaved(true);
                setOriginalEmail(profile.email);
                setPasswords({ senha: "", confirmar: "" });
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) { console.error("Save error:", err); }
        finally { setSaving(false); }
    };

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Configurações do Perfil</h1>
                <p className="text-slate-500 text-sm">Gerencie suas informações pessoais e segurança.</p>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Atenção</h3>
                        <p className="text-sm text-slate-500 mb-2">
                            Você está alterando {emailChanged && passwordChanged ? "o e-mail e a senha" : emailChanged ? "o e-mail" : "a senha"} de acesso.
                        </p>
                        <p className="text-sm text-slate-500 mb-6">
                            Por segurança, você será <strong className="text-slate-900">deslogado</strong> automaticamente e precisará entrar novamente com as novas credenciais.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowConfirm(false)} className="cursor-pointer flex-1 py-3 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
                                Cancelar
                            </button>
                            <button onClick={() => doSave(true)} className="cursor-pointer flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                                OK, Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 text-slate-900">
                {/* Profile Section */}
                <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
                        <User className="w-5 h-5 text-orange-500" />
                        <h2 className="font-bold">Informações do Perfil</h2>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden relative bg-slate-100 border-2 border-slate-50 shrink-0">
                            <Image src={previewUrl || profile.foto_url || DEFAULT_AVATAR} alt="Avatar" fill className="object-cover" />
                        </div>
                        <div className="space-y-3 flex-1">
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setImageMode("url")} className={cn("cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border", imageMode === "url" ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-slate-50 border-slate-200 text-slate-400")}>
                                    <LinkIcon className="w-3 h-3" /> Via Link
                                </button>
                                <button type="button" onClick={() => setImageMode("upload")} className={cn("cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border", imageMode === "upload" ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-slate-50 border-slate-200 text-slate-400")}>
                                    <Upload className="w-3 h-3" /> Upload
                                </button>
                                {profile.foto_url && (
                                    <button type="button" onClick={() => { setProfile({ ...profile, foto_url: "" }); setPreviewUrl(null); }} className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100 text-red-400 hover:bg-red-50 transition-all">
                                        <X className="w-3 h-3" /> Remover
                                    </button>
                                )}
                            </div>
                            {imageMode === "url" ? (
                                <input value={profile.foto_url} onChange={e => { setProfile({ ...profile, foto_url: e.target.value }); setPreviewUrl(e.target.value || null); }} type="url" placeholder="Cole a URL da imagem aqui" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            ) : (
                                <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-orange-400 hover:bg-orange-50/30 transition-all">
                                    <p className="text-xs text-slate-400 font-medium">{uploading ? "Enviando..." : "Clique para selecionar"}</p>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nome</label>
                            <input value={profile.nome} onChange={e => setProfile({ ...profile, nome: e.target.value })} type="text" placeholder="Seu nome" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">E-mail de Login</label>
                            <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} type="email" placeholder="seu@email.com" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10" />
                            {emailChanged && (
                                <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Alterar o e-mail exigirá re-login</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Security Section */}
                <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <h2 className="font-bold">Alterar Senha</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nova Senha</label>
                            <input value={passwords.senha} onChange={e => setPasswords({ ...passwords, senha: e.target.value })} type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirmar Senha</label>
                            <input value={passwords.confirmar} onChange={e => setPasswords({ ...passwords, confirmar: e.target.value })} type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10" />
                        </div>
                    </div>
                    {passwords.senha && passwords.confirmar && passwords.senha !== passwords.confirmar && (
                        <p className="text-xs text-red-500 font-medium">As senhas não coincidem.</p>
                    )}
                    {passwordChanged && (
                        <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Alterar a senha exigirá re-login</p>
                    )}
                </section>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-4">
                    {saved && (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                            <CheckCircle2 className="w-4 h-4" /> Salvo com sucesso!
                        </div>
                    )}
                    <button
                        onClick={handleSaveClick}
                        disabled={saving}
                        className="cursor-pointer flex items-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </div>
            </div>
        </div>
    );
}
