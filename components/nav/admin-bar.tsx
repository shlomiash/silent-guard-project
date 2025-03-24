
//General imports
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

//ShadcnUi imports
import { Button } from "../ui/button";

//My components
import UserProfileAvatar from "./user-profile-avatar";
import SignOutButton from "./signout-button";

export default function AdminBar({session}:{session: Session}) {
  return (
   <div className="flex space-x-12">
        <SignOutButton/>
        <UserProfileAvatar session={session}/>
   </div>
  );
}