"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Youtube, Github, Mail, Globe, Plane, Instagram } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
    const pathname = usePathname();
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        if (pathname.startsWith("/admin")) return;
        fetch("/api/admin/config")
            .then(res => res.json())
            .then(data => { if (data && !data.error) setConfig(data); })
            .catch(() => { });
    }, [pathname]);

    if (pathname.startsWith("/admin")) return null;

    return (
        <footer className="bg-slate-950 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-1">
                    <Link href="/" className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Plane className="text-white w-5 h-5 rotate-45" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">FS Brothers</span>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        A FS Brothers é uma comunidade dedicada ao simulador de voo, unindo pilotos virtuais através de rotas realistas e camaradagem.
                    </p>
                    <div className="flex gap-4">
                        <a href={config?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center hover:bg-green-600 transition-all border border-slate-800" title="WhatsApp">
                            <Globe className="w-4 h-4" />
                        </a>
                        <a href={config?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all border border-slate-800" title="Instagram">
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a href={config?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all border border-slate-800" title="Facebook">
                            <Facebook className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-orange-500 uppercase tracking-widest text-xs">Links Úteis</h4>
                    <ul className="space-y-4 text-slate-400 text-sm">
                        <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        <li><Link href="/extras" className="hover:text-white transition-colors">Extras</Link></li>
                        <li><Link href="/recrutamento" className="hover:text-white transition-colors">Recrutamento</Link></li>
                        <li><Link href={config?.discord || "#"} target="_blank" className="hover:text-white transition-colors">Discord</Link></li>
                        <li><a href={config?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-orange-500 uppercase tracking-widest text-xs">Suporte</h4>
                    <ul className="space-y-4 text-slate-400 text-sm">
                        <li><Link href="/privacidade" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                        <li><Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link></li>
                        <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-orange-500 uppercase tracking-widest text-xs">Administração</h4>
                    <Link
                        href="/admin/login"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-slate-800 border border-slate-800">
                            <span className="text-[10px] font-bold">ADM</span>
                        </div>
                        Painel de Controle
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <p>© 2026 FS Brothers Airlines. Todos os direitos reservados. Design Moderno.</p>
                <div className="flex gap-8">
                    <Link href="/privacidade" className="hover:text-white">Política de Privacidade</Link>
                    <Link href="/privacidade" className="hover:text-white">Termos de Uso</Link>
                </div>
            </div>
        </footer>
    );
}
