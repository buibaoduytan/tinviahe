import { useState } from "react";
import type { JSX } from "react/jsx-runtime";

export default function LoginPage(): JSX.Element {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "admin" && password === "password") {
      alert("Đăng nhập thành công!");
      setError("");
      return;
    }
    setError("Tên đăng nhập hoặc mật khẩu chưa đúng");
  };

  return (
    <section className="mx-auto max-w-md">
      <div className="animate-fade-in rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-blue-300">Đăng nhập</h1>
        {error ? (
          <div className="mb-4 rounded-lg border border-red-600/40 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="Tên đăng nhập"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 pr-16"
              placeholder="Mật khẩu"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-400 px-4 py-2 font-semibold text-white"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </section>
  );
}
