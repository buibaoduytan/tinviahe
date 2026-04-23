import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getNews, type NewsScope } from "../services/newsApi";
import type { NewsArticle } from "../types/news";
import VideoScroll from "../ui/VideoScroll";
import { TrendingUp, ExternalLink, Share2, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";


function scopeFromParam(v: string | null): NewsScope {
  return v === "intl" ? "intl" : "vn";
}

function ArticleCover({ 
  imageUrl, 
  title,
  className = ""
}: { 
  imageUrl?: string | null; 
  title: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  
  if (!imageUrl || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-800 via-slate-800 to-slate-900 text-center text-xs text-slate-500">
        Không có ảnh
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt={title}
      className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

const ARTICLES_PER_PAGE = 12;

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = scopeFromParam(searchParams.get("scope"));
  const query = searchParams.get("q")?.trim() ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);

  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(pageParam);

  useEffect(() => {
    let cancelled = false;
    async function loadNews() {
      setLoading(true);
      setError("");
      try {
        const data = await getNews(scope, query || undefined);
        if (cancelled) return;
        setAllArticles(data.articles);
        setCurrentPage(1);
      } catch (err: unknown) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Tải tin tức thất bại";
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadNews();
    return () => {
      cancelled = true;
    };
  }, [scope, query]);

  function setScope(next: NewsScope) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("scope", next);
      p.delete("page");
      return p;
    });
  }

  function goToPage(page: number) {
    setCurrentPage(page);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", String(page));
      return p;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);
  const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIdx = startIdx + ARTICLES_PER_PAGE;
  const displayedArticles = allArticles.slice(startIdx, endIdx);

  const featured = displayedArticles[0];
  const mainGridArticles = displayedArticles.slice(1, 7);
  const sidebarArticles = allArticles.slice(0, 3);
  const bottomArticles = displayedArticles.slice(7);

  return (
    <section className="space-y-10 pb-16" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* HEADER */}
      <div className="border-b border-slate-800 pb-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end md:gap-8">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
              TinViaHe
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white md:text-5xl" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800 }}>
              Tin tức tổng hợp
            </h1>
          </div>

          {/* SCOPE BUTTONS */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-2xl border border-slate-700/90 bg-slate-950/50 p-1 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setScope("vn")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold  ${
                scope === "vn"
                  ? "border-b-2 border-b-blue-400 text-shadow-blue-500 drop-shadow-blue-300 shadow-lg shadow-blue-600/25"
                  : "text-slate-400 hover:text-white duration-initial"
              }`}
            >
              Việt Nam
            </button>
            <button
              type="button"
              onClick={() => setScope("intl")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold  ${
                scope === "intl"
                  ? "border-b-2 border-b-blue-400 text-shadow-blue-500 drop-shadow-blue-300 shadow-lg shadow-blue-600/25"
                  : "text-slate-400 hover:text-white duration-initial"
              }`}
            >
              Quốc tế
            </button>
          </div>
          {query ? (
            <span className="rounded-full border border-slate-600 bg-slate-900/80 px-4 py-1.5 text-sm text-slate-300">
              Từ khóa: <span className="font-medium text-white">{query}</span>
            </span>
          ) : null}
        </div>
      </div>

        {query && (
          <div className="mt-4">
            <span className="inline-flex rounded-full border border-slate-600 bg-slate-900/50 px-4 py-1.5 text-sm text-slate-300">
              Từ khóa: <span className="ml-2 font-semibold text-white">{query}</span>
            </span>
          </div>
        )}

        {!loading && allArticles.length > 0 && (
          <div className="mt-4 text-xs text-slate-400">
            Trang <span className="font-semibold text-cyan-400">{currentPage}</span> / <span className="font-semibold text-cyan-400">{totalPages}</span> • 
            Tổng <span className="font-semibold text-cyan-400">{allArticles.length}</span> bài
          </div>
        )}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="aspect-video animate-pulse rounded-lg bg-slate-800" />
            <div className="space-y-3 mt-4">
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-700" />
              <div className="h-6 w-full animate-pulse rounded bg-slate-700" />
              <div className="h-6 w-5/6 animate-pulse rounded bg-slate-700" />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-video animate-pulse rounded bg-slate-800" />
            ))}
          </div>
          <div className="lg:col-span-1 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-16/10 animate-pulse rounded bg-slate-800" />
            ))}
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-red-200">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && allArticles.length === 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-6 py-12 text-center">
          <p className="text-slate-400">Không có bài nào phù hợp. Thử đổi từ khóa hoặc khu vực.</p>
        </div>
      )}

      {/* MAIN CONTENT */}
      {!loading && !error && allArticles.length > 0 && (
        <>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {/* LEFT COLUMN */}
            <div className="md:col-span-2 lg:col-span-2 space-y-8">
              {/* FEATURED ARTICLE */}
              {featured && (
                <article className="group overflow-hidden rounded-lg border border-slate-800 bg-slate-900/30 shadow-lg transition hover:border-slate-700 hover:shadow-blue-950/40">
                  <div className="relative h-96 overflow-hidden bg-slate-800">
                    <ArticleCover imageUrl={featured.imageUrl} title={featured.title} />
                  </div>
                  <div className="space-y-5 p-6 lg:p-8">
                    {featured.source && (
                      <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-400">
                        {featured.content}
                      </span>
                    )}
                    <h2 className="text-3xl font-bold leading-tight text-white" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
                      {featured.title}
                    </h2>
                    {featured.description && (
                      <p className="text-base leading-relaxed text-slate-400">
                        {featured.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-sm text-slate-500 pt-2">
                      <span className="font-medium">{featured.author}</span>
                      <span>·</span>
                      <time dateTime={featured.publishedAt}>
                        {new Date(featured.publishedAt).toLocaleDateString("vi-VN")}
                      </time>
                    </div>
                    
                    {/* FEATURED ACTION BUTTONS - IMPROVED */}
                    <div className="flex flex-wrap gap-3 pt-6">
                      {/* Primary Button - Đọc bài */}
                      <a
                        href={featured.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 px-6 py-3 text-base font-bold text-white transition hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-600/50 active:scale-95"
                      >
                        <ExternalLink className="h-5 w-5" />
                        Đọc bài
                      </a>

                      {/* Secondary Button - Chia sẻ */}
                      <button
                        onClick={() => {
                          navigator.share?.({
                            title: featured.title,
                            text: featured.description || featured.title,
                            url: featured.url,
                          }).catch(() => {
                            navigator.clipboard.writeText(featured.url);
                            alert("Đã sao chép link!");
                          });
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-blue-600 bg-transparent px-6 py-3 text-base font-bold text-blue-400 transition hover:bg-blue-600/10 hover:border-blue-500 active:scale-95"
                      >
                        <Share2 className="h-5 w-5" />
                        Chia sẻ
                      </button>

                      {/* Tertiary Button - Lưu */}
                      <button
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-3 text-base font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white active:scale-95"
                        title="Lưu bài viết"
                      >
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </article>
              )}

              {/* MAIN ARTICLES GRID */}
              {mainGridArticles.length > 0 && (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-slate-800 pt-8">
                  {mainGridArticles.map((article) => (
                    <article
                      key={article.url}
                      className="group flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900/30 shadow transition hover:border-slate-700 hover:shadow-blue-950/30 h-full"
                    >
                      <div className="relative h-40 overflow-hidden bg-slate-800">
                        <ArticleCover imageUrl={article.imageUrl} title={article.title} />
                      </div>
                      <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                        {article.source && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                            {article.content}
                          </span>
                        )}
                        <h3 className="line-clamp-3 text-sm font-bold leading-snug text-white group-hover:text-blue-300 transition" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                          {article.title}
                        </h3>
                        <div className="mt-auto space-y-3">
                          {article.description && (
                            <p className="line-clamp-2 text-xs text-slate-500">{article.description}</p>
                          )}
                          <time className="block text-[11px] text-slate-600">
                            {new Date(article.publishedAt).toLocaleDateString("vi-VN")}
                          </time>
                          
                          {/* GRID CARD BUTTON */}
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600/20 py-2 text-sm font-bold text-blue-400 transition hover:bg-blue-600/40 hover:text-blue-300 active:scale-95"
                          >
                            Xem bài
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* BOTTOM ARTICLES */}
              {bottomArticles.length > 0 && (
                <div className="space-y-5 border-t border-slate-800 pt-8">
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
                    Tin khác ({bottomArticles.length})
                  </h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {bottomArticles.map((article) => (
                      <article
                        key={article.url}
                        className="group flex gap-4 overflow-hidden rounded-lg border border-slate-800/50 bg-slate-900/20 p-4 transition hover:border-slate-700 hover:bg-slate-900/40"
                      >
                        <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                          <ArticleCover imageUrl={article.imageUrl} title={article.title} />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          {article.source && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400">
                              {article.content}
                            </span>
                          )}
                          <h4 className="line-clamp-2 text-sm font-semibold text-white group-hover:text-blue-300 transition" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                            {article.title}
                          </h4>
                          <div className="flex items-center justify-between gap-2">
                            <time className="text-xs text-slate-500">
                              {new Date(article.publishedAt).toLocaleDateString("vi-VN")}
                            </time>
                            
                            {/* SMALL ICON BUTTON */}
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg bg-blue-600/20 p-2 transition hover:bg-blue-600/40 active:scale-95"
                              title="Mở bài viết"
                            >
                              <ExternalLink className="h-4 w-4 text-blue-400 hover:text-blue-300" />
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="md:col-span-1 lg:col-span-2 space-y-8">
              {sidebarArticles.length > 0 && (
                <div className="sticky top-8 space-y-6 rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                  <div className="flex items-center gap-2 border-b border-slate-700 pb-4">
                    <TrendingUp className="h-5 w-5 text-cyan-400 shrink-0" />
                    <h3 className="text-sm font-bold uppercase tracking-wide text-white" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>Đọc nhiều</h3>
                  </div>

                  <div className="space-y-6">
                    {sidebarArticles.map((article, idx) => (
                      <article
                        key={article.url}
                        className="group space-y-3 border-b border-slate-700/50 pb-6 last:border-0 last:pb-0 cursor-pointer transition-all hover:opacity-100"
                      >
                        {/* IMAGE WITH HOVER EFFECT */}
                        <div className="relative h-28 overflow-hidden rounded-lg bg-slate-800 group-hover:ring-2 group-hover:ring-cyan-300/50 ring-offset-2 ring-offset-slate-900 transition-all duration-300">
                          <ArticleCover 
                            imageUrl={article.imageUrl} 
                            title={article.title}
                            className="group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        {/* CONTENT */}
                        <div className="space-y-2">
                          {/* NUMBER BADGE */}
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-400/20 text-xs font-bold text-cyan-300">
                            #{String(idx + 1).padStart(2, '0')}
                          </span>

                          {/* TITLE */}
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noreferrer"
                            className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-cyan-300 transition-colors duration-200"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {article.title}
                          </a>

                          {/* DESCRIPTION */}
                          {article.description && (
                            <p className="line-clamp-1 text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
                              {article.description}
                            </p>
                          )}

                          {/* METADATA */}
                          <div className="flex items-center justify-between pt-2">
                            <time className="text-[11px] text-slate-500">
                              {new Date(article.publishedAt).toLocaleDateString("vi-VN")}
                            </time>
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-md bg-cyan-400/10 p-1.5 text-cyan-400 transition-all hover:bg-cyan-400/20 hover:text-cyan-300 active:scale-95"
                              title="Mở bài viết"
                              aria-label="Mở bài viết"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-8 border-t border-slate-800 mt-8 flex-wrap">
              {/* Previous Button */}
              <button
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-700 bg-slate-900/50 px-5 py-3 text-sm font-bold text-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-600 hover:bg-blue-600/10 hover:text-blue-400 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
                Trước
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2 flex-wrap justify-center">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage + i - 2;
                  return page <= totalPages ? (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`rounded-lg px-4 py-2.5 text-sm font-bold transition active:scale-95 ${
                        page === currentPage
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                          : "border-2 border-slate-700 bg-slate-900/50 text-slate-300 hover:border-blue-600 hover:bg-blue-600/10 hover:text-blue-400"
                      }`}
                    >
                      {page}
                    </button>
                  ) : null;
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-700 bg-slate-900/50 px-5 py-3 text-sm font-bold text-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-600 hover:bg-blue-600/10 hover:text-blue-400 active:scale-95"
              >
                Sau
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}

      {!loading && !error && <VideoScroll />}
    </section>
  );
}