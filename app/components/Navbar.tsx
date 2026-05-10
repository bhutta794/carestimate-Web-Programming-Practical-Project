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

        <div className="flex items-center gap-4">
          <Link href="/buy" className="text-gray-700 hover:text-blue-600">
            Buy Car
          </Link>

          {session ? (
            <>
             
              <Link href="/sell" className="text-gray-700 hover:text-blue-600">
                Sell Car
              </Link>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
  <span className="text-sm font-medium text-blue-700">
    👤 {session.user?.name}
  </span>
</div>
              <button
                onClick={() => signOut()}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}