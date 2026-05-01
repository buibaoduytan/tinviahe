import { LayoutGrid, MessageCircle, Newspaper, Sparkles, ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import type { JSX } from "react/jsx-runtime";

const links = [
  { to: "/", label: "Tin mới nhất", icon: Newspaper },
  { to: "/about", label: "Khám phá dự án", icon: Sparkles },
  { to: "/login", label: "Thảo luận cộng đồng", icon: MessageCircle },
  { to: "/register", label: "Danh mục chủ đề", icon: LayoutGrid },
];

export default function Sidebar(): JSX.Element {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
        <span>Menu</span>
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl transition-all duration-300 ease-in-out ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="p-2">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon
                  size={15}
                  className={`shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                    isActive ? "text-blue-400" : "text-blue-300/70"
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}