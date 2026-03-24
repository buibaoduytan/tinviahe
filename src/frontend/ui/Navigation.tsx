import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Về chúng tôi" },
  { href: "/login", label: "Đăng nhập" },
  { href: "/register", label: "Đăng ký" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm transition hover:border-blue-400 hover:text-blue-300"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? "Đóng" : "Danh mục"}
          </button>
          <Link to="/" className="text-lg font-bold tracking-wide text-blue-300">
            TinViaHe
          </Link>
        </div>
        <ul className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  location.pathname === item.href
                    ? "bg-blue-500/20 text-blue-300"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Sidebar open={open} />
    </header>
  );
}
