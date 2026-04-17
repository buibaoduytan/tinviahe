import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getNews, type NewsScope } from "../services/newsApi";
import type { NewsArticle } from "../types/news";
import VideoScroll from "../ui/VideoScroll";
import { BellDot } from "lucide-react";

function scopeFromParam(v: string | null): NewsScope {
  return v === "intl" ? "intl" : "vn";
}

function ArticleCover({ imageUrl, title }: { imageUrl?: string | null; title: string }) {
  const [failed, setFailed] = useState(false);
  if (!imageUrl || failed) {
    return (
      <div className="flex h-full min-h-35 w-full items-center justify-center bg-linear-to-br from-slate-800 via-slate-800 to-slate-900 text-center text-xs text-slate-500">
        Không có ảnh
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt={title}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = scopeFromParam(searchParams.get("scope"));
  const query = searchParams.get("q")?.trim() ?? "";

  const [articles, setarticles] = useState<NewsArticle[]>([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState("");
  const [, setDemo] = useState(false);
  const [, setProvider] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadNews() {
      setloading(true);
      seterror("");
      try {
        const data = await getNews(scope, query || undefined);
        if (cancelled) return;
        setarticles(data.articles);
      } catch (err: unknown) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Tải tin tức thất bại";
        seterror(message);
        setDemo(false);
        setProvider(null);
      } finally {
        if (!cancelled) setloading(false);
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
      return p;
    });
  }

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <section className="space-y-10 pb-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900 via-slate-900 to-blue-950/90 p-8 shadow-2xl shadow-blue-950/20 md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">TinViaHe</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-4xl">
          Tin tức tổng hợp
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          Cập nhật tin tức mới nhất từ Việt Nam và thế giới, được tổng hợp từ nhiều nguồn đáng tin cậy.
        </p>


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

      

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40"
            >
              <div className="aspect-video animate-pulse bg-slate-800" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-1/3 animate-pulse rounded bg-slate-700" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-700" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!loading && error ? (
        <p className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-red-200">{error}</p>
      ) : null}

      {!loading && !error && articles.length === 0 ? (
        <p className="text-center text-slate-400">Không có bài nào phù hợp. Thử đổi từ khóa hoặc khu vực.</p>
      ) : null}

      {!loading && !error && featured ? (
        <div className="space-y-6">
          <BellDot  className="font-bold text-3xl text-slate-200">Nổi bật</BellDot>
          <article className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl transition hover:border-slate-700 md:grid md:grid-cols-2">
            <div className="relative aspect-video overflow-hidden bg-slate-800 md:aspect-auto">
              <ArticleCover imageUrl={featured.imageUrl} title={featured.title} />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              {featured.source ? (
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90">
                  {featured.content}
                </span>
              ) : null}
              <h3 className="mt-2 text-2xl font-bold leading-tight text-white md:text-3xl">{featured.title}</h3>
              {featured.description ? (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">{featured.description}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>{featured.author}</span>
                <span>·</span>
                <time dateTime={featured.publishedAt}>{new Date(featured.publishedAt).toLocaleString("vi-VN")}</time>
              </div>
              <a
                href={featured.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-linear-to-br from-blue-600 via-blue-500 to-blue-300 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Đọc bài
                <span aria-hidden>→</span>
              </a>
            </div>
          </article>
            
          {rest.length > 0 ? (
            <>
              <h2 className="pt-2 text-2xl pb-5 border-b-2 flex justify-center items-center font-semibold">MỘT SỐ TIN TỨC KHÁC </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article, index) => (
                  <article
                    key={article.imageUrl}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-lg transition hover:border-slate-700 hover:shadow-blue-950/20"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-800">
                      <ArticleCover imageUrl={article.imageUrl} title={article.title} />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      {article.source ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/85">
                          {article.author}
                        </span>
                      ) : null}
                      <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-slate-100">
                        {article.title}
                      </h3>
                      {article.description ? (
                        <p className="mt-2 line-clamp-2 text-xs text-slate-500">{article.description}</p>
                      ) : null}
                      <p className="mt-auto pt-3 text-[11px] text-slate-600">
                        {article.author} · {new Date(article.publishedAt).toLocaleDateString("vi-VN")}
                      </p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
                      >
                        Mở bài viết
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      <VideoScroll />
    </section>
  );
}
