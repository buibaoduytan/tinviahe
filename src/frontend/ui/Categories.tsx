import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Sidebar from "./Sidebar";

const categories = [
  {
    label: "Thể thao",
    items: [
      { href: "/the-thao/bong-da", label: "Bóng đá" },
      { href: "/the-thao/bong-ro", label: "Bóng rổ" },
      { href: "/the-thao/tennis", label: "Tennis" },
    ],
  },
  {
    label: "Công nghệ",
    items: [
      { href: "/cong-nghe/ai", label: "Trí tuệ nhân tạo" },
      { href: "/cong-nghe/smartphone", label: "Smartphone" },
      { href: "/cong-nghe/game", label: "Game" },
    ],
  },
  {
    label: "Kinh tế",
    items: [
      { href: "/kinh-te/chung-khoan", label: "Chứng khoán" },
      { href: "/kinh-te/bat-dong-san", label: "Bất động sản" },
    ],
  },
  {
    label: "Giải trí",
    items: [
      { href: "/giai-tri/phim", label: "Phim" },
      { href: "/giai-tri/am-nhac", label: "Âm nhạc" },
    ],
  },
];

function CategoryDropdown({
  category,
  open,
  onToggle,
}: {
  category: (typeof categories)[0];
  open: boolean;
  onToggle: () => void;
}) {
  const location = useLocation();

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-3 py-2 text-sm transition-all duration-150 border-b-2 ${
          open
            ? "border-b-blue-400 text-blue-400"
            : "border-b-transparent text-slate-300 hover:border-b-blue-400 hover:text-blue-400"
        }`}
      >
        {category.label}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute left-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl transition-all duration-200 ease-in-out ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="p-1.5">
          {category.items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`block rounded-lg px-3 py-2 text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Categories() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Đóng khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Đóng khi chuyển trang
  useEffect(() => {
    setOpenIndex(null);
  }, [location.pathname]);

  return (
    <>
      <div
        ref={ref}
        className="sticky top-0 z-50 flex items-center gap-1 px-4 py-1 backdrop-blur-sm shadow-md shadow-blue-900/20 border-b border-slate-800"
      >
        <Sidebar />

        <div className="h-4 w-px bg-slate-700 mx-1" />

        {categories.map((cat, i) => (
          <CategoryDropdown
            key={cat.label}
            category={cat}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </>
  );
}