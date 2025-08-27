import { useState } from "react";
import { motion } from "framer-motion";

type AdminLoginProps = {
  onLogin: (token: string) => void;
};

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      onLogin(data.token);
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] font-inter">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glassmorphism p-8 rounded-2xl shadow-xl flex flex-col gap-5 w-full max-w-sm"
        style={{
          background: "rgba(15,23,42,0.8)",
          border: "1.5px solid rgba(0,255,255,0.15)",
          backdropFilter: "blur(10px)"
        }}
      >
        <h2 className="text-2xl font-fira text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 bg-clip-text text-transparent mb-2">
          Admin Login
        </h2>
        <input
        className="w-full bg-[#10182a] border-0 border-b-2 border-cyan-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-cyan-200"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          autoFocus
        />
        <input
       className="w-full bg-[#10182a] border-0 border-b-2 border-cyan-400 text-white font-fira px-2 py-2 outline-none transition placeholder:text-cyan-200"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <button
          type="submit"
          className="mt-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-lime-400 text-[#0F172A] font-bold text-lg shadow transition hover:scale-105"
        >
          Login
        </button>
        {error && <div className="text-red-400 text-center font-bold">{error}</div>}
      </motion.form>
    </div>
  );
}