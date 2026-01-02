"use client";

import { Item } from "@/types";
import { motion } from "framer-motion";
import {  Plus } from "lucide-react";
import Image from "next/image";


interface ProductCardProps {
    product: Item;
    onAddToCart: (product: Item) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 rounded-3xl p-3 shadow-lg  backdrop-blur-md shadow-sm border border-white/10 relative overflow-hidden group"
        >
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-200">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <div className="text-3xl">🍜</div>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="font-semibold text-zinc-100 text-base line-clamp-1 leading-tight">
                    {product.title}
                </h3>
              

                <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-lg text-white">
                        {new Intl.NumberFormat("mn-MN").format(product.price)}₮
                    </span>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onAddToCart(product)}
                        className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
                    >
                        <Plus size={16} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
