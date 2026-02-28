export const dynamic = 'force-dynamic';

import { ArrowRight, Plane, ShieldCheck, Star, Users, CheckCircle2, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function RecruitmentPage() {
    const config = await prisma.globalConfig.findUnique({ where: { id: "global" } });

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Hero Section */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-[60%] h-full opacity-20 pointer-events-none">
                    <Image src="/assets/imagens/empresa.png" alt="Aeronave" fill className="object-cover mask-gradient-left" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-2xl space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                            Carreiras FS Brothers
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-tight">
                            Sua jornada <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">Começa Aqui</span>
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                            Não somos apenas uma companhia aérea virtual. Somos uma comunidade de entusiastas que buscam excelência, realismo e amizade nos céus. Pronto para o check-in?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="#form"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-blue-600/30 transition-all active:scale-95 text-center uppercase tracking-widest text-xs"
                            >
                                Abrir Formulário
                            </Link>
                            <Link
                                href={config?.discord || "#"}
                                className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black border border-white/10 transition-all text-center uppercase tracking-widest text-xs"
                            >
                                Conversar no Discord
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Join Us */}
            <section className="bg-white py-24 text-slate-900">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <span className="text-orange-600 text-xs font-black uppercase tracking-widest">O Diferencial</span>
                            <h2 className="text-4xl font-black uppercase tracking-tight text-slate-950">Por que voar conosco?</h2>
                        </div>
                        <p className="text-slate-500 leading-relaxed">
                            Na FS Brothers, valorizamos o piloto além das horas de voo. Oferecemos um ambiente estruturado para aprendizado e diversão.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Realismo Operacional", desc: "Planos de voo via SimBrief e regras de aviação civil.", icon: ShieldCheck },
                                { title: "Crescimento de Carreira", desc: "Sistema de ranking baseado em competência e comprometimento.", icon: Star },
                                { title: "Eventos Exclusivos", desc: "Fly-ins coordenados com controle IVAO e VATSIM.", icon: Users },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 p-6 rounded-3xl border border-slate-100 hover:border-orange-200 transition-all group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-950 uppercase tracking-tight mb-1">{item.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-950 rounded-[3rem] p-12 relative overflow-hidden text-white shadow-2xl">
                        <div className="relative z-10 space-y-8">
                            <CheckCircle2 className="w-12 h-12 text-orange-500" />
                            <h3 className="text-3xl font-black uppercase tracking-tight">Requisitos Mínimos</h3>
                            <ul className="space-y-4 text-slate-400">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                    Possuir o simulador (MSFS, X-Plane ou P3D)
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                    Idade mínima de 14 anos (recomendado)
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                    Comprometimento com as regras da comunidade
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                    Vontade de aprender e compartilhar conhecimento
                                </li>
                            </ul>
                            <div className="pt-8 border-t border-white/10">
                                <p className="text-xs italic text-slate-500">Nota: Todas as candidaturas são revisadas individualmente pela nossa diretoria.</p>
                            </div>
                        </div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[100px]" />
                    </div>
                </div>
            </section>

            {/* Form CTA */}
            <section id="form" className="py-24 px-6 bg-slate-50 text-slate-900">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black uppercase tracking-tight text-slate-950">Pronto para a Decolagem?</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Clique no botão abaixo para fazer a sua inscrição.
                        </p>
                    </div>

                    <a
                        href={config?.formulario || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 bg-orange-600 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95"
                    >
                        Acessar página de inscrição
                        <Send className="w-5 h-5" />
                    </a>

                    <div className="pt-12 flex flex-col items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entre em nosso grupo do whatsapp</span>
                        <div className="flex items-center gap-3">
                            <Image src="/assets/imagens/whatsapp.png" alt="WhatsApp" width={24} height={24} />
                            <a href={config?.whatsapp || "#"} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-900 hover:text-orange-600 transition-colors">
                                {config?.whatsapp?.includes("wa.me") ? "Acessar Grupo/Contato" : (config?.whatsapp || "Não configurado")}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
