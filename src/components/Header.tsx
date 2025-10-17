"use client";

import Link from "next/link";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // hangi tab açık olacak

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="w-1/4 text-xl font-bold text-green-600">
          <Link href="/">QuickQR</Link>
        </div>

        {/* Center: Menu */}
        <nav className="w-2/4 flex justify-center gap-6 text-gray-700 font-medium text-base">
          <Link href="/" className="hover:text-green-600">Generate</Link>
          <Link href="/pricing" className="hover:text-green-600">Pricing</Link>
          <Link href="/about" className="hover:text-green-600">About</Link>
          <Link href="/contact" className="hover:text-green-600">Contact</Link>
        </nav>

        {/* Right: Auth */}
        <div className="w-1/4 flex justify-end items-center gap-4 text-sm">
          <button
            onClick={() => {
              setIsLogin(true);
              setIsModalOpen(true);
            }}
            className="hover:text-green-600"
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setIsModalOpen(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
          >
            Register
          </button>
        </div>
      </div>

      {/* Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
    </header>
  );
}
