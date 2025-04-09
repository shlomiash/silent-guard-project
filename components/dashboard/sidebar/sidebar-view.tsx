'use client'

import { Button } from '@/components/ui/button';
import { Video, Eye } from 'lucide-react'; // Make sure to import appropriate icons
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideBarView() {

  const pathname = usePathname();

    const linkStyling = pathname === '/dashboard/live-view'? '' : "flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-md transition"



    return (
      <div className="flex flex-col gap-2 ">
        <Link
        href="/dashboard/live-view"
        className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md transition ${
          pathname === '/dashboard/live-view'
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        <Eye className="w-4 h-4" />
        Live View
      </Link>
      <Link href="/dashboard/recordings"  className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md transition ${
          pathname === '/dashboard/recordings'
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-700 hover:text-blue-600  '
        }`}  >
        <Video className="w-4 h-4" />
        Recordings
      </Link>
    </div>
    )
  }