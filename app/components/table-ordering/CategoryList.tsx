"use client";

import { Category } from "@/utils/types";
import { motion } from "framer-motion";

interface CategoryListProps {
    categories: Category[];
    activeCategory: string;
    onSelectCategory: (id: string) => void;
}

export default function CategoryList({
    categories,
    activeCategory,
    onSelectCategory,
}: CategoryListProps) {
    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar">
            <div className="flex space-x-3 px-4 min-w-max">
                <button
                    onClick={() => onSelectCategory("all")}
                    className={`
              relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
              ${activeCategory === "all"
                            ? "text-white shadow-lg shadow-black/20"
                            : "text-white border-white/10 hover:text-white bg-white/5 hover:bg-white/80"
                        }
            `}
                >
                    {activeCategory === "all" && (
                        <motion.div
                            layoutId="activeCategory"
                            className="absolute inset-0 bg-amber-500 hover:bg-amber-400 
               text-zinc-900 font-semibold  rounded-full"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10">Бүгд</span>
                </button>

                {categories.map((category) => (
                    <button
                        key={category._id}
                        onClick={() => onSelectCategory(category._id)}
                        className={`
              relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
              ${activeCategory === category._id
                                ? "text-white shadow-lg shadow-black/20"
                                : "text-white hover:text-white bg-white/5 hover:bg-white/80"
                            }
            `}
                    >
                        {activeCategory === category._id && (
                            <motion.div
                                layoutId="activeCategory"
                                className="absolute inset-0 bg-amber-500 hover:bg-amber-400 
               text-zinc-900 font-semibold  rounded-full"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
