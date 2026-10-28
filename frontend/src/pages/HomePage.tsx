import { useEffect, useState, useMemo, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import { getNews, type NewsScope } from "../services/newsApi";
import type { NewsArticle } from "../types/news";
import {
  TrendingUp,
  ExternalLink,
  Share2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Clock,
  Flame,
  Newspaper,
  Check,
  Zap,
  ArrowUp,
  Tag,
  Layers,
  Sparkles,
  ChevronRight as ChevronRightIcon,
  Globe,
  Radio,
  Grid,
  Eye,
  Search,
  RotateCcw,
} from "lucide-react";
import VideoCard from "./ShortVideo.tsx";
import { ARTICLES_PER_PAGE , INITIAL_VISIBLE_BATCH , BATCH_SIZE, HOT_TOPICS, CATEGORY_TAGS } from "../data_tsx/constanst_homepage.tsx"
import PremierLeagueStandings from "../ui/Leaderboard.tsx";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scopeFromParam(v: string | null): NewsScope {
  return v === "intl" ? "intl" : "vn";
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));

    if (diffMin < 60 && diffMin >= 0) return `${diffMin} phút trước`;
    if (diffMin < 1440 && diffMin >= 0) return `${Math.floor(diffMin / 60)} giờ trước`;

    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string | string[] }) {
  const text = Array.isArray(category) ? category[0] : category;
  if (!text) return null;
  return (
    <span className="inline-block rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-wider">
      {text}
    </span>
  );
}

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
      <div className="flex h-full w-full items-center justify-center bg-slate-800/80 text-center text-xs font-medium text-slate-500 p-2">
        <Newspaper className="h-6 w-6 opacity-40" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className={`h-full w-full object-cover transition-transform duration-500 ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-blue-600/40 animate-bounce">
      <Check className="h-4 w-4" />
      {message}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      <div className="h-10 w-full rounded-xl bg-slate-800/60" />
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 h-112.5 rounded-2xl bg-slate-800/60" />
        <div className="lg:col-span-4 space-y-4">
          <div className="h-28 rounded-xl bg-slate-800/50" />
          <div className="h-28 rounded-xl bg-slate-800/50" />
          <div className="h-28 rounded-xl bg-slate-800/50" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-slate-800" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-slate-800/40" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Top Hot Topics Ticker Bar ────────────────────────────────────────────────
function HotTopicsBar({ onSelectTopic }: { onSelectTopic: (topic: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-2.5 text-xs">
      <div className="flex items-center gap-1.5 font-bold uppercase text-red-500 shrink-0 mr-2">
        <Flame className="h-4 w-4 fill-red-500 animate-pulse" />
        <span>Chủ đề HOT 24/7:</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {HOT_TOPICS.map((topic, i) => (
          <button
            key={i}
            onClick={() => onSelectTopic(topic)}
            className="rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 font-medium text-slate-300 hover:border-blue-500 hover:text-blue-400 transition"
          >
            #{topic}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Sticky Category Quick Jump Bar ──────────────────────────────────────────
function CategoryJumpNav({
  activeCategory,
  onSelectCategory,
}: {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}) {
  return (
    <div className="sticky top-0 z-40 -mx-4 px-4 bg-slate-950/90 backdrop-blur-md border-y border-slate-800/80 py-2.5">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        <span className="text-[11px] font-bold uppercase text-slate-500 shrink-0 mr-1 flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" /> Khối Chuyên Mục:
        </span>
        {CATEGORY_TAGS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeCategory === cat.id
                ? "border border-blue-600 text-cyan-200 shadow-md shadow-blue-600/30"
                : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Big Feature Hero (Thanh Niên Lead Block) ─────────────────────────────────
function HeroLeadSection({
  mainArticle,
  subArticles,
  savedIds,
  onToggleBookmark,
  onShare,
}: {
  mainArticle: NewsArticle;
  subArticles: NewsArticle[];
  savedIds: Set<string>;
  onToggleBookmark: (a: NewsArticle) => void;
  onShare: (a: NewsArticle) => void;
}) {
  const isMainSaved = savedIds.has(mainArticle.article_id);

  return (
    <section className="grid gap-6 lg:grid-cols-12 border-b border-slate-800/80 pb-8">
      {/* Cột trái tiêu điểm lớn */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 lg:col-span-8 flex flex-col justify-between transition hover:border-slate-700">
        <div className="relative h-80 sm:h-105 w-full overflow-hidden bg-slate-800">
          <ArticleCover
            imageUrl={mainArticle.image_url}
            title={mainArticle.title}
            className="group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg">
                <Radio className="h-3.5 w-3.5 animate-pulse" /> Tiêu điểm 24h
              </span>
              {mainArticle.source_name && (
                <span className="rounded-md bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-slate-300 backdrop-blur-md border border-slate-700">
                  {mainArticle.source_name}
                </span>
              )}
            </div>
            <button
              onClick={() => onToggleBookmark(mainArticle)}
              className={`rounded-full p-2 backdrop-blur-md transition ${
                isMainSaved
                  ? "border-cyan-600 text-white"
                  : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              title="Lưu bài viết"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
            {mainArticle.category && <CategoryBadge category={mainArticle.category} />}
            <a
              href={mainArticle.link}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <h2 className="text-xl sm:text-3xl font-black text-white leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                {mainArticle.title}
              </h2>
            </a>
            <p className="line-clamp-2 text-xs sm:text-sm text-slate-300 leading-relaxed hidden sm:block">
              {mainArticle.description}
            </p>
            <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <time>{formatDate(mainArticle.pubDate)}</time>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onShare(mainArticle)}
                  className="flex items-center gap-1 rounded px-3 py-1.5 text-xs text-cyan-300 border border-cyan-300 hover:bg-cyan-500 hover:text-slate-100 transition"
                >
                  <Share2 className="h-3.5 w-3.5" /> Chia sẻ
                </button>
                <a
                  href={mainArticle.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded border border-cyan-300 px-3.5 py-1.5 font-bold text-cyan-300 hover:bg-cyan-500 hover:text-slate-100 transition text-xs"
                >
                  Đọc ngay <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải stack 5 tin quan trọng */}
      <div className="lg:col-span-4 flex flex-col justify-between gap-2.5">
        {subArticles.slice(0, 5).map((article) => (
          <article
            key={article.article_id}
            className="group flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/40 p-2.5 transition hover:border-slate-700 hover:bg-slate-900/80"
          >
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-800">
              <ArticleCover
                imageUrl={article.image_url}
                title={article.title}
                className="group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-1">
                {article.source_name && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 truncate">
                    {article.source_name}
                  </span>
                )}
                <time className="text-[10px] text-slate-500 shrink-0">
                  {formatDate(article.pubDate)}
                </time>
              </div>
              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="line-clamp-2 text-xs font-bold leading-snug text-slate-100 group-hover:text-blue-300 transition-colors"
              >
                {article.title}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── Standard Category Section Block (Chuẩn Khối Báo Chí) ────────────────────
function CategorySectionBlock({
  id,
  title,
  icon: Icon,
  articles,
  savedIds,
  onToggleBookmark,
}: {
  id?: string;
  title: string;
  icon: React.ElementType;
  articles: NewsArticle[];
  savedIds: Set<string>;
  onToggleBookmark: (a: NewsArticle) => void;
}) {
  if (!articles || articles.length === 0) return null;

  const lead = articles[0];
  const sideList = articles.slice(1, 5);
  const bottomGrid = articles.slice(5, 9);

  return (
    <section id={id} className="space-y-4 border-b border-slate-800/80 pb-8 scroll-mt-16">
      {/* Header Chuyên Mục */}
      <div className="flex items-center justify-between border-b-2 border-blue-600 pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-black uppercase tracking-wide text-white">
            {title}
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-400 hover:text-blue-400 cursor-pointer flex items-center gap-0.5">
          Xem thêm {articles.length}+ bài <ChevronRightIcon className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Content Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Section Feature (Left 7 Cols) */}
        {lead && (
          <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-4 transition hover:border-slate-700">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-800 mb-3">
              <ArticleCover imageUrl={lead.image_url} title={lead.title} />
              {lead.source_name && (
                <span className="absolute bottom-2 left-2 rounded bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold text-cyan-400">
                  {lead.source_name}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <a href={lead.link} target="_blank" rel="noreferrer">
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug hover:text-blue-400 transition">
                  {lead.title}
                </h3>
              </a>
              <p className="line-clamp-2 text-xs text-slate-400 leading-relaxed">
                {lead.description}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 text-[11px] text-slate-500 border-t border-slate-800/60 mt-3">
              <time>{formatDate(lead.pubDate)}</time>
              <button
                onClick={() => onToggleBookmark(lead)}
                className={`p-1 rounded ${
                  savedIds.has(lead.article_id) ? "text-blue-400" : "text-slate-500 hover:text-white"
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Side Headline List (Right 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {sideList.map((item) => (
            <article
              key={item.article_id}
              className="group flex gap-3 rounded-lg border border-slate-800/60 bg-slate-900/20 p-2.5 transition hover:border-slate-700 hover:bg-slate-900/60"
            >
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded bg-slate-800">
                <ArticleCover imageUrl={item.image_url} title={item.title} />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="line-clamp-2 text-xs font-bold leading-tight text-slate-200 group-hover:text-blue-300 transition-colors"
                >
                  {item.title}
                </a>
                <time className="text-[10px] text-slate-500 block">
                  {formatDate(item.pubDate)}
                </time>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Bottom Sub-Grid (4 Columns) */}
      {bottomGrid.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          {bottomGrid.map((item) => (
            <article
              key={item.article_id}
              className="group rounded-lg border border-slate-800/60 bg-slate-900/20 p-3 flex flex-col justify-between transition hover:border-slate-700"
            >
              <div className="space-y-2">
                <div className="relative aspect-video w-full overflow-hidden rounded bg-slate-800">
                  <ArticleCover imageUrl={item.image_url} title={item.title} />
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="line-clamp-2 text-xs font-bold text-slate-200 group-hover:text-blue-300 transition"
                >
                  {item.title}
                </a>
              </div>
              <time className="text-[10px] text-slate-500 mt-2 block">
                {formatDate(item.pubDate)}
              </time>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Compact Grid Card Component ──────────────────────────────────────────────
function GridCard({
  article,
  isSaved,
  onToggleBookmark,
}: {
  article: NewsArticle;
  isSaved: boolean;
  onToggleBookmark: (a: NewsArticle) => void;
}) {
  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/30 transition hover:border-slate-700 hover:shadow-lg hover:shadow-blue-950/20">
      <div>
        <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
          <ArticleCover
            imageUrl={article.image_url}
            title={article.title}
            className="group-hover:scale-105"
          />
          {article.source_name && (
            <span className="absolute bottom-2 left-2 rounded bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
              {article.source_name}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleBookmark(article);
            }}
            className={`absolute top-2 right-2 rounded-full p-1.5 backdrop-blur-md transition ${
              isSaved ? "bg-blue-600 text-white" : "bg-slate-950/60 text-slate-400 hover:text-white"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="p-3.5 space-y-2">
          {article.category && <CategoryBadge category={article.category} />}
          <a href={article.link} target="_blank" rel="noreferrer" className="block">
            <h3 className="line-clamp-2 text-xs font-bold leading-snug text-slate-100 group-hover:text-blue-300 transition-colors">
              {article.title}
            </h3>
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800/60 p-3 text-[11px] text-slate-500">
        <time>{formatDate(article.pubDate)}</time>
        <a
          href={article.link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 text-blue-400 hover:text-blue-300 font-semibold"
        >
          Đọc <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
}

// ─── Sidebar Widgets Block ───────────────────────────────────────────────────
function TrendingSidebar({ articles }: { articles: NewsArticle[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Top 15 Đọc Nhiều Nhất
          </h2>
        </div>
        <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-extrabold text-cyan-400">
          RANKING
        </span>
      </div>

      <div className="space-y-3">
        {articles.slice(0, 15).map((article, index) => (
          <a
            key={article.article_id}
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 rounded-lg p-2 transition hover:bg-slate-800/50"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-black ${
                index === 0
                  ? "bg-red-600 text-white"
                  : index === 1
                  ? "bg-amber-500 text-slate-950"
                  : index === 2
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {index + 1 < 10 ? `0${index + 1}` : index + 1}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="line-clamp-2 text-xs font-semibold text-slate-200 leading-snug group-hover:text-cyan-300 transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                {article.source_name && <span>{article.source_name}</span>}
                <span>•</span>
                <time>{formatDate(article.pubDate)}</time>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function FastStreamSidebar({ articles }: { articles: NewsArticle[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Zap className="h-4 w-4 text-amber-400" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Luồng Tin Nhanh 24/7
        </h2>
      </div>

      <div className="relative border-l-2 border-slate-800 pl-3 space-y-3.5 my-2 max-h-150 overflow-y-auto no-scrollbar">
        {articles.slice(0, 20).map((item) => (
          <a
            key={item.article_id}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="group block relative space-y-1"
          >
            <span className="absolute -left-4.25 top-1 h-2 w-2 rounded-full bg-slate-700 group-hover:bg-blue-400 transition" />
            <time className="text-[10px] font-bold text-blue-400 block">
              {formatDate(item.pubDate)}
            </time>
            <p className="line-clamp-2 text-xs font-medium text-slate-300 group-hover:text-white transition">
              {item.title}
            </p>
          </a>
        ))}
      </div>
    </div>
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
    <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-800/80 pt-8">
      <button
        onClick={() => onGoTo(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-bold text-slate-300 transition disabled:opacity-30 hover:border-blue-500 hover:text-blue-400"
      >
        <ChevronLeft className="h-4 w-4" /> Trang trước
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onGoTo(p)}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            p === currentPage
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "border border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onGoTo(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-bold text-slate-300 transition disabled:opacity-30 hover:border-blue-500 hover:text-blue-400"
      >
        Trang sau <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Main HomePage Component ─────────────────────────────────────────────────
export default function HomePage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = scopeFromParam(searchParams.get("scope"));
  const query = searchParams.get("q")?.trim() ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);

  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_BATCH);

  // Saved bookmarks state
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("saved_news_ids");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Track scroll for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleBookmark = (article: NewsArticle) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(article.article_id)) {
        next.delete(article.article_id);
        showToast("Đã bỏ lưu bài viết");
      } else {
        next.add(article.article_id);
        showToast("Đã lưu bài viết vào Bookmark");
      }
      localStorage.setItem("saved_news_ids", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleShare = async (article: NewsArticle) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.description || article.title,
          url: article.link,
        });
      } else {
        await navigator.clipboard.writeText(article.link);
        showToast("Đã sao chép liên kết!");
      }
    } catch {
      // Ignore user cancel
    }
  };

  // Fetch Data
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
        setVisibleCount(INITIAL_VISIBLE_BATCH);
      } catch (err: unknown) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Tải tin tức thất bại");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
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
    setVisibleCount(INITIAL_VISIBLE_BATCH);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", String(page));
      return p;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleTopicSelect = (topic: string) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("q", topic);
      p.delete("page");
      return p;
    });
  };

  // Dynamic jump to category block
  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    if (catId === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(catId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Partitioning layout for 350 articles feed
  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE) || 1;
  const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
  const pageArticles = useMemo(
    () => allArticles.slice(startIdx, startIdx + ARTICLES_PER_PAGE),
    [allArticles, startIdx]
  );

  // Structural Partitioning for 350 articles:
  const mainHero = pageArticles[0] ?? null;
  const subHero = pageArticles.slice(1, 6);
  const newsSec1 = pageArticles.slice(6, 15);
  const newsSec2 = pageArticles.slice(15, 24);
  const newsSec3 = pageArticles.slice(24, 33);
  const newsSec4 = pageArticles.slice(33, 42);
  const newsSec5 = pageArticles.slice(42, 51);
  const newsSec6 = pageArticles.slice(51, 60);
  const newsSec7 = pageArticles.slice(60, 69);
  const newsSec8 = pageArticles.slice(69, 78);
  const newsSec9 = pageArticles.slice(78, 87);
  const newsSec10 = pageArticles.slice(87, 96);

  // Continuous grid stream sliced dynamically for silky smooth performance
  const rawContinuousArticles = useMemo(
    () => pageArticles.slice(96),
    [pageArticles]
  );

  const visibleContinuousArticles = useMemo(
    () => rawContinuousArticles.slice(0, visibleCount),
    [rawContinuousArticles, visibleCount]
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  const handleClearSearch = () => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.delete("q");
      p.delete("page");
      return p;
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast popup */}
      {toastMsg && <Toast message={toastMsg} />}

      {/* Scope Switcher & Query Active Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScope("vn")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              scope === "vn"
                ? "border border-cyan-600 text-cyan-200 shadow-lg shadow-blue-600/30"
                : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Newspaper className="h-4 w-4" /> Tin Trong Nước
          </button>
          <button
            onClick={() => setScope("intl")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              scope === "intl"
                ? "border border-cyan-600 text-cyan-200 shadow-lg shadow-blue-600/30"
                : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Globe className="h-4 w-4" /> Tin Quốc Tế
          </button>
        </div>

        {query && (
          <div className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300">
            <Search className="h-3.5 w-3.5" />
            <span>
              Kết quả tìm kiếm: <strong>"{query}"</strong> ({allArticles.length} bài)
            </span>
            <button
              onClick={handleClearSearch}
              className="ml-2 rounded p-1 hover:bg-blue-500/20 text-blue-400 hover:text-white"
              title="Xóa tìm kiếm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Hot Topics Banner Ticker */}
      <HotTopicsBar onSelectTopic={handleTopicSelect} />

      {/* Category Navigation Bar */}
      <CategoryJumpNav
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {loading ? (
        <Skeleton />
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 transition"
          >
            Thử lại
          </button>
        </div>
      ) : allArticles.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
          <Newspaper className="mx-auto h-12 w-12 text-slate-600" />
          <p className="text-base font-bold text-slate-300">
            Không tìm thấy bài viết phù hợp
          </p>
          {query && (
            <button
              onClick={handleClearSearch}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition"
            >
              <RotateCcw className="h-4 w-4" /> Xem tất cả tin tức
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Main Hero Spotlight Section */}
          {mainHero && (
            <HeroLeadSection
              mainArticle={mainHero}
              subArticles={subHero}
              savedIds={savedIds}
              onToggleBookmark={toggleBookmark}
              onShare={handleShare}
            />
          )}

          {/* Core Content Layout Grid */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Content Column (8 Cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Short Video Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-pink-500">
                  <Sparkles className="h-4 w-4" /> Video Tin Tức Ngắn & Highlight
                </div>
                <VideoCard />
              </div>

              {/* Category Block 1: Thời sự */}
              <CategorySectionBlock
                id="thoi-su"
                title="Thời sự & Chính trị"
                icon={Newspaper}
                articles={newsSec1}
                savedIds={savedIds}
                onToggleBookmark={toggleBookmark}
              />

              {/* Category Block 2: Kinh tế */}
              <CategorySectionBlock
                id="kinh-te"
                title="Kinh tế & Đầu tư"
                icon={TrendingUp}
                articles={newsSec2}
                savedIds={savedIds}
                onToggleBookmark={toggleBookmark}
              />

              {/* Category Block 3: Thế giới */}
              <CategorySectionBlock
                id="the-gioi"
                title="Thế giới"
                icon={Globe}
                articles={newsSec3}
                savedIds={savedIds}
                onToggleBookmark={toggleBookmark}
              />

              {/* Category Block 4: Công nghệ */}
              <CategorySectionBlock
                id="cong-nghe"
                title="Công nghệ & AI"
                icon={Zap}
                articles={newsSec4}
                savedIds={savedIds}
                onToggleBookmark={toggleBookmark}
              />

              {/* Category Block 5: Giải trí */}
              <CategorySectionBlock
                id="giai-tri"
                title="Giải trí & Showbiz"
                icon={Sparkles}
                articles={newsSec5}
                savedIds={savedIds}
                onToggleBookmark={toggleBookmark}
              />

              {/* Category Block 6: Thể thao */}
              <CategorySectionBlock
                id="the-thao"
                title="Thể thao 24/7"
                icon={Flame}
                articles={newsSec6}
                savedIds={savedIds}
                onToggleBookmark={toggleBookmark}
              />

              {/* Category Block 7: Đời sống */}
              <CategorySectionBlock
                id="doi-song"
                title="Đời sống & Gia đình"
                icon={Grid}
                articles={newsSec7}
                savedIds={savedIds}
                onToggleBookmark={toggleBookmark}
              />

              {/* Category Block 8: Pháp luật */}
              <CategorySectionBlock
                id="phap-luat"
                title="Pháp luật"
                icon={Layers}
                articles={newsSec8}
                savedIds={savedIds}
                onToggleBookmark={toggleBookmark}
              />

              {/* Category Block 9: Xe */}
              <CategorySectionBlock
                id="xe"
                title="Xe & Giao thông"
                icon={Tag}
                articles={newsSec9}
                savedIds={savedIds}
                onToggleBookmark={toggleBookmark}
              />

              {/* Category Block 10: Sức khỏe */}
              <CategorySectionBlock
                id="suckhoe"
                title="Sức khỏe & Y tế"
                icon={Eye}
                articles={newsSec10}
                savedIds={savedIds}
                onToggleBookmark={toggleBookmark}
              />

              {/* Extended Continuous Stream Feed (up to 250+ articles) */}
              {rawContinuousArticles.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold uppercase tracking-wide text-white flex items-center gap-2">
                      <Grid className="h-4 w-4 text-blue-400" /> Dòng Tin Tổng
                      Hợp & Mới Nhất ({rawContinuousArticles.length} bài)
                    </h2>
                    <span className="text-xs text-slate-500">
                      Hiển thị {visibleContinuousArticles.length} / {rawContinuousArticles.length}
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleContinuousArticles.map((article) => (
                      <GridCard
                        key={article.article_id}
                        article={article}
                        isSaved={savedIds.has(article.article_id)}
                        onToggleBookmark={toggleBookmark}
                      />
                    ))}
                  </div>

                  {visibleCount < rawContinuousArticles.length && (
                    <div className="pt-4 text-center">
                      <button
                        onClick={handleLoadMore}
                        className="rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-xs font-bold text-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition shadow-lg"
                      >
                        Mở rộng thêm {BATCH_SIZE} bài viết nữa...
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar Column (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              <TrendingSidebar articles={allArticles} />
              <FastStreamSidebar articles={allArticles} />
            </div>
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onGoTo={goToPage}
          />
        </>
      )}

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-50 rounded-full bg-blue-600 p-3 text-white shadow-xl shadow-blue-600/40 hover:bg-blue-500 transition duration-300"
          title="Về đầu trang"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      <PremierLeagueStandings />
    </div>
  );
}