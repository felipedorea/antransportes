import { ChevronDown, HelpCircle, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const faqs = [
    {
        q: "Como faço para entrar na FS Brothers?",
        a: "Para entrar na nossa companhia, você deve acessar a página de Recrutamento, preencher o formulário oficial e aguardar o contato da nossa equipe via Discord ou E-mail."
    },
    {
        q: "Quais simuladores são aceitos?",
        a: "Atualmente aceitamos Microsoft Flight Simulator 2020 (MSFS), X-Plane 11/12 e Prepar3D (v4/v5)."
    },
    {
        q: "É obrigatório voar na IVAO ou VATSIM?",
        a: "Não é obrigatório, mas incentivamos fortemente o uso dessas redes para aumentar o realismo da simulação. Realizamos eventos coordenados nessas plataformas regularmente."
    },
    {
        q: "Eu preciso de um software de rastreio (tracker)?",
        a: "Sim, utilizamos ferramentas oficiais para registro de horas e performance. Você pode baixar nosso tracker na seção de Extras."
    },
    {
        q: "Como posso sugerir novas rotas ou liveries?",
        a: "Todas as sugestões devem ser enviadas no canal específico do nosso servidor do Discord, onde a comunidade vota e a diretoria avalia a viabilidade técnica."
    },
    {
        q: "A FS Brothers é uma empresa real?",
        a: "Não. Somos uma organização de simulação de aviação virtual, sem fins lucrativos, dedicada exclusivamente ao entretenimento e à paixão pela aviação."
    }
];

export default function FAQPage() {
    return (
        <div className="pt-32 pb-24 min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/10 text-orange-600 text-[10px] font-black uppercase tracking-widest">
                        Central de Ajuda
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tight">
                        Perguntas Frequentes
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
                        Tire suas dúvidas sobre nosso funcionamento, recrutamento e infraestrutura tecnológica.
                    </p>
                </div>

                {/* FAQ Grid */}
                <div className="space-y-4 text-slate-900">
                    {faqs.map((item, i) => (
                        <div key={i} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-lg transition-all group">
                            <details className="group">
                                <summary className="flex items-center justify-between p-8 cursor-pointer list-none list-inside">
                                    <span className="text-lg font-bold text-slate-900 pr-8 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.q}</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-open:rotate-180 transition-transform">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </summary>
                                <div className="px-8 pb-8">
                                    <div className="h-px bg-slate-50 mb-6" />
                                    <p className="text-slate-500 leading-relaxed italic border-l-4 border-blue-500 pl-6">
                                        {item.a}
                                    </p>
                                </div>
                            </details>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-20 p-10 bg-slate-950 rounded-[3rem] text-center space-y-8 relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/20">
                            <HelpCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Ainda tem dúvidas?</h2>
                        <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm">
                            Nossa equipe de suporte está disponível 24/7 no Discord para ajudar você com qualquer problema.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="https://discord.gg/kjKfRmSEBr"
                                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Falar no Discord
                            </Link>
                            <Link
                                href="/recrutamento"
                                className="bg-white/5 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                Fazer Carreira
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[100px]" />
                </div>
            </div>
        </div>
    );
}
