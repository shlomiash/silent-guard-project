

import CategoryModeView from "@/components/category/category-mode";
import CategoryIdError from "@/components/category/error-category";
import { checkCategoryId } from "@/server/actions/check-category";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: { categoryId: string } }) {

   const res = await checkCategoryId(params.categoryId)

   if(res.error) {
    return <CategoryIdError/>
   }


  return (
    <CategoryModeView categoryId={params.categoryId}/>
  );
}