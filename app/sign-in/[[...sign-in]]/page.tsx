"use client";

import { SignInForm } from "@/app/components/auth/AuthForms";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-black">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] h-125 w-125 rounded-full bg-blue-500/20 blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] h-125 w-125 rounded-full bg-violet-500/20 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-6"
            >
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Буцах
                </Link>

                <div className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/80">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Тавтай морил👋</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                           Бүртгэлдээ нэвтрэхийн тулд мэдээллээ оруулна уу.
                        </p>
                    </div>

                    <SignInForm />
                </div>
            </motion.div>
        </div>
    );
}
