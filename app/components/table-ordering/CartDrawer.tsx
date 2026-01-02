"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import { Item } from "@/types";
import Image from "next/image";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    cart: { item: Item; quantity: number }[];
    onUpdateQuantity: (itemId: string, delta: number) => void;
    onCheckout: () => void;
}

export default function CartDrawer({
    isOpen,
    onClose,
    cart,
    onUpdateQuantity,
    onCheckout,
}: CartDrawerProps) {
    const totalAmount = cart.reduce(
        (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
        0
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                  
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-black rounded-t-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                    >
                       
                        <div className="w-full h-6 flex items-center justify-center shrink-0" onClick={onClose}>
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                        </div>

                    
                        <div className="px-6 pb-4 flex items-center justify-between  shrink-0">
                            <h2 className="text-2xl font-bold text-white">Таны сагс</h2>
                            <button
                                onClick={onClose}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                       
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20  rounded-full flex items-center justify-center">
                                        <Trash2 size={32} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-white">Сагс хоосон байна</p>
                                        <p className="text-gray-500 text-sm mt-1">Та цэснээс сонголт хийнэ үү</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full mt-4"
                                    >
                                        Цэс рүү буцах
                                    </button>
                                </div>
                            ) : (
                                cart.map(({ item, quantity }) => (
                                    <div key={item._id} className="flex gap-4">
                                        {/* Image */}
                                        <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-white text-gray-300">
                                                    <div className="text-3xl">🍜</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-white line-clamp-2 leading-tight">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    {new Intl.NumberFormat("mn-MN").format(item.price)}₮
                                                </p>
                                            </div>

                                            {/* Quantity Control */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => onUpdateQuantity(item._id, -1)}
                                                    className="w-8 h-8 rounded-full  flex items-center justify-center active:bg-gray-100 transition-colors"
                                                >
                                                    {quantity === 1 ? (
                                                        <Trash2 size={14} className="text-red-500" />
                                                    ) : (
                                                        <Minus size={14} className="text-white" />
                                                    )}
                                                </button>
                                                <span className="font-semibold text-white w-4 text-center">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() => onUpdateQuantity(item._id, 1)}
                                                    className="w-8 h-8 rounded-full  bg-black text-white flex items-center justify-center active:bg-gray-800 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {cart.length > 0 && (
                            <div className="p-6   bg-black shrink-0 pb-10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-white">Нийт дүн</span>
                                    <span className="text-2xl font-bold text-white">
                                        {new Intl.NumberFormat("mn-MN").format(totalAmount)}₮
                                    </span>
                                </div>
                                <button
                                    onClick={onCheckout}
                                    className="w-full bg-black   text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                                >
                                    <span>Захиалах</span>
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
