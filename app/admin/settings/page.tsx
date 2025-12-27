"use client";

import { useState, useEffect } from "react";
import { getCompanySettings, updateCompanySettings, extendSubscription } from "@/app/actions/settings";
import { Save, CreditCard, Calendar } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchSettings() {
            const res = await getCompanySettings();
            setSettings(res);
            setLoading(false);
        }
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            logo: formData.get("logo") as string,
            email: formData.get("email") as string,
        };

        const res = await updateCompanySettings(data);
        if (res.success) {
            setMessage("Settings updated successfully!");
            // Refresh local state
            setSettings({ ...settings, ...data });
        } else {
            setMessage("Error updating settings: " + res.error);
        }
        setSaving(false);
        setTimeout(() => setMessage(""), 3000);
    };

    const handlePay = async () => {
        if (!confirm("Proceed to payment? (This is a demo action)")) return;
        await extendSubscription();
        // Refresh
        const res = await getCompanySettings();
        setSettings(res);
        alert("Subscription extended!");
    };

    if (loading) return <div className="text-white text-center py-12">Loading settings...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your account and subscription</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-8">

                {/* Subscription Info */}
                <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 p-6 rounded-2xl border border-orange-500/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-orange-400 mb-1 flex items-center gap-2">
                                <CreditCard size={18} /> Current Plan: {settings.plan}
                            </h3>
                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                <Calendar size={16} />
                                Valid until: {settings.subscriptionExpiresAt ? new Date(settings.subscriptionExpiresAt).toLocaleDateString() : "No active subscription"}
                            </p>
                        </div>
                        <button
                            onClick={handlePay}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-orange-500/20"
                        >
                            {settings.plan === "FREE" ? "Upgrade" : "Extend"}
                        </button>
                    </div>
                </div>

                {/* General Settings Form */}
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            defaultValue={settings.email}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Logo URL</label>
                        <input
                            name="logo"
                            defaultValue={settings.logo}
                            placeholder="https://..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
                        />
                        {settings.logo && (
                            <div className="mt-2 text-sm text-gray-500">
                                <p>Preview:</p>
                                <img src={settings.logo} alt="Logo Preview" className="h-12 w-auto object-contain mt-1 rounded" />
                            </div>
                        )}
                    </div>

                    {message && (
                        <div className={`p-3 rounded-xl text-center text-sm ${message.includes("Error") ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition flex justify-center items-center gap-2"
                    >
                        <Save size={20} /> {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
