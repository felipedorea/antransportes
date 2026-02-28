"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Plane, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Extras", href: "/extras" },
    { name: "Frota", href: "/frota" },
    { name: "Rotas", href: "/rotas" },
    { name: "FAQ", href: "/faq" },
    { name: "Recrutamento", href: "/recrutamento" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (pathname.startsWith("/admin")) return null;

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "bg-white/80 backdrop-blur-md shadow-md py-4" : "bg-transparent py-6"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Plane className="text-white w-6 h-6 rotate-45" />
                    </div>
                    <span className={cn(
                        "text-xl font-bold tracking-tight transition-colors",
                        (scrolled || pathname !== "/") ? "text-slate-900" : "text-white"
                    )}>
                        FS Brothers
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const isInitialHome = !scrolled && pathname === "/";

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-semibold transition-all hover:text-blue-600 relative py-1",
                                    isActive
                                        ? "text-blue-600"
                                        : (isInitialHome ? "text-white/90 hover:text-white" : "text-slate-600")
                                )}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                    <Link
                        href="/admin/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        Login Admin
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={cn(
                        "md:hidden transition-colors",
                        (scrolled || pathname !== "/") ? "text-slate-900" : "text-white"
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/admin/login"
                                className="block bg-blue-600 text-white text-center py-4 rounded-xl font-bold shadow-lg"
                            >
                                Login Admin
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
