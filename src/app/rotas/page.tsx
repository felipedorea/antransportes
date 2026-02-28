"use client";

import { useState, useEffect } from "react";
import { Plane, Clock, Navigation, Search, ExternalLink, Compass } from "lucide-react";
import Link from "next/link";

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

export default function RoutesPage() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/public/routes")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setRoutes(data);
            })
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = routes.filter(r =>
        r.numero_voo.toLowerCase().includes(search.toLowerCase()) ||
        r.origem.toLowerCase().includes(search.toLowerCase()) ||
        r.destino.toLowerCase().includes(search.toLowerCase()) ||
        r.aeronave.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="pt-32 pb-24 min-h-screen bg-slate-50">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
                    <Compass className="w-3.5 h-3.5" /> Malha Aérea
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tight mb-4">
                    Nossas Rotas
                </h1>
                <p className="text-slate-500 max-w-2xl leading-relaxed">
                    Confira a lista completa de rotas operadas pela FS Brothers Airlines. Use a barra de pesquisa para encontrar rapidamente seu voo.
                </p>
            </div>

            {/* Table */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
                    {/* Search Bar */}
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Pesquisar por voo, origem, destino ou aeronave..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-white border border-slate-200 py-3 pl-12 pr-4 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                                    <th className="px-6 py-4 border-b border-slate-100">Voo</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Rota</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Aeronave</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Distância</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Duração</th>
                                    <th className="px-6 py-4 border-b border-slate-100 text-right">SimBrief</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400 font-medium italic text-sm">Carregando rotas...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400 font-medium text-sm">Nenhuma rota encontrada.</td></tr>
                                ) : filtered.map(route => (
                                    <tr key={route.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-blue-600 tracking-tight">{route.numero_voo}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-base font-bold text-slate-900">{route.origem}</span>
                                                <div className="w-10 h-[1px] bg-slate-200 relative">
                                                    <Plane className="w-3.5 h-3.5 text-orange-500 absolute -top-[7px] left-1/2 -translate-x-1/2 rotate-90" />
                                                </div>
                                                <span className="text-base font-bold text-slate-900">{route.destino}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <Plane className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-medium text-slate-700">{route.aeronave}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Navigation className="w-3.5 h-3.5 text-slate-400" />
                                                {route.distancia_nm} NM
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                {route.duracao_media}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {route.simbrief_link ? (
                                                <a
                                                    href={route.simbrief_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" /> SimBrief
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-300 italic">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer info */}
                    {!isLoading && filtered.length > 0 && (
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-400">
                            {filtered.length} rota{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
