"use client";

import { Edit, Trash, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toggleItemVisibility, deleteItem } from "@/app/actions/menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Item } from "@/types";



export default function MenuItemCard({ item }: { item: Item }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        await toggleItemVisibility(item._id, item.isActive);
        setLoading(false);
        router.refresh();
    };

    const handleDelete = async () => {
        setLoading(true);
        await deleteItem(item._id);
        setLoading(false);
        router.refresh();
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-[#121212] rounded-3xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500 shadow-xl"
        >

            <div className="h-58 lg:h-80 relative overflow-hidden bg-zinc-900">
                {item.image ? (
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.7 }}
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-fill"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-900">
                        <span className="text-4xl mb-2">🍽️</span>
                        <span className="text-sm font-medium">No Image</span>
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <div className={`w-15 flex justify-center h-5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10 shadow-lg ${item.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {item.isActive ? "Active" : "Hidden"}
                    </div>
                </div>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">

                    <h3 className="font-bold text-lg text-white leading-tight mb-1">{item.title}</h3>


                    <p className="font-bold text-xl text-transparent bg-clip-text bg-blue-500 to-amber-200">
                        {item.price.toLocaleString()}₮
                    </p>
                </div>
                <span className="inline-block  p-1 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400">
                    {typeof item.category === 'object' && item.category !== null && 'name' in item.category ? item.category.name : "General"}
                </span>

                <p className="text-gray-500 mt-3 text-sm mb-6 line-clamp-2 min-h-10 leading-relaxed">
                    {item.description || "No description provided."}
                </p>


                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={handleToggle}
                        disabled={loading}
                        className="flex items-center justify-center py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                        title="Toggle Visibility"
                    >
                        {item.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <Link
                        href={`/admin/menu/edit/${item._id}`}
                        className="flex items-center justify-center py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                        title="Edit Item"
                    >
                        <Edit size={18} />
                    </Link>
                    <button
                        onClick={() => setShowConfirm(true)}
                        disabled={loading}
                        className="flex items-center justify-center py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete Item"
                    >
                        <Trash size={18} />
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {showConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center space-y-6">
                            <p className="text-white text-lg font-medium">Та энэ цэсийг устгахдаа итгэлтэй байна уу?</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setShowConfirm(false)} className="px-6 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition">Цуцлах</button>
                                <button onClick={handleDelete} className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition">Устгах</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

    );
}
