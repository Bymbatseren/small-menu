import { getItemById, getOneCategory } from "@/app/actions/menu";
import AddItemPage from "../../add/page";

export default async function EditPage({ params }: any) {
  const { id } = params;

  const item = await getItemById(id);
  const category = await getOneCategory(id);

  return (
    <div>
      <AddItemPage category={category.item} item={item} />
    </div>
  );
}
