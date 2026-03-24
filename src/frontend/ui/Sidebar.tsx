import { LayoutGrid, MessageCircle, Newspaper, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  open: boolean;
}

const links = [
  { to: "/", label: "Tin mới nhất", icon: Newspaper },
  { to: "/about", label: "Khám phá dự án", icon: Sparkles },
  { to: "/login", label: "Thảo luận cộng đồng", icon: MessageCircle },
  { to: "/register", label: "Danh mục chủ đề", icon: LayoutGrid },
];

export default function Sidebar({ open }: SidebarProps) {
  return (
    <div
      className={`overflow-hidden border-t border-slate-800 transition-all duration-300 ${
        open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-2 px-4 py-4 md:px-8">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <Icon size={16} className="text-blue-300 transition group-hover:scale-110" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
