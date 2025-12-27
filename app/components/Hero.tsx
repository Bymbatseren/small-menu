"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center md:pt-0">
            <div className="absolute inset-0 -z-10 bg-[radial-linear(ellipse_at_center,var(--tw-gradient-stops))] from-blue-100 via-white to-white opacity-50 dark:from-blue-900/20 dark:via-black dark:to-black" />

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl"
            >
                <span className="block text-black dark:text-white">Experience the</span>
                <span className="bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    Future of Menus
                </span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300 md:text-xl"
            >
                Түргэн, хялбар, орчин үеийн шийдэл. Таны ресторан, кафе-д зориулсан дижитал меню.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
                <Link
                    href="/admin"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-3 text-lg font-medium text-white transition-all hover:bg-gray-800 hover:scale-105 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    Эхлэх
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                    href="#features"
                    className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white/50 px-8 py-3 text-lg font-medium text-gray-900 backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:border-gray-800 dark:bg-black/50 dark:text-gray-100 dark:hover:bg-black"
                >
                    Дэлгэрэнгүй
                </Link>
            </motion.div>
        </section>
    );
}
