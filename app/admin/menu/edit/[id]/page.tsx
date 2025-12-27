import { getItemById, getOneCategory } from "@/app/actions/menu";
import { Props } from "@/utils/types";
import AddItemPage from "../../add/page";

export default async function EditPage({ params }: Props){
    const { id } = await params;
    const item=await getItemById(id)
    const category=await getOneCategory(id)
    return <>
    <div>
       <AddItemPage category={category.item} item={item}/>
    </div>
    </>
}