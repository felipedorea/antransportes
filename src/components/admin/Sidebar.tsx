"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Map,
    Plane,
    Download,
    Users,
    Settings,
    LogOut,
    AppWindow,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Gerenciar Rotas", icon: Map, href: "/admin/rotas" },
    { name: "Liveries", icon: Plane, href: "/admin/liveries" },
    { name: "Aplicativos", icon: AppWindow, href: "/admin/aplicativos" },
    { name: "Usuários", icon: Users, href: "/admin/usuarios" },
    { name: "Configurações", icon: Settings, href: "/admin/configuracoes" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === "/admin/login") return null;

    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col h-full sticky top-0 overflow-y-auto">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
                        FS
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white leading-tight">FS Brothers</h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Airlines Management</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                                <span className="flex-1">{item.name}</span>
                                {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 space-y-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Status do Servidor</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-white font-medium">Operacional</span>
                    </div>
                </div>

                <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); sessionStorage.removeItem("admin_session_active"); router.push("/admin/login"); }} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all text-sm font-medium">
                    <LogOut className="w-5 h-5" />
                    Sair do Painel
                </button>
            </div>
        </aside>
    );
}
