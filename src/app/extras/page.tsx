import { Plane, Download, AppWindow, Map, ExternalLink, ArrowRight, ShieldCheck, Clock, Navigation, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

async function getData() {
    const [liveries, apps, routes] = await Promise.all([
        prisma.livery.findMany({ where: { ativo: true }, orderBy: { criado_em: "desc" } }),
        prisma.app.findMany({ where: { ativo: true }, orderBy: { criado_em: "desc" } }),
        prisma.route.findMany({ where: { ativo: true }, take: 6, orderBy: { criado_em: "desc" } }),
    ]);
    return { liveries, apps, routes };
}

export default async function ExtrasPage() {
    const { liveries, apps, routes } = await getData();

    return (
        <div className="pt-32 pb-24 min-h-screen bg-slate-50">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/10 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4">
                    Downloads e Recursos
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tight mb-4">
                    Central de Extras
                </h1>
                <p className="text-slate-500 max-w-2xl leading-relaxed">
                    Tudo o que você precisa para tornar sua experiência na FS Brothers ainda mais realista e completa.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 space-y-24">
                {/* Apps Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                                <AppWindow className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Aplicativos Oficiais</h2>
                        </div>
                        <div className="h-px bg-slate-200 flex-1 mx-8 hidden md:block" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {apps.map((app: any) => (
                            <div key={app.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <AppWindow className="w-7 h-7" />
                                    </div>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        v{app.versao}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2 truncate uppercase tracking-tight">{app.nome}</h3>
                                <p className="text-sm text-slate-500 mb-8 line-clamp-2 leading-relaxed">
                                    {app.descricao}
                                </p>
                                <a
                                    href={app.download_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-slate-950 text-white py-4 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all uppercase tracking-widest group-hover:shadow-lg group-hover:shadow-blue-500/10"
                                >
                                    <Download className="w-4 h-4" />
                                    Baixar Agora
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Liveries Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3 text-orange-600">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                                <Plane className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Pinturas (Liveries)</h2>
                        </div>
                        <div className="h-px bg-slate-200 flex-1 mx-8 hidden md:block" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {liveries.map((livery: any) => (
                            <div key={livery.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all">
                                <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden bg-slate-100">
                                    {livery.pintura_url ? (
                                        <Image src={livery.pintura_url} alt={livery.nome} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <ImageIcon className="w-10 h-10" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex-1 mb-6">
                                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-2">{livery.aeronave}</span>
                                        <h3 className="text-xl font-black text-slate-950 mb-2 uppercase tracking-tight">{livery.nome}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed italic">
                                            {livery.descricao || "Pintura oficial de alta resolução para simulador MSFS2020/X-Plane."}
                                        </p>
                                    </div>
                                    <a
                                        href={livery.download_url}
                                        target="_blank"
                                        className="inline-flex items-center gap-2 text-orange-600 text-xs font-black uppercase tracking-widest hover:translate-x-1 transition-transform"
                                    >
                                        Obter Livery
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Popular Routes Section */}
                <section className="bg-slate-950 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Map className="w-48 h-48" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Rotas Populares</h2>
                                <p className="text-slate-400 text-sm">Prontas para carregar no seu SimBrief.</p>
                            </div>
                            <Link href="/rotas" className="text-white bg-white/10 px-8 py-3 rounded-full text-xs font-bold hover:bg-white/20 transition-all border border-white/10 uppercase tracking-widest">
                                Ver Todas
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {routes.map((route: any) => (
                                <div key={route.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-lg font-black tracking-tighter text-blue-400">{route.numero_voo}</span>
                                        <ShieldCheck className="w-5 h-5 text-green-500/50" />
                                    </div>

                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-xl font-bold">{route.origem}</span>
                                        <div className="h-px bg-white/20 flex-1 relative">
                                            <Plane className="w-3 h-3 text-orange-500 absolute -top-1.5 left-1/2 -translate-x-1/2 rotate-90" />
                                        </div>
                                        <span className="text-xl font-bold">{route.destino}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Navigation className="w-3 h-3" />
                                            {route.distancia_nm} NM
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            {route.duracao_media}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
