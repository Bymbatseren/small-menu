"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/app/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ElementType;
    label: string;
}

export const AuthInput = ({ icon: Icon, label, className, ...props }: AuthInputProps) => {
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

export const SignInForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/sign-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");

            router.push("/admin");
            router.refresh();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-4">
                <AuthInput
                    icon={Mail}
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <div className="relative">
                    <AuthInput
                        icon={Lock}
                        label="Нууц үг"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
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
            <p className="text-end text-sm text-gray-500">
                <Link href="/forget-password" className="font-semibold  text-blue-600 hover:text-blue-500 hover:underline">
                    Нууц үг мартсан?
                </Link>
            </p>

            <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-black py-3 text-white transition-all hover:bg-gray-800 disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
                <span className="relative cursor-pointer z-10 flex items-center justify-center gap-2 font-medium">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Нэвтрэх"}
                    {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </span>
            </button>

            <p className="text-center text-sm text-gray-500">
                Бүртгэлгүй юу??{" "}
                <Link href="/sign-up" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
                    Бүртгүүлэх
                </Link>
            </p>
        </form>
    );
};

export const SignUpForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/sign-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");

            router.push("/sign-in");
            router.refresh();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-4">
                <AuthInput
                    icon={User}
                    label="Байгууллагын нэр"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <AuthInput
                    icon={Mail}
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <div className="relative">
                    <AuthInput
                        icon={Lock}
                        label="Нууц үг"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
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
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Бүртгэл үүсгэх"}
                    {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </span>
            </button>

            <p className="text-center text-sm text-gray-500">
                Бүртгэлтэй юу?{" "}
                <Link href="/sign-in" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
                    Нэвтрэх
                </Link>
            </p>
        </form>
    );
};
