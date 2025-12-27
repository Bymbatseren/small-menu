"use client";

import AdminSidebar from "@/app/components/AdminSidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
            <AdminSidebar open={mobileMenuOpen} setOpen={setMobileMenuOpen} />

            
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-black/50 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <h1 className="font-bold text-lg">Admin</h1>
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 rounded-lg bg-white/10 active:bg-white/20"
                >
                    <Menu size={20} />
                </button>
            </div>

            <main className="lg:ml-72 min-h-screen relative overflow-hidden">
            
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse-slow" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 lg:py-12 mt-16 lg:mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
