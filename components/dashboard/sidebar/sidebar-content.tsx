
// ShadCn Imports
import { ScrollArea } from "@/components/ui/scroll-area"

//My Imports
import AddCategoryButton from "./sidebar-add-category"

//Temporary data
const categories = [
  {name:"Guy's Shower1", color:'#10B981' },
  {name:"Guy's Shower2", color:'#3B82F6' },
  {name:"Guy's Shower3", color:'#FACC15' },
  {name:"Guy's Shower5", color:'#EF4444' },
  {name:"Guy's Shower6", color:'#EF4444' },
  {name:"Guy's Shower7", color:'#EF4444' },
  {name:"Guy's Shower8", color:'#EF4444' },
]

export default function SideBarView() {

    return (
      <div className="flex flex-col space-y-4 justify-center items-center">
        {/* Scroll bar for the categories */}
        <div>
          <ScrollArea className=" h-42 w-50 flex justify-center items-center">
          <div>
            <ul className="space-y-4">
              {categories.map((category) => (
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