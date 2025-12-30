"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface CartFloatingButtonProps {
    itemCount: number;
    totalPrice: number;
    onClick: () => void;
}

export default function CartFloatingButton({
    itemCount,
    totalPrice,
    onClick,
}: CartFloatingButtonProps) {
    return (
        <AnimatePresence>
            {itemCount > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
                >
                    <button
                        onClick={onClick}
                        className="w-full bg-black/80 backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between group border border-white/10"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                                {itemCount}
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-gray-300 font-medium">Таны захиалга</p>
                                <p className="font-bold text-lg leading-none">
                                    {new Intl.NumberFormat("mn-MN").format(totalPrice)}₮
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pr-2">
                            <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                Харах
                            </span>
                            <div className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center">
                                <ShoppingBag size={16} />
                            </div>
                        </div>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
