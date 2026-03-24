import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username.length < 3) {
      alert("Username phải từ 3 ký tự");
      return;
    }
    if (password.length < 6) {
      alert("Password phải từ 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }
    navigate("/login");
  };

  return (
    <section className="mx-auto max-w-md">
      <div className="animate-fade-in rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-blue-300">Đăng ký tài khoản</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="Username"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 pr-16"
              placeholder="Password"
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
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 pr-16"
              placeholder="Xác nhận password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              {showConfirmPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-linear-to-r from-blue-600 to-cyan-400 px-4 py-2 font-semibold text-white"
          >
            Tạo tài khoản
          </button>
        </form>
      </div>
    </section>
  );
}
