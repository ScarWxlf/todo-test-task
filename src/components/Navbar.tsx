"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
      <Link href="/" className="text-lg font-bold text-black">
        To-Do App
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline">Dashboard</Button>
        </Link>

        {session?.user ? (
          <Button variant="destructive" onClick={() => signOut({callbackUrl: "/"})}>
            Logout
          </Button>
        ) : (
          <>
            <Link href="/signin">
              <Button>Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
