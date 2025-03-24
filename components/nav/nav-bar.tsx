//General imports
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";

//Component imports
import LoginButton from "./login-button";
import AdminBar from "./admin-bar";

export default async function NavBar() {
  const session = await auth();
  return (
    <nav className=" pt-4 pb-4 px-2 md:pt-6 md:pb-8">
      <ul className="flex justify-between items-center w-full">
        <li className="text-sm tracking-wider">
          <Link href="/">
            <Image
              src="/SilentGuard.png" // Path to your image
              alt="Profile picture"
              width={100} // Desired width
              height={100} // Desired height
            />
          </Link>
        </li>
        <li>
          {session ? <AdminBar session={session}/> : <LoginButton />}
        </li>
      </ul>
    </nav>
  );
}
