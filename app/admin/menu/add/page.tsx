"use client";

import {
    createItem,
    updateItem,
    getCategories,
    createItemCorrect,
} from "@/app/actions/menu";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImageIcon, ArrowLeft, Trash2, CheckCircle } from "lucide-react";
import { Category, Item, Toast } from "@/types";



export default function AddItemPage({ item, category }: { item?: Item, category?: Category }) {
    const router = useRouter();
    const isEdit = Boolean(item?._id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [image, setImage] = useState("");
    const [isDirty, setIsDirty] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [dirtyModal, setDirtyModal] = useState(false)
    const [toasts, setToasts] = useState<Toast[]>([]);
    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    useEffect(() => {
        if (item?.image) {
            setAvatarPreview(item.image);
            setImage(item.image);
        }
    }, [item]);
    useEffect(() => {
        const handleWindowClose = (e: BeforeUnloadEvent) => {
            if (!isDirty) return;
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handleWindowClose);
        return () => window.removeEventListener("beforeunload", handleWindowClose);
    }, [isDirty]);
    const addToast = (message: string, type: "success" | "error") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };
    const handleUpload = async (input: HTMLInputElement) => {
        if (!input.files?.length) return;
        const file = input.files[0];

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
            setIsDirty(true);
        };
        reader.readAsDataURL(file);

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "Xanen_cloudinary");

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/df88yvhqr/image/upload",
            { method: "POST", body: data }
        );
        const json = await res.json();
        setImage(json.secure_url);
    };
    const handleImageDelete = async () => {
        if (!image) return;

        const res = await fetch("/api/delete-image", {
            method: "POST",
            body: JSON.stringify({ url: image }),
        });
        if (!res.ok) {
            addToast("Зураг устгахад алдаа гарлаа", "error");
            return;
        }

        setAvatarPreview(null);
        setImage("");
        setIsDirty(true);
        addToast("Зураг устлаа", "success");
    };
    const handleSubmit = async () => {
        setShowConfirm(false);
        setLoading(true);
        setError("");

        const form = document.getElementById("menuForm") as HTMLFormElement;
        const formData = new FormData(form);

        const payload = {
            title: (formData.get("title") as string) ?? "",
            category: (formData.get("category") as string) ?? "",
            price: Number(formData.get("price")),
            description: (formData.get("description") as string) ?? "",
            image,
            isActive: true,
        };
        if (isNaN(payload.price) || payload.price <= 0) {
            setError("Үнэ 0-с их байх ёстой");
            setLoading(false);
            return;
        }
        if (isEdit && !item) {
            setError("Засах item олдсонгүй");
            setLoading(false);
            return;
        }


        try {
            let res;
            if (isEdit && item) res = await updateItem(item._id, payload);
            else res = await createItemCorrect(payload);

            if (res.success) {
                addToast(isEdit ? "Цэс амжилттай шинэчлэгдлээ" : "Цэс амжилттай үүсгэгдлээ", "success");
                router.push("/admin/menu");
            } else throw new Error(res.error || "Алдаа гарлаа");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                addToast(err.message, "error");
            } else {
                setError("An error occurred");
                addToast("An error occurred", "error");
            }
        } finally {
            setLoading(false);
        }
    };
    console.log(item?.category)

    const filteredCategories = category
        ? categories.filter((c) => c._id !== category._id)
        : categories;

    return (
        <div className="min-h-screen  text-white py-14 px-6">
            <div className="max-w-5xl mx-auto">

                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight">{isEdit ? "Цэс засах" : "Шинэ цэс нэмэх"}</h1>
                        <p className="text-gray-400 mt-2 text-sm">Admin panel · Menu management</p>
                    </div>
                    <button
                        onClick={() => {
                            if (isDirty) setDirtyModal(true);
                            else router.back();
                        }}

                        className="flex items-center cursor-pointer gap-2 text-gray-300 hover:text-white transition"
                    >
                        <ArrowLeft size={18} />
                        Буцах
                    </button>
                </div>


                <form id="menuForm" onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="relative">
                        <label htmlFor="avatar">
                            <motion.div whileHover={{ scale: 1.02 }} className="relative h-90 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden cursor-pointer">
                                {avatarPreview ? (
                                    <img src={avatarPreview} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <ImageIcon size={42} />
                                        <p className="mt-4 text-sm">Зураг оруулах</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                                    <Upload size={32} />
                                </div>
                            </motion.div>
                        </label>

                        {avatarPreview && (
                            <button type="button" onClick={() => setShowDeleteModal(true)} className="cursor-pointer absolute top-3 right-3 bg-red-500/70 hover:bg-red-500 text-white px-3 py-1 rounded z-10">
                                <Trash2 size={16} className="inline" /> Устгах
                            </button>
                        )}
                        <input id="avatar" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleUpload(e.target)} />
                    </div>


                    <div className="lg:col-span-2 space-y-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                        {error && <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-300">{error}</div>}

                        <div>
                            <label className="text-sm text-gray-400">Нэр</label>
                            <input name="title" defaultValue={item?.title ?? ""} required onChange={() => setIsDirty(true)} className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-400">Категори</label>
                                <select name="category" required onChange={() => setIsDirty(true)} className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3">
                                    {category && <option value={category._id} >{category.name}</option>}

                                    {filteredCategories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-400">Үнэ (₮)</label>
                                <input name="price" type="number" step="0.01" defaultValue={item?.price ?? ""} onChange={() => setIsDirty(true)} className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">Тайлбар</label>
                            <textarea name="description" rows={4} defaultValue={item?.description ?? ""} onChange={() => setIsDirty(true)} className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 resize-none" />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={loading} className="px-10 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium disabled:opacity-50">
                                {loading ? "Хадгалж байна..." : isEdit ? "Шинэчлэх" : "Үүсгэх"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-900  rounded-2xl p-8 max-w-sm w-full text-center space-y-6">
                            <p className="text-white text-lg font-medium">Та энэ зургийг устгахдаа итгэлтэй байна уу?</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2 rounded-xl bg-gray-700 cursor-pointer hover:bg-gray-600 text-white transition">Цуцлах</button>
                                <button onClick={async () => { await handleImageDelete(); setShowDeleteModal(false); }} className="px-6 py-2 cursor-pointer rounded-xl bg-red-600 hover:bg-red-500 text-white transition">Устгах</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {dirtyModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center space-y-6">
                            <p className="text-white text-lg font-medium">Та өөрчлөлтүүдээ хадгалалгүй гарах гэж байна. Үргэлжлүүлэх үү?</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setDirtyModal(false)} className="px-6 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition">Үгүй</button>
                                <button onClick={() => router.back()} className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition">Тийм</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center space-y-6">
                            <p className="text-white text-lg font-medium">Та form-ийг хадгалахдаа итгэлтэй байна уу?</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setShowConfirm(false)} className="px-6 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition">Цуцлах</button>
                                <button onClick={handleSubmit} className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition">Хадгалах</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div key={t.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className={`px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 ${t.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                            <CheckCircle size={16} />
                            {t.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
