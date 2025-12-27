"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

export default function NavBar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50",
                "bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-white/10 dark:border-white/5",
                "flex items-center justify-between px-6 py-4 md:px-12"
            )}
        >
            <div className="text-xl font-bold tracking-tight">
                Menu<span className="text-blue-500">Snap</span>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600 dark:text-gray-300">
                <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
                    Home
                </Link>
                <Link href="#features" className="hover:text-black dark:hover:text-white transition-colors">
                    Features
                </Link>
                <Link href="#about" className="hover:text-black dark:hover:text-white transition-colors">
                    About
                </Link>
            </div>

            <div>
                <Link
                    href="/admin"
                    className={cn(
                        "rounded-full px-5 py-2 text-sm font-medium transition-all",
                        "bg-black text-white hover:bg-gray-800",
                        "dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    )}
                >
                    Admin Portal
                </Link>
            </div>
        </motion.nav>
    );
}
