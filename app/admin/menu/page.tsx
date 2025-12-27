import { getItems, getCategories } from "@/app/actions/menu";
import MenuItemCard from "@/app/components/MenuItemCard";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const params = await searchParams   
  const selectedCategoryId =params.category || ""; 

  const items = await getItems();
  const categories = await getCategories();

  // Шүүж авах
const filteredItems = selectedCategoryId
  ? items.filter((item) => item.category?._id === selectedCategoryId)
  : items;

  return (
    <div className="space-y-6">
      <div className="md:flex text-center justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Цэсний менежмент</h1>
        </div>
        <div className="flex justify-center md:justify-end gap-3">
          <Link
            href="/admin/menu/categories"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition border border-white/10"
          >
            Төрөл удирдах
          </Link>
          <Link
            href="/admin/menu/add"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition font-medium shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} /> Нэмэх
          </Link>
        </div>
      </div>

      {/* Категориуд – таб маягаар */}
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {/* Бүгдийг харуулах таб */}
        <Link
          href="/admin/menu" // category байхгүй бол бүгдийг харуулна
          className={`inline-block py-3 px-8 rounded-xl font-bold uppercase tracking-wider transition ${
            !selectedCategoryId
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
              : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
          }`}
        >
          Бүгд
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/admin/menu?category=${cat._id}`} // URL-д category ID өгнө
            className={`inline-block py-3 px-8 rounded-xl font-bold uppercase tracking-wider transition ${
              selectedCategoryId === cat._id
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Item-үүд */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-3xl border border-white/10 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Энд одоогоор цэс байхгүй</h3>
          <p className="text-gray-400 mb-6">
            {selectedCategoryId
              ? "Энэ категорид цэс нэмнэ үү."
              : "Эхний бараагаа нэмээрэй."}
          </p>
          <Link
            href="/admin/menu/add"
            className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition font-medium"
          >
            Цэс нэмэх
          </Link>
        </div>
      ) : (
        <div className="grid mx-9 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredItems.map((item: any) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}