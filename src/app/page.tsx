import { motion } from "framer-motion";
import { Plane, Users, Shield, Target, Award, Heart, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

async function getCrew() {
  return await prisma.pilot.findMany({
    where: { ativo: true },
    take: 3,
    orderBy: { criado_em: "asc" }
  });
}

export default async function HomePage() {
  const crew = await getCrew();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/assets/imagens/banner.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />

        <div className="relative z-10 max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Céus abertos para você
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight leading-tight">
            Faça parte da <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">Nossa Empresa</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Bem-vindo à FS Brothers, onde a paixão pelos céus se une à camaradagem virtual. Voe alto em nossas jornadas, descubra novas rotas e faça história nos céus.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              href="/recrutamento"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2 group w-full md:w-auto"
            >
              Junte-se Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#about"
              className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold border border-white/10 transition-all w-full md:w-auto backdrop-blur-sm"
            >
              Saiba Mais
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/30">
          <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* History Section */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <Image
                src="/assets/imagens/empresa.png"
                alt="Nossa História"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-blue-600 p-8 rounded-2xl shadow-2xl z-20 text-white">
              <span className="text-4xl font-black mb-1 block">2026</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Fundação Oficial</span>
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-orange-600 text-xs font-black uppercase tracking-widest">Nossa Essência</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tight">Nossa História</h2>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-orange-500 pl-6 py-2">
              Desde nossas origens modestas como um pequeno grupo de entusiastas da aviação virtual, a FS Brothers vem crescendo e se consolidando como uma comunidade respeitada.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Nossa jornada começou com poucos voos e uma frota simbólica, mas carregada de sonhos e determinação. Com uma equipe dedicada e apaixonada pelos céus, enfrentamos cada desafio com coragem e espírito de união — sempre em busca de novos horizontes. Hoje, estamos prontos para conquistar novas rotas e escrever nosso nome na história da aviação virtual.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <p className="text-3xl font-black text-blue-600 mb-1">120+</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pilotos Ativos</p>
              </div>
              <div>
                <p className="text-3xl font-black text-blue-600 mb-1">5.4k</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Horas de Voo</p>
              </div>
              <div>
                <p className="text-3xl font-black text-blue-600 mb-1">15+</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rotas Oficiais</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tight mb-4">Valores e Missão</h2>
          <div className="w-20 h-1 bg-red-500 mx-auto rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Integridade", description: "Pautamos nossas ações na felicidade e transparência, mantendo o realismo da simulação com ética e respeito.", icon: Shield },
            { name: "União", description: "Acreditamos que ninguém voa sozinho. Fortalecemos laços de amizade e colaboração entre todos os membros.", icon: Users },
            { name: "Expansão", description: "Buscamos constantemente novos horizontes, expandindo nossa frota e alcançando destinos em todo o globo.", icon: Target },
          ].map((val, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
                <val.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-black text-slate-950 mb-4">{val.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Crew Section - Dynamic */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tight mb-4">Conheça Nossa Tripulação</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crew.map((pilot: any) => (
            <div key={pilot.id} className="group text-center">
              <div className="relative w-64 h-64 mx-auto mb-8">
                <div className="absolute inset-0 bg-blue-600 rounded-full scale-[1.02] opacity-0 group-hover:opacity-10 transition-all" />
                <Image
                  src={pilot.foto_url || "/assets/default-pilot.png"}
                  alt={pilot.nome}
                  fill
                  className="rounded-full object-cover grayscale group-hover:grayscale-0 transition-all shadow-xl"
                />
              </div>
              <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight mb-1">{pilot.nome}</h3>
              <p className="text-orange-600 text-[10px] font-black uppercase tracking-widest mb-3">{pilot.cargo}</p>
              {pilot.descricao && (
                <p className="text-xs text-slate-500 max-w-[220px] mx-auto leading-relaxed">{pilot.descricao}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Discord CTA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center text-white shadow-2xl shadow-blue-600/30">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="relative z-10 space-y-8 max-w-2xl">
            <Image src="/assets/imagens/discord-b.png" alt="Discord" width={80} height={80} className="mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Junte-se ao nosso Discord</h2>
            <p className="text-lg text-blue-100 leading-relaxed">
              Participe da nossa comunidade apaixonada. Tire dúvidas, compartilhe experiências de voo e conecte-se com milhares de todo o mundo.
            </p>
            <Link
              href="https://discord.gg/kjKfRmSEBr"
              className="inline-flex items-center gap-4 bg-white text-blue-600 px-10 py-5 rounded-2xl font-black transition-all hover:shadow-2xl hover:bg-slate-50 active:scale-95"
            >
              Entrar no Servidor
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Heart className="w-12 h-12 text-red-500 mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tight mb-6">
            Apoie esta companhia... <br />
            <span className="text-orange-600">Doe qualquer valor</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
            Cada voo é mais do que uma rota traçada, é uma jornada com propósito. Somos mais que uma comunidade, somos uma <strong className="text-orange-600">família</strong> cruzando os céus com o <strong className="text-orange-600">coração</strong> como bússola.
          </p>
          <button className="text-blue-600 font-black uppercase tracking-widest text-sm hover:underline flex items-center gap-2 mx-auto">
            Clique aqui e doe pelo PIX
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
