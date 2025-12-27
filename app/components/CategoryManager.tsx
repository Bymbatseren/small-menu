"use client";

import { useState } from "react";
import { createCategory, deleteCategory } from "@/app/actions/menu";
import { Trash, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CategoryManager({ categories }: { categories: any[] }) {
    const router = useRouter();
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        setLoading(true);
        await createCategory(newCategory);
        setNewCategory("");
        setLoading(false);
        router.refresh();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        setLoading(true);
        await deleteCategory(id);
        setLoading(false);
        router.refresh();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Шинэ категори  нэмэх</h2>
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Категори нэр (ж.н. Drinks)"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading || !newCategory.trim()}
                        className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-orange-600 text-white font-bold transition disabled:opacity-50 flex items-center gap-2"
                    >
                        <Plus size={20} /> Нэмэх
                    </button>
                </form>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Одоогийн категориуд</h2>
                <div className="space-y-3">
                    {categories.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">Одоогоор категори алга</p>
                    ) : (
                        categories.map((cat) => (
                            <div
                                key={cat._id}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                            >
                                <span className="font-medium text-white">{cat.name}</span>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    disabled={loading}
                                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
