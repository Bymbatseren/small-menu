import { getItemById, getOneCategory } from "@/app/actions/menu";
import AddItemPage from "../../add/page";

import { PageProps } from "@/types";

export default async function EditPage({ params }: PageProps) {
  const { id } = await params;

  const item = await getItemById(id);
  const category = await getOneCategory(id);

  return (
    <div>
      <AddItemPage category={category.item} item={item} />
    </div>
  );
}
