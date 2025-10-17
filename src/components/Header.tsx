"use client";

import Link from "next/link";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { Menu } from "lucide-react"; 
export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); 

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="text-xl font-bold text-green-600">
          <Link href="/">QuickQR</Link>
        </div>

        {/* Center: Desktop Menu */}
        <nav className="hidden md:flex justify-center gap-6 text-gray-700 font-medium text-base">
          <Link href="/" className="hover:text-green-600 transition">Generate</Link>
          <Link href="/pricing" className="hover:text-green-600 transition">Pricing</Link>
          <Link href="/about" className="hover:text-green-600 transition">About</Link>
          <Link href="/contact" className="hover:text-green-600 transition">Contact</Link>
        </nav>

        {/* Right: Auth (Desktop) */}
        <div className="hidden md:flex justify-end items-center gap-4 text-sm">
          <button
            onClick={() => {
              setIsLogin(true);
              setIsModalOpen(true);
            }}
            className="hover:text-green-600 transition"
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

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={26} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md flex flex-col items-center py-4 gap-3 text-gray-700 font-medium">
          <Link href="/" className="hover:text-green-600" onClick={() => setMenuOpen(false)}>Generate</Link>
          <Link href="/pricing" className="hover:text-green-600" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/about" className="hover:text-green-600" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" className="hover:text-green-600" onClick={() => setMenuOpen(false)}>Contact</Link>

          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={() => {
                setIsLogin(true);
                setIsModalOpen(true);
                setMenuOpen(false);
              }}
              className="hover:text-green-600"
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setIsModalOpen(true);
                setMenuOpen(false);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
            >
              Register
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
    </header>
  );
}
