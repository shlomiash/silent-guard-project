
import { Video, Eye } from 'lucide-react'; // Make sure to import appropriate icons

export default function SideBarContent() {
    return (
      <div className="flex flex-col gap-2 ">
      <button className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-md transition">
        <Eye className="w-4 h-4" />
        Live View
      </button>
      <button className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-md transition">
        <Video className="w-4 h-4" />
        Recordings
      </button>
    </div>
    )
  }