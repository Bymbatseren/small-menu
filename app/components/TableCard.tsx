"use client";

import { QRCodeSVG } from "qrcode.react";
import { Trash } from "lucide-react";
import { deleteTable } from "@/app/actions/table";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface TableCardProps {
    table: {
        _id: string;
        name: string;
        tableCode: string;
    };
}

export default function TableCard({ table }: TableCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const orderUrl = `http://localhost:3000/order/?table=${table.tableCode}`;

    const handleDelete = async () => {
        if (!confirm(`Delete ${table.name}?`)) return;
        setLoading(true);
        await deleteTable(table._id,table.tableCode);
        setLoading(false);
        router.refresh();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-[#121212] rounded-3xl p-6 border border-white/5 hover:border-orange-500/30 shadow-xl transition-colors relative overflow-hidden group"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex flex-col items-center gap-6">
                <div className="bg-white p-3 rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <QRCodeSVG value={orderUrl} size={160} level="M" />
                </div>

                <div className="text-center">
                    <h3 className="font-bold text-2xl text-white mb-1">{table.name}</h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-sm font-mono tracking-wider border border-white/5">
                        {table.tableCode}
                    </div>
                </div>

                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <Trash size={18} /> Delete Table
                </button>
            </div>
        </motion.div>
    );
}
