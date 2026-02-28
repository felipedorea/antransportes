export const dynamic = 'force-dynamic';

import { Plane, Download, Search, Info, ArrowRight, ShieldCheck, Box } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

async function getLiveries() {
    return await prisma.livery.findMany({
        where: { ativo: true },
        orderBy: { aeronave: "asc" }
    });
}

export default async function FleetPage() {
    const liveries = await getLiveries();

    return (
        <div className="pt-32 pb-24 min-h-screen bg-white">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
                    Nossa Frota e Pinturas
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tight mb-4">
                    Frota Operacional
                </h1>
                <p className="text-slate-500 max-w-2xl leading-relaxed">
                    Conheça as aeronaves que compõem nossa malha aérea e baixe as pinturas oficiais de alta resolução.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {liveries.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                            <Plane className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Nenhuma aeronave cadastrada no momento.</p>
                        </div>
                    ) : liveries.map((livery: any) => (
                        <div key={livery.id} className="group bg-white rounded-[3rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all flex flex-col">
                            <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 italic font-black uppercase tracking-tighter text-slate-200 flex items-center justify-center text-8xl">
                                {livery.pintura_url ? (
                                    <Image
                                        src={livery.pintura_url}
                                        alt={livery.nome}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                ) : (
                                    "FLEET"
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                            </div>

                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{livery.aeronave}</span>
                                        <ShieldCheck className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">{livery.nome}</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                                        <Box className="w-4 h-4" />
                                        Pintura 4K / PBR Textures
                                    </div>
                                    <a
                                        href={livery.download_url}
                                        target="_blank"
                                        className="flex items-center justify-center gap-3 w-full bg-slate-950 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                                    >
                                        <Download className="w-4 h-4" />
                                        Baixar Pintura
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Banner */}
                <div className="mt-24 p-12 bg-blue-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl">
                    <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center shrink-0">
                        <Info className="w-12 h-12" />
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                        <h2 className="text-3xl font-black uppercase tracking-tight">Instalação Simples</h2>
                        <p className="text-blue-100 max-w-xl leading-relaxed">
                            Nossos pacotes de pintura seguem o padrão 'drag and drop' da pasta Community do MSFS ou a pasta Liveries do X-Plane.
                        </p>
                    </div>
                    <Link
                        href="/faq"
                        className="md:ml-auto bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all whitespace-nowrap"
                    >
                        Ver Manual de Instalação
                    </Link>
                </div>
            </div>
        </div>
    );
}
