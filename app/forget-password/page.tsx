"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ForgetPasswordForm } from "../components/auth/forgetForm";

export default function ForgetPasswordPage() 
{
     function Back() {
        localStorage.clear(); 
    }
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-black">
            <div className="absolute inset-0 z-0">
                <div className="absolute bottom-[-10%] left-[-10%] h-125 w-125 rounded-full bg-teal-500/20 blur-[100px]" />
                <div className="absolute top-[-10%] right-[-10%] h-125 w-125 rounded-full bg-blue-500/20 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-6"
            >
                <Link
                    href="/sign-in"
                    onClick={Back}
                    className="mb-8 inline-flex items-center text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Буцах
                </Link>

               <ForgetPasswordForm/>
            </motion.div>
        </div>
    );
}
