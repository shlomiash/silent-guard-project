// Shadcn Imports
import { ScrollArea } from "@/components/ui/scroll-area"

//My Imports
import AddCategoryButton from "./sidebar-add-category"

//Categories Data
import { handleFetchCategories } from "@/server/actions/handle-fetch-categories"

export default async function ScrollAreaView() {
    //Fetching the categories from the server
    const categoriesArray = await handleFetchCategories();


    return (
      <div className="flex flex-col space-y-4 justify-center items-center">
        {/* Scroll bar for the categories */}
        <div>
          <ScrollArea className=" h-42 w-50 flex justify-center items-center">
          <div>
            <ul className="space-y-4">
              {categoriesArray.map((category) => (
                  <li key={category.name} className=" hover:bg-slate-300 p-1 transition rounded-lg cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <span className="size-3 rounded-full opacity-50" style={{ backgroundColor: category.color  }}  ></span>
                      <span >{category.name}</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
         </ScrollArea>
        </div>
         <div>
            <AddCategoryButton/>
         </div>
      </div>
      
    )
  }