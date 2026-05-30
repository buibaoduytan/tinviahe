import { useEffect, useState, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import { getNews, type NewsScope } from "../services/newsApi";
import type { NewsArticle } from "../types/news";
import VideoScroll from "../ui/VideoScroll";
import { TrendingUp, ExternalLink, Share2, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function scopeFromParam(v: string | null): NewsScope {
  return v === "intl" ? "intl" : "vn";
}


/** Format ngày từ chuỗi pubDate */
function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  } catch {
    return dateStr;
  }
}

/** Chia sẻ bài viết, fallback về clipboard */
async function shareArticle(article: NewsArticle): Promise<void> {
  const shareData = {
    title: article.title,
    text: article.description || article.title,
    url: article.link,
  };
  try {
    await navigator.share?.(shareData);
  } catch {
    await navigator.clipboard.writeText(article.link);
    alert("Đã sao chép link!");
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ArticleCover({
  imageUrl,
  title,
  className = "",
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

// ─── Constants ────────────────────────────────────────────────────────────────

const ARTICLES_PER_PAGE = 12;

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = scopeFromParam(searchParams.get("scope"));
  const query = searchParams.get("q")?.trim() ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);

  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(pageParam);

  // ── Data fetching ──────────────────────────────────────────────────────────
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

  // ── Navigation helpers ─────────────────────────────────────────────────────
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
  const displayedArticles = allArticles.slice(startIdx, startIdx + ARTICLES_PER_PAGE);


  const featured = displayedArticles[0] ?? null;
  const mainGridArticles = displayedArticles.slice(1, 5);
  const sidebarArticles = allArticles.slice(0, 3);
  const bottomArticles = displayedArticles.slice(5);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section className="space-y-12 pb-20" style={{ fontFamily: "Montserrat, sans-serif" }}>

      {/* ── HEADER ── */}
      <div className="border-b border-slate-800 pb-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-12">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
              TinViaHe
            </p>
            <h1
              className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl"
              style={{ fontWeight: 800 }}
            >
              Tin tức tổng hợp
            </h1>
          </div>

          {/* Scope switcher + query badge */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="inline-flex rounded-2xl border border-slate-700/90 bg-slate-950/50 p-1 backdrop-blur-sm">
              {(["vn", "intl"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScope(s)}
                  className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                    scope === s
                      ? "border-b-2 border-b-blue-400 text-blue-400 shadow-lg shadow-blue-600/30"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {s === "vn" ? "Việt Nam" : "Quốc tế"}
                </button>
              ))}
            </div>

            {query && (
              <span className="rounded-full border border-slate-600 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 whitespace-nowrap">
                Từ khóa: <span className="font-medium text-white">{query}</span>
              </span>
            )}
          </div>
        </div>

        {/* Pagination info */}
        {!loading && allArticles.length > 0 && (
          <div className="mt-6 text-sm text-slate-400">
            <span>
              Trang <span className="font-semibold text-cyan-400">{currentPage}</span>
              {" / "}
              <span className="font-semibold text-cyan-400">{totalPages}</span>
            </span>
            <span className="mx-2 text-slate-600">•</span>
            <span>
              Tổng <span className="font-semibold text-cyan-400">{allArticles.length}</span> bài
            </span>
          </div>
        )}
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div className="space-y-8">
          <div className="aspect-video animate-pulse rounded-lg bg-slate-800" />
          <div className="space-y-3">
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-700" />
            <div className="h-6 w-full animate-pulse rounded bg-slate-700" />
            <div className="h-6 w-5/6 animate-pulse rounded bg-slate-700" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video animate-pulse rounded bg-slate-800" />
                <div className="h-4 animate-pulse rounded bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ERROR ── */}
      {!loading && error && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-6 py-4 text-red-200">
          {error}
        </div>
      )}

      {/* ── EMPTY ── */}
      {!loading && !error && allArticles.length === 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-8 py-16 text-center">
          <p className="text-slate-400 text-lg">
            Không có bài nào phù hợp. Thử đổi từ khóa hoặc khu vực.
          </p>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      {!loading && !error && allArticles.length > 0 && (
        <>
          {/* ── FEATURED ── */}
          {featured && (
            <article className="group overflow-hidden rounded-lg border border-slate-800 bg-slate-900/30 shadow-lg transition hover:border-slate-700 hover:shadow-blue-950/40">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                {/* Ảnh bên trái */}
                <div className="relative h-80 overflow-hidden bg-slate-800 md:h-full lg:col-span-2">
                  <ArticleCover imageUrl={featured.image_url} title={featured.title} />
                </div>

                {/* Nội dung bên phải */}
                <div className="flex flex-col justify-between p-6 lg:p-8">
                  {featured.source_name && (
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">
                      {featured.source_name}
                    </span>
                  )}

                  <h2
                    className="text-2xl font-bold leading-tight text-white mb-4"
                    style={{ fontWeight: 700 }}
                  >
                    {featured.title}
                  </h2>

                  {featured.description && (
                    <p className="text-sm leading-relaxed text-slate-400 mb-6 line-clamp-4">
                      {featured.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-8">
                    {featured.creator && (
                      <>
                        <span className="font-medium">{featured.creator}</span>
                        <span className="text-slate-600">·</span>
                      </>
                    )}
                    <time dateTime={featured.pubDate}>
                      {formatDate(featured.pubDate)}
                    </time>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-3">
                    <a
                      href={featured.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-600/50 active:scale-95"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Đọc bài
                    </a>

                    <button
                      onClick={() => shareArticle(featured)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-transparent px-6 py-3 text-sm font-bold text-blue-400 transition hover:bg-blue-600/10 hover:border-blue-500 active:scale-95"
                    >
                      <Share2 className="h-4 w-4" />
                      Chia sẻ
                    </button>

                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-6 py-3 text-sm font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white active:scale-95"
                      title="Lưu bài viết"
                    >
                      <Bookmark className="h-4 w-4" />
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* ── MAIN GRID – Tin mới nhất ── */}
          {mainGridArticles.length > 0 && (
            <div className="border-t border-slate-800 pt-8">
              <h3 className="text-lg font-bold text-white mb-6">Tin mới nhất</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {mainGridArticles.map((article) => (
                  <article
                    key={article.article_id}
                    className="group flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900/30 shadow transition hover:border-slate-700 hover:shadow-blue-950/30 h-full"
                  >
                    <div className="relative h-40 overflow-hidden bg-slate-800">
                      <ArticleCover imageUrl={article.image_url} title={article.title} />
                    </div>

                    <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                      {article.source_name && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                          {article.source_name}
                        </span>
                      )}

                      <h3
                        className="line-clamp-3 text-sm font-bold leading-snug text-white group-hover:text-blue-300 transition"
                        style={{ fontWeight: 600 }}
                      >
                        {article.title}
                      </h3>

                      <div className="mt-auto space-y-3">
                        {article.description && (
                          <p className="line-clamp-2 text-xs text-slate-500">{article.description}</p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                          <time className="text-[11px] text-slate-600">
                            {formatDate(article.pubDate)}
                          </time>
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ── SIDEBAR – Đọc nhiều ── */}
          {sidebarArticles.length > 0 && (
            <div className="border-t border-slate-800 pt-8">
              <div className="flex items-center gap-2 mb-8">
                <TrendingUp className="h-5 w-5 text-cyan-400 shrink-0" />
                <h3
                  className="text-lg font-bold uppercase tracking-wide text-white"
                  style={{ fontWeight: 700 }}
                >
                  Đọc nhiều
                </h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sidebarArticles.map((article, idx) => (
                  <article
                    key={article.article_id}
                    className="group flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900/30 transition hover:border-slate-700 hover:bg-slate-900/50"
                  >
                    {/* Ảnh + badge số */}
                    <div className="relative h-40 overflow-hidden bg-slate-800 group-hover:ring-2 group-hover:ring-cyan-300/50 transition-all">
                      <ArticleCover
                        imageUrl={article.image_url}
                        title={article.title}
                        className="group-hover:scale-110 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-400/20 text-sm font-bold text-cyan-300">
                        #{String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Nội dung */}
                    <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                      <div>
                        {article.source_name && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-2">
                            {article.source_name}
                          </span>
                        )}
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noreferrer"
                          className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-cyan-300 transition-colors"
                        >
                          {article.title}
                        </a>
                      </div>

                      <div className="border-t border-slate-700/50 pt-3">
                        <time className="text-[11px] text-slate-600">
                          {formatDate(article.pubDate)}
                        </time>
                      </div>

                      <a
                        href={article.link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full rounded-lg bg-blue-600/20 py-2 text-center text-xs font-bold text-blue-400 transition hover:bg-blue-600/40 hover:text-blue-300 active:scale-95"
                      >
                        Xem bài
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ── BOTTOM – Các bài khác ── */}
          {bottomArticles.length > 0 && (
            <div className="border-t border-slate-800 pt-8">
              <h3 className="text-lg font-bold text-white mb-6">Các bài khác</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {bottomArticles.map((article) => (
                  <article
                    key={article.article_id}
                    className="group flex gap-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-900/30 transition hover:border-slate-700 p-4"
                  >
                    {/* Thumbnail nhỏ */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                      <ArticleCover imageUrl={article.image_url} title={article.title} />
                    </div>

                    {/* Nội dung */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      {article.source_name && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 line-clamp-1">
                          {article.source_name}
                        </span>
                      )}

                      <a
                        href={article.link}
                        target="_blank"
                        rel="noreferrer"
                        className="line-clamp-2 text-sm font-semibold text-white group-hover:text-blue-300 transition-colors"
                      >
                        {article.title}
                      </a>

                      <div className="flex items-center justify-between gap-2 text-xs">
                        <time className="text-slate-600">
                          {formatDate(article.pubDate)}
                        </time>
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md bg-blue-600/20 p-1.5 text-blue-400 transition hover:bg-blue-600/40 active:scale-95"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-12 border-t border-slate-800 flex-wrap">
              <button
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-5 py-2.5 text-sm font-bold text-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-600 hover:bg-blue-600/10 hover:text-blue-400 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </button>

              <div className="flex gap-2 flex-wrap justify-center">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let startPage: number;
                  if (currentPage <= 4) {
                    startPage = 1;
                  } else if (currentPage >= totalPages - 3) {
                    startPage = Math.max(1, totalPages - 6);
                  } else {
                    startPage = currentPage - 3;
                  }
                  const page = startPage + i;
                  if (page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`rounded-lg px-4 py-2 text-sm font-bold transition active:scale-95 ${
                        page === currentPage
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                          : "border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-blue-600 hover:bg-blue-600/10 hover:text-blue-400"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-5 py-2.5 text-sm font-bold text-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-600 hover:bg-blue-600/10 hover:text-blue-400 active:scale-95"
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── VIDEO SECTION ── */}
          <div className="border-t border-slate-800 pt-12">
            <VideoScroll />
          </div>
        </>
      )}
    </section>
  );
}