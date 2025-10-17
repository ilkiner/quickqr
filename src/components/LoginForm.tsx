"use client";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend'e gönderilecek (sonra yazacağız)
    console.log("Login:", { email, password });
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          placeholder="●●●●●●"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Login
      </button>
    </form>
  );
}
