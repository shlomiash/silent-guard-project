// Shadcn Imports
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

//My Imports
import AddCategoryButton from "./sidebar-add-category"
import CategoryDropDown from "./category-drop-down"

//Categories Data
import { handleFetchCategories } from "@/server/actions/handle-fetch-categories"

export default async function ScrollAreaView() {
    //Fetching the categories from the server
    const categoriesArray = await handleFetchCategories();
    console.log(categoriesArray)


    return (
      <div className="flex flex-col space-y-4 justify-center items-center">
        {/* Scroll bar for the categories */}
        <div>
          <ScrollArea className=" h-42 w-50 flex justify-center items-center">
          <div>
            <ul className="space-y-4">
              {categoriesArray.map((category) => (
                <div className='grid grid-cols-6 items-center hover:bg-slate-300 p-1 transition rounded-lg cursor-pointer' key={category.name}>
                  <div className='col-span-4'>
                    <li key={category.name} className=" ">
                      <div className="flex items-center space-x-4">
                        <span className="size-3 rounded-full opacity-50" style={{ backgroundColor: category.color  }}  ></span>
                        <span >{category.name}</span>
                      </div>
                    </li>
                  </div>
                  <div className='col-span-2'>
                    <CategoryDropDown categoryID={category.id}/>
                  </div>
                  
                </div>
                  
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