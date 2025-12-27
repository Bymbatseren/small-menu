import { ArrowRight, Loader2 } from "lucide-react";
import { OTPInputGroup } from "./OTP";
import { motion } from "framer-motion";
import Link from "next/link";
import { AuthInput } from "@/app/components/auth/AuthForms";
import { Eye, EyeOff, Mail, Lock, User, } from "lucide-react";
import { useDebugValue, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { validatePassword } from "@/utils/validate";
import { Step2InputProps } from "@/utils/types";

export default function Step2({ setStep }: Step2InputProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [otp, setOtp] = useState<string>("")
    
 const handleSubmitOtp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const email = localStorage.getItem("email") || "";

  if (otp.length < 6) {
    setError("OTP код бүрэн биш байна");
    setLoading(false);
    return;
  }

  try {
    const res = await fetch("/api/auth/forget-password/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "OTP код буруу байна");

    localStorage.setItem("resetToken", data.resetToken);
    setStep(2);

  } catch (err: any) {
    setError(err.message || "OTP код буруу байна");
    setOtp(""); 
  } finally {
    setLoading(false);
  }
};


    return <>
        <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"></h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Таны э-мэйлээр ирсэн баталгаажуулах кодыг оруулна уу.
            </p>
        </div>

        <div className="w-full space-y-6">
            <div className="flex justify-center">
                <OTPInputGroup length={6} onChange={setOtp} />
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
                onClick={handleSubmitOtp}
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-black py-3 text-white transition-all hover:bg-gray-800 disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
                <span className="relative z-10 flex items-center justify-center cursor-pointer gap-2 font-medium">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin " /> : "Баталгаажуулах"}
                    {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </span>
            </button>

            <p className="text-center text-sm text-gray-500">
                Бүртгэлгүй юу?{" "}
                <Link href="/sign-up" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
                    Бүртгүүлэх
                </Link>
            </p>
        </div>
    </>
}



export function Step3() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (password === "" && confirmPassword === "") {
            setError("")
        }
    }, [password])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validatePassword({
            password,
            confirmPassword,
            setError,
        }

        )
        if (!isValid) {
            return;
        }
        setLoading(true);
        setError("");
        const token = localStorage.getItem("resetToken");

        if (!token) {
            setError("Reset token олдсонгүй");
            return;
        }


        try {
            const res = await fetch("/api/auth/forget-password/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({token,newPassword:password}),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
            localStorage.clear(); 
            router.push("/sign-in");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return <>
        <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"></h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Шинэ нууц үгээ тохируулна уу
            </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-4">
                <div className="relative">
                    <AuthInput
                        icon={Lock}
                        label="Шинэ нууц үг"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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


            <div className="space-y-4">
                <div className="relative">
                    <AuthInput
                        icon={Lock}
                        label="Нууц үг давтах"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Нууц үг шинэчлэх"}
                    {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </span>
            </button>

         
        </form>
    </>
}