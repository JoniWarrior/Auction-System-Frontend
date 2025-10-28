"use client";
import Link from "next/link";
import { FaSearch, FaGavel, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/layout/Notification";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logOut } from "@/store/auth/authSlice";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const isLoggedIn = !!accessToken && !!user;

  const handleLogOut = () => {
    dispatch(logOut());
    router.push("/");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
              <FaGavel className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-gray-800">Auction</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link
              href="/auctions"
              className="text-gray-600 hover:text-purple-600 font-medium"
            >
              Auctions
            </Link>
            <Link
              href="/sell"
              className="text-gray-600 hover:text-purple-600 font-medium"
            >
              Sell
            </Link>
          </nav>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search auctions..."
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn && <NotificationBell />}

            {!isLoggedIn ? (
              <>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                >
                  <FaUser className="text-sm" />
                  <span>Sign Up</span>
                </Link>

                <Link
                  href="/login"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                >
                  <FaUser className="text-sm" />
                  <span>Log In</span>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogOut}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <FaUser className="text-sm" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search auctions..."
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
