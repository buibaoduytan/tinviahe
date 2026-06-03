import { useEffect, useState, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import { getNews, type NewsScope } from "../services/newsApi";
import type { NewsArticle } from "../types/news";
import { TrendingUp, ExternalLink, Share2, ChevronLeft, ChevronRight, Bookmark} from "lucide-react";
import VideoCard from "./ShortVideo.tsx";

// ─── Constants ────────────────────────────────────────────────────────────────

const ARTICLES_PER_PAGE = 12; // 1 bài nổi bật + 8 bài lưới 4 cột + 3 bài lưới 3 cột = 12 bài mỗi trang

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scopeFromParam(v: string | null): NewsScope {
  return v === "intl" ? "intl" : "vn";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  } catch {
    return dateStr;
  }
}

async function shareArticle(article: NewsArticle): Promise<void> {
  const data = { title: article.title, text: article.description || article.title, url: article.link };
  try {
    await navigator.share?.(data);
  } catch {
    await navigator.clipboard.writeText(article.link);
    alert("Đã sao chép link!");
  }
}

// ─── ArticleCover ─────────────────────────────────────────────────────────────

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
      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-800 via-slate-800 to-slate-900 text-center text-xs text-slate-600">
        Không có ảnh
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className={`h-full w-full object-cover transition duration-300 ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-8">
      <div className="aspect-16/7 animate-pulse rounded-xl bg-slate-800" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-video animate-pulse rounded-lg bg-slate-800" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-700" />
            <div className="h-3 w-full animate-pulse rounded bg-slate-700" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="h-20 w-20 shrink-0 animate-pulse rounded-lg bg-slate-800" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 w-1/4 animate-pulse rounded bg-slate-700" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-700" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FeaturedArticle ──────────────────────────────────────────────────────────
// Bài nổi bật lớn — [0]

function FeaturedArticle({ article }: { article: NewsArticle }) {
  return (
      <article className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 shadow-xl transition hover:border-slate-700">
        <div className="grid md:grid-cols-2 lg:grid-cols-5">
          {/* Ảnh — chiếm 3/5 trên desktop */}
          <div className="relative h-64 overflow-hidden bg-slate-800 md:h-full lg:col-span-3">
            <ArticleCover
            imageUrl={article.image_url}
            title={article.title}
            className="group-hover:scale-[1.02]"
          />
          {article.source_name && (
            <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
              {article.source_name}
            </span>
          )}
        </div>

        {/* Nội dung — 2/5 còn lại */}
        <div className="flex flex-col justify-between p-6 lg:col-span-2 lg:p-8">
          <div>
            <h2 className="mb-3 text-2xl font-extrabold leading-tight text-white lg:text-3xl">
              {article.title}
            </h2>
            {article.description && (
              <p className="line-clamp-4 text-sm leading-relaxed text-slate-400">
                {article.description}
              </p>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {article.creator && (
                <>
                  <span className="font-medium text-slate-400">{article.creator}</span>
                  <span>·</span>
                </>
              )}
              <time dateTime={article.pubDate}>{formatDate(article.pubDate)}</time>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-95"
              >
                <ExternalLink className="h-4 w-4" />
                Đọc bài
              </a>
              <button
                onClick={() => shareArticle(article)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:border-blue-500 hover:text-blue-400 active:scale-95"
              >
                <Share2 className="h-4 w-4" />
                Chia sẻ
              </button>
              <button
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 px-3 py-2.5 text-slate-400 transition hover:border-slate-500 hover:text-white active:scale-95"
                title="Lưu bài viết"
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
              
    </article>
   
  );
}

// ─── GridCard ─────────────────────────────────────────────────────────────────
// Dùng cho "Tin mới nhất" lưới 4 cột — [1..4]

function GridCard({ article }: { article: NewsArticle }) {
  return (
     <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
    <article className="group flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900/30 transition hover:border-slate-700 hover:shadow-md hover:shadow-blue-950/30">
      <div className="relative h-40 overflow-hidden bg-slate-800">
        <ArticleCover
          imageUrl={article.image_url}
          title={article.title}
          className="group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4 space-y-2">
        {article.source_name && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
            {article.source_name}
          </span>
        )}
        <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-white group-hover:text-blue-300 transition-colors">
          {article.title}
        </h3>
        <div className="mt-auto flex items-center justify-between border-t border-slate-700/50 pt-2">
          <time className="text-[11px] text-slate-600">{formatDate(article.pubDate)}</time>
          <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
    </a>
  );
}

// ─── TrendingCard ─────────────────────────────────────────────────────────────
// "Đọc nhiều" — 3 bài đầu toàn bộ danh sách

function TrendingCard({ article, rank }: { article: NewsArticle; rank: number }) {
  return (
    <article className="group flex gap-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-900/30 p-4 transition hover:border-slate-700 hover:bg-slate-900/50">
      {/* Rank */}
      <div className="flex shrink-0 flex-col items-center gap-1">
        <span className="text-2xl font-black leading-none text-slate-700">
          {String(rank).padStart(2, "0")}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-800">
        <ArticleCover
          imageUrl={article.image_url}
          title={article.title}
          className="group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        {article.source_name && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">
            {article.source_name}
          </span>
        )}
        <a
          href={article.link}
          target="_blank"
          rel="noreferrer"
          className="line-clamp-2 text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors"
        >
          {article.title}
        </a>
        <time className="text-[11px] text-slate-600">{formatDate(article.pubDate)}</time>
      </div>
    </article>
  );
}

// ─── RowCard ──────────────────────────────────────────────────────────────────
// Bài dạng hàng ngang nhỏ — dùng cho phần còn lại [5..]

function RowCard({ article }: { article: NewsArticle }) {
  return (
    <article className="group flex gap-3 overflow-hidden rounded-lg border border-slate-800 bg-slate-900/20 p-3 transition hover:border-slate-700">
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md bg-slate-800">
        <ArticleCover
          imageUrl={article.image_url}
          title={article.title}
          className="group-hover:scale-105"
        />
      </div>
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
        <div className="flex items-center justify-between">
          <time className="text-[11px] text-slate-600">{formatDate(article.pubDate)}</time>
          <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="rounded bg-blue-600/20 p-1 text-blue-400 transition hover:bg-blue-600/40"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  onGoTo,
}: {
  currentPage: number;
  totalPages: number;
  onGoTo: (p: number) => void;
}) {
  const pages = Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
    let start: number;
    if (currentPage <= 4) start = 1;
    else if (currentPage >= totalPages - 3) start = Math.max(1, totalPages - 6);
    else start = currentPage - 3;
    return start + i;
  }).filter((p) => p <= totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-800 pt-10">
      <button
        onClick={() => onGoTo(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-bold text-slate-300 transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-blue-500 hover:text-blue-400 active:scale-95"
      >
        <ChevronLeft className="h-4 w-4" />
        Trước
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onGoTo(p)}
          className={`rounded-lg px-3.5 py-2 text-sm font-bold transition active:scale-95 ${
            p === currentPage
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
              : "border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-blue-500 hover:text-blue-400"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onGoTo(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-bold text-slate-300 transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-blue-500 hover:text-blue-400 active:scale-95"
      >
        Sau
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export default function HomePage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = scopeFromParam(searchParams.get("scope"));
  const query = searchParams.get("q")?.trim() ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);

  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(pageParam);

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getNews(scope, query || undefined);
        if (cancelled) return;
        setAllArticles(data.articles);
        setCurrentPage(1);
      } catch (err: unknown) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Tải tin tức thất bại");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [scope, query]);

  // ── Helpers ───────────────────────────────────────────────────────────────
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

  // ── Layout slices ─────────────────────────────────────────────────────────
  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);
  const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
  const page = allArticles.slice(startIdx, startIdx + ARTICLES_PER_PAGE);

  // [0]       → featured
  // [1..4]    → lưới "Tin mới nhất" (4 cột)
  // top 3     → "Đọc nhiều" (luôn lấy từ đầu toàn bộ danh sách)
  // [5..16]   → lưới 3 cột bài tiếp theo
  // [17..]    → danh sách hàng ngang 2 cột
  const featured        = page[0] ?? null;
  const gridArticles    = page.slice(1, 13);        // 8 bài
  const trendingArticles = allArticles.slice(0, 7); // luôn top 30
  const midGridArticles = page.slice(13, 25);       // 12 bài lưới 3 cột
  const rowArticles     = page.slice(25);           // còn lại dạng hàng

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="space-y-12 pb-24" style={{ fontFamily: "Montserrat, sans-serif" }}>

      {/* ── HEADER ── */}
      <div className="border-b border-slate-800 pb-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
              TinViaHe
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white md:text-5xl">
              Tin tức tổng hợp
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Scope tabs */}
            <div className="inline-flex rounded-2xl border border-slate-700/80 bg-slate-950/50 p-1 backdrop-blur-sm">
              {(["vn", "intl"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScope(s)}
                  className={`rounded-xl px-6 py-2 text-sm font-semibold transition-all ${
                    scope === s
                      ? "border-b-2 border-b-blue-400 text-blue-400 shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {s === "vn" ? "Việt Nam" : "Quốc tế"}
                </button>
              ))}
            </div>

            {query && (
              <span className="rounded-full border border-slate-600 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 whitespace-nowrap">
                Từ khóa: <span className="font-semibold text-white">{query}</span>
              </span>
            )}
          </div>
        </div>

        {!loading && allArticles.length > 0 && (
          <p className="mt-5 text-sm text-slate-500">
            Trang{" "}
            <span className="font-semibold text-cyan-400">{currentPage}</span>
            {" / "}
            <span className="font-semibold text-cyan-400">{totalPages}</span>
            <span className="mx-2 text-slate-700">•</span>
            Tổng{" "}
            <span className="font-semibold text-cyan-400">{allArticles.length}</span> bài
          </p>
        )}
      </div>

      {/* ── STATES ── */}
      {loading && <Skeleton />}

      {!loading && error && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 px-6 py-4 text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && allArticles.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-8 py-20 text-center">
          <p className="text-slate-400">Không có bài nào phù hợp. Thử đổi từ khóa hoặc khu vực.</p>
        </div>
      )}

      {/* ── CONTENT ── */}
      {!loading && !error && allArticles.length > 0 && (
        <>
          {/* 1. Bài nổi bật */}
          {featured && <FeaturedArticle article={featured} />}

          {/* 2. Tin mới nhất — lưới 4 cột */}
          {gridArticles.length > 0 && (
            <section className="border-t border-slate-800 pt-8">
              <h2 className="mb-5 text-base font-bold uppercase tracking-widest text-slate-400">
                Tin mới nhất
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {gridArticles.map((a) => (
                  <GridCard key={a.article_id} article={a} />
                ))}
              </div>
            </section>
          )}

          {/* 3. Đọc nhiều — top 3 */}
          {trendingArticles.length > 0 && (
            <section className="border-t border-slate-800 pt-8">
              <div className="mb-5 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                <h2 className="text-base font-bold uppercase tracking-widest text-slate-400">
                  Đọc nhiều
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trendingArticles.map((a, i) => (
                  <TrendingCard key={a.article_id} article={a} rank={i + 1} />
                ))}
              </div>
            </section>
          )}

          {/* 4. Tiếp theo — lưới 3 cột, tối đa 12 bài */}
          {midGridArticles.length > 0 && (
            <section className="border-t border-slate-800 pt-8">
              <h2 className="mb-5 text-base font-bold uppercase tracking-widest text-slate-400">
                Xem thêm
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {midGridArticles.map((a) => (
                  <GridCard key={a.article_id} article={a} />
                ))}
              </div>
            </section>
          )}

          {/* 5. Các bài còn lại — hàng ngang 2 cột */}
          {rowArticles.length > 0 && (
            <section className="border-t border-slate-800 pt-8">
              <h2 className="mb-5 text-base font-bold uppercase tracking-widest text-slate-400">
                Các bài khác
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {rowArticles.map((a) => (
                  <RowCard key={a.article_id} article={a} />
                ))}
              </div>
            </section>
          )}

          {/* 6. Phân trang */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onGoTo={goToPage}
            />
          )}

          {/* 7. Video */}
          <div className="border-t border-slate-800 pt-12">
            <VideoCard />
          </div>
        </>
      )}
    </section>
  );
}