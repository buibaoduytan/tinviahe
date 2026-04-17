import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { clearAuth, getStoredAuth, subscribeAuth } from "../services/authApi";

const publicNav = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Về chúng tôi" },
];

const authNav = [
  { href: "/login", label: "Đăng nhập" },
  { href: "/register", label: "Đăng ký" },
];


export default function Navigation() {
  const [] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState<string | null>(() => getStoredAuth()?.username ?? null);
  const [searchInput, setSearchInput] = useState(() => searchParams.get("q") ?? "");

  
  useEffect(() => {
    const sync = () => setUsername(getStoredAuth()?.username ?? null);
    sync();
    return subscribeAuth(sync);
  }, []);

  useEffect(() => {
    setSearchInput(searchParams.get("q") ?? "");
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
    <div className="flex top-0 z-30 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
            <nav className="mx-auto flex min-h-16 w-full max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-4 md:px-8">
      
          
          <Link to="/" className="text-lg font-bold tracking-wide text-blue-300">
            TinViaHe
          </Link>
      

        <form
          onSubmit={handleSearch}
          className="flex w-full min-w-0 flex-1 items-center md:max-w-xl"
          role="search"
          aria-label="Tìm kiếm tin tức"
        >
          <div className="flex w-full items-center gap-1 rounded-2xl border border-(--panel-border) bg-(--panel-bg) pl-3 shadow-inner transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-slate-500"
              aria-hidden
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            <input
              name="q"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm theo từ khóa (VD: covid, bóng đá, công nghệ...)"
              className="min-w-0 flex-1 bg-transparent py-2.5 pr-2 text-sm text-(--app-text) placeholder:text-slate-500 focus:outline-none"
              autoComplete="off"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={clearSearch}
                className="mr-1 rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                Xóa
              </button>
            ) : null}
            <button
              type="submit"
              className="m-1 rounded-lg bg-blue-500 px-2 py-1 text-sm font-medium text-white transition shadow-sm hover:shadow-cyan-500 "
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
            </button>
          </div>
        </form>

        <ul className="hidden items-center gap-2 md:flex md:shrink-0">
          {publicNav.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  location.pathname === item.href
                    ? "shadow-lg shadow-blue-500 border-2 border-slate-200 text-blue-300"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          {username ? (
            <>
              <li className="px-2 text-sm text-slate-400">Xin chào, {username}</li>
              <li>
                <button
                  type="button"
                  onClick={() => clearAuth()}
                  className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Đăng xuất
                </button>
              </li>
            </>
          ) : (
            authNav.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    location.pathname === item.href
                      ? "shadow-lg shadow-blue-500 text-blue-300"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))
          )}
        </ul>
      </nav>

</div>
  );
}
