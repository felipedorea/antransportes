"use client";

import AdminSidebar from "@/components/admin/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const DEFAULT_AVATAR = "/assets/default-pilot.png";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/admin/login";
    const [profile, setProfile] = useState<{ nome: string; foto_url: string | null } | null>(null);

    // Fetch admin profile for header
    useEffect(() => {
        if (isLoginPage) return;
        fetch("/api/admin/profile")
            .then(res => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then(data => {
                if (data && !data.error) {
                    setProfile({ nome: data.nome, foto_url: data.foto_url });
                }
            })
            .catch(() => {
                // If profile fetch fails, redirect to login
                router.push("/admin/login");
            });
    }, [isLoginPage, pathname, router]);

    // Auto-logout on tab/browser close
    useEffect(() => {
        if (isLoginPage) return;

        // Mark this session in sessionStorage
        const SESSION_KEY = "admin_session_active";
        const isActive = sessionStorage.getItem(SESSION_KEY);

        if (!isActive) {
            // First load in this tab — mark as active
            sessionStorage.setItem(SESSION_KEY, "1");
        }

        const handleUnload = () => {
            // On tab close or browser close, clear session
            // Use sendBeacon for reliable delivery on unload
            navigator.sendBeacon("/api/auth/logout");
            sessionStorage.removeItem(SESSION_KEY);
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [isLoginPage]);

    if (isLoginPage) return <>{children}</>;

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <AdminSidebar />
            <div className="pl-64 flex flex-col min-h-screen">
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-end sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">{profile?.nome || "Carregando..."}</p>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Administrador</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden relative">
                            <Image
                                src={(profile?.foto_url && (profile.foto_url.startsWith("/") || (function () { try { new URL(profile.foto_url); return true } catch { return false } })())) ? profile.foto_url : DEFAULT_AVATAR}
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
