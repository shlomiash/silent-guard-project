//General imports
import Link from "next/link";

//ShadcnUi imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

//Auth imports
import { Session } from "next-auth";

export default function UserProfileAvatar({session}:{session: Session}) {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="size-10">
          <AvatarImage/>
          <AvatarFallback className="bg-blue-300">{session.user?.name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>WANNNA SEE SOMETHING COOOOLLL???</DropdownMenuLabel>
    
      </DropdownMenuContent>
    </DropdownMenu>
   
  );
}