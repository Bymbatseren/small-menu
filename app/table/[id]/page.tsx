import { getCategories, getItems } from "@/app/actions/menu";
import TableMenu from "@/app/components/table-ordering/TableMenu";

export default async function Order({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  // Fetch data in parallel
  const [categories, items] = await Promise.all([
    getCategories(),
    getItems()
  ]);

  return (
    <main className="min-h-screen">
      <TableMenu
        categories={categories}
        items={items}
        tableId={id}
      />
    </main>
  );
}
