"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { OTPInputGroup } from "@/app/forget-password/_components/OTP";
import Step2, { Step3 } from "@/app/forget-password/_components/content";
import { AuthInputProps } from "@/utils/types";
import { setServers } from "dns";



const AuthInput = ({ icon: Icon, label, className, ...props }: AuthInputProps) => {
    return (
        <div className="group relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
                <Icon className="h-5 w-5" />
            </div>
            <input
                className={cn(
                    "peer w-full rounded-xl border border-gray-200 bg-gray-50/50 px-10 py-3 text-sm outline-none transition-all placeholder:text-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:focus:bg-black",
                    className
                )}
                placeholder={label}
                {...props}
            />
            <label className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-500 transition-all peer-focus:-top-2.5 peer-focus:left-1 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:left-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 dark:peer-focus:bg-black dark:peer-[:not(:placeholder-shown)]:bg-black">
                {label}
            </label>
        </div>
    );
};
export const ForgetPasswordForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(0)
    const [email, setEmail] = useState("");
    useEffect(()=>{
        if(email===""){
            setError("")
        }
    },[email])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        console.log(email)

        try {
            const res = await fetch("/api/auth/forget-password/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email}),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
            localStorage.setItem("email",email);
            setStep(1)
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {step === 0 && (
                <div className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/80">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"></h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Та өөрийн бүртгэлтэй э-мэйл хаягаа оруулна уу.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div className="space-y-4">
                            <AuthInput
                                icon={Mail}
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-500"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full overflow-hidden rounded-xl bg-black py-3 text-white transition-all hover:bg-gray-800 disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Нууц үг сэргээх"}
                                {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                            </span>
                        </button>

                       
                    </form>
                </div>
            )}
            {step === 1 && (
                <div className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/80">
                    <Step2 setStep={setStep}/>
                </div>
            )}
            {step==2 && (
                  <div className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/80">
                    <Step3 />
                </div>
            )}
        </>
    );
};