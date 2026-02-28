export const dynamic = 'force-dynamic';

import Link from "next/link";
import {
    Map,
    Plane,
    AppWindow,
    UserPlus,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getStats() {
    const [routes, liveries, apps, pilots] = await Promise.all([
        prisma.route.count(),
        prisma.livery.count(),
        prisma.app.count(),
        prisma.pilot.count(),
    ]);

    return { routes, liveries, apps, pilots };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const cards = [
        { name: "Total de Rotas", value: stats.routes, icon: Map, color: "text-orange-500", bg: "bg-orange-50" },
        { name: "Total de Liveries", value: stats.liveries, icon: Plane, color: "text-blue-500", bg: "bg-blue-50" },
        { name: "Apps Ativos", value: stats.apps, icon: AppWindow, color: "text-purple-500", bg: "bg-purple-50" },
        { name: "Tripulação", value: stats.pilots, icon: UserPlus, color: "text-green-500", bg: "bg-green-50" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Visão Geral</h1>
                <p className="text-slate-500">Bem-vindo de volta ao painel administrativo da FS Brothers.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${card.bg} p-3 rounded-xl`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-1">{card.name}</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{card.value}</h3>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
                <h2 className="font-bold text-slate-900 mb-6">Acesso Rápido</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { name: "Rotas", href: "/admin/rotas", icon: Map, color: "text-orange-500", bg: "bg-orange-50 hover:bg-orange-100" },
                        { name: "Liveries", href: "/admin/liveries", icon: Plane, color: "text-blue-500", bg: "bg-blue-50 hover:bg-blue-100" },
                        { name: "Aplicativos", href: "/admin/aplicativos", icon: AppWindow, color: "text-purple-500", bg: "bg-purple-50 hover:bg-purple-100" },
                        { name: "Tripulação", href: "/admin/usuarios", icon: UserPlus, color: "text-green-500", bg: "bg-green-50 hover:bg-green-100" },
                    ].map(link => (
                        <Link key={link.name} href={link.href} className={`cursor-pointer flex flex-col items-center gap-3 p-6 rounded-2xl transition-all ${link.bg}`}>
                            <link.icon className={`w-8 h-8 ${link.color}`} />
                            <span className="text-sm font-bold text-slate-700">{link.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
