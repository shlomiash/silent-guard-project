'use client'

import { useCategoryMode } from '@/components/context/mode-context';
import { Button } from '@/components/ui/button';
import { Video, Eye } from 'lucide-react'; // Make sure to import appropriate icons
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideBarView() {


    const { categoryMode, setCategoryMode } = useCategoryMode();

    return (
      <div className="flex flex-col gap-2 ">
        <button
        onClick={() => setCategoryMode('cameras')}
        className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md transition ${
          categoryMode === 'cameras'
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        <Eye className="w-4 h-4" />
        Live View
      </button>
      <button
       onClick={() => setCategoryMode('recordings')}
       className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md transition ${
          categoryMode === 'recordings'
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-700 hover:text-blue-600  '
        }`}  >
        <Video className="w-4 h-4" />
        Recordings
      </button>
    </div>
    )
  }