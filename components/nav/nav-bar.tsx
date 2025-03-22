//General imports
import Link from "next/link";

//Component imports
import LoginButton from "./login-button";

import Image from "next/image";

import { auth } from "@/auth";

export default function NavBar() {
  const session = auth();
  console.log(session);
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
          <LoginButton />
        </li>
      </ul>
    </nav>
  );
}
