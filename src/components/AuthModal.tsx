"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";

export default function AuthModal({
  isOpen,
  onClose,
  isLogin,       
  setIsLogin,    
}: {
  isOpen: boolean;
  onClose: () => void;
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}) {
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("At least one number");
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validatePassword(password);
    setPasswordErrors(errors);
    if (errors.length > 0) return;
    console.log(isLogin ? "Login attempt" : "Register attempt", { email, password });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className=" relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-center text-xl font-bold mb-4">
            Welcome to QuickQR
          </Dialog.Title>

          
          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 rounded-l-md w-1/2 transition ${
                isLogin ? "bg-gray-200 font-semibold" : "bg-gray-100 text-gray-500"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded-r-md w-1/2 transition ${
                !isLogin ? "bg-gray-200 font-semibold" : "bg-gray-100 text-gray-500"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordErrors(validatePassword(e.target.value));
                  }}
                  placeholder="••••••••"
                  className="w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                </button>
              </div>

              {passwordErrors.length > 0 && (
                <ul className="text-sm text-red-500 mt-2 space-y-1">
                  {passwordErrors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
