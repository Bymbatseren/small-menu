"use client";

import { useState, useMemo } from "react";
import { Category, Item } from "@/types";
import CategoryList from "./CategoryList";
import ProductCard from "./ProductCard";
import CartFloatingButton from "./CartFloatingButton";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

interface TableMenuProps {
    categories: Category[];
    items: Item[];
    tableId: string;
}

export default function TableMenu({
    categories,
    items,
    tableId,
}: TableMenuProps) {
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [cart, setCart] = useState<{ item: Item; quantity: number }[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesCategory =
                activeCategory === "all" ||
                (typeof item.category === 'string'
                    ? item.category === activeCategory
                    : item.category?._id === activeCategory);

            const matchesSearch = item.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [items, activeCategory, searchQuery]);

    const addToCart = (product: Item) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.item._id === product._id);
            if (existing) {
                return prev.map((i) =>
                    i.item._id === product._id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { item: product, quantity: 1 }];
        });
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.item.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen  pb-32">
           
            <div className="sticky top-0 z-40  backdrop-blur-md  ">
                <div className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-white font-medium">Ширээ</p>
                        <h1 className="text-xl font-bold text-white leading-none">#{tableId}</h1>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Хайх..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-black text-sm w-32 focus:w-48 transition-all duration-300 outline-none focus:ring-2 focus:ring-black/5"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
                    </div>
                </div>

                <CategoryList
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelectCategory={setActiveCategory}
                />
            </div>

        
            <div className="p-4">
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p>Бүтээгдэхүүн олдсонгүй</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item) => (
                                <ProductCard
                                    key={item._id}
                                    product={item}
                                    onAddToCart={addToCart}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <CartFloatingButton
                itemCount={totalItems}
                totalPrice={totalPrice}
                onClick={() => {
                    
                    alert("Сагс харах хэсэг удахгүй хийгдэнэ!");
                }}
            />
        </div>
    );
}
