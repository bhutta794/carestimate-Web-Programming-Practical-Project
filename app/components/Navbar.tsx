"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          CarEstimate
        </Link>
        
        <div className="flex gap-4">
          <Link href="/buy" className="text-gray-700 hover:text-blue-600">
            Buy Car
          </Link>
          
          {session ? (
            <>
              <Link href="/sell" className="text-gray-700 hover:text-blue-600">
                Sell Car
              </Link>
              <button
                onClick={() => signOut()}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link href="/register" className="text-gray-700 hover:text-blue-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
