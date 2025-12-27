import { getCategories } from "@/app/actions/menu";
import CategoryManager from "@/app/components/CategoryManager";

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Категори удирдах</h1>
            <CategoryManager categories={categories} />
        </div>
    );
}
