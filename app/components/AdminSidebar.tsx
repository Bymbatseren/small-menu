"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    UtensilsCrossed,
    QrCode,
    ClipboardList,
    Settings,
    LogOut,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Menu", href: "/admin/menu", icon: UtensilsCrossed },
    { name: "Tables", href: "/admin/tables", icon: QrCode },
    { name: "Orders", href: "/admin/orders", icon: ClipboardList },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({
    open,
    setOpen
}: {
    open?: boolean;
    setOpen?: (open: boolean) => void
}) {
    // If setOpen is provided, we are in mobile controlled mode. 
    // Otherwise, we default to always visible (desktop sidebar).
    // Actually, to make it cleaner, let handles its own state for mobile or rely on props.
    // I will make it accept props for mobile visibility.

    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/log-out", {
                method: "POST",
                headers: { "content-Type": "application/json" },
            });
            if (res.ok) {
                window.location.href = "/";
            }
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-8 pb-4">
                <h1 className="text-2xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Admin<span className="text-blue-500">.</span>
                </h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-medium">Control Panel</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen && setOpen(false)}
                            className="relative group block"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                            <div className={cn(
                                "relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "text-white"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}>
                                <Icon size={20} className={cn("transition-colors", isActive ? "text-blue-400" : "group-hover:text-white")} />
                                <span className="font-medium tracking-wide">{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Log Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <>

            <aside className="hidden lg:flex w-72 bg-black/40 backdrop-blur-2xl border-r border-white/10 h-screen flex-col fixed left-0 top-0 z-50 text-white shadow-2xl">
                <SidebarContent />
            </aside>


            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen && setOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#0a0a0a] border-r border-white/10 z-50"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
