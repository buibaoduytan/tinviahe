import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import type { JSX } from "react/jsx-runtime";

const publicNav = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Về chúng tôi" },
  { href: "/know", label: "Hiểu biết" },
];


export default function Navigation(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(() => searchParams.get("q") ?? "");

 

  useEffect(() => {
    const nextQuery = searchParams.get("q") ?? "";
    const timer = window.setTimeout(() => {
      setSearchInput((prev) => (prev === nextQuery ? prev : nextQuery));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [searchParams]);

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = searchInput.trim();
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    const scope = searchParams.get("scope");
    if (scope === "vn" || scope === "intl") next.set("scope", scope);

    const search = next.toString();
    if (location.pathname === "/") {
      navigate({ pathname: "/", search: search ? `?${search}` : "" }, { replace: false });
    } else {
      navigate({ pathname: "/", search: search ? `?${search}` : "" });
    }
    
    setIsMenuOpen(false);
  }

  function clearSearch() {
    setSearchInput("");
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    if (location.pathname === "/") {
      navigate({ pathname: "/", search: next.toString() ? `?${next.toString()}` : "" });
    }
  }
  return (
    <div className="sticky top-0 z-40 border-b border-slate-800/50 bg-linear-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-md">
      <nav className="mx-auto flex min-h-16 w-full max-w-6xl flex-col gap-0 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-6 md:px-8">
        
        {/* Logo + Mobile Menu Button */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-lg font-bold tracking-wide text-blue-300 transition hover:text-blue-200"
          >
            TinViaHe
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="flex w-full min-w-0 flex-1 items-center md:order-3 md:max-w-md"
          role="search"
          aria-label="Tìm kiếm tin tức"
        >
          <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-800/40 pl-3 pr-1 shadow-inner transition focus-within:border-blue-500/60 focus-within:ring-2 focus-within:ring-blue-500/30 hover:border-slate-600/80">
            <Search className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />
            
            <input
              name="q"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm theo từ khóa..."
              className="min-w-0 flex-1 bg-transparent py-2.5 pr-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              autoComplete="off"
            />
            
            {/* Clear Button */}
            {searchInput ? (
              <button
                type="button"
                onClick={clearSearch}
                className="mx-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-700 hover:text-white"
                aria-label="Clear search"
              >
                Xóa
              </button>
            ) : null}
            
            {/* Submit Button */}
            <button
              type="submit"
              className="m-1 inline-flex items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-1 md:flex md:shrink-0">
          {publicNav.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  location.pathname === item.href
                    ? "bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/20"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          
          <li className="mx-1 h-6 w-px bg-slate-700/50" /> {/* Divider */}
      
        </ul>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-700/50 pt-4 md:hidden">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  location.pathname === item.href
                    ? "bg-blue-500/20 text-blue-300"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="border-t border-slate-700/50 py-2" />
          </div>
        )}
      </nav>
    </div>
  );
}