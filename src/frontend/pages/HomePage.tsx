import { useEffect, useState } from "react";
import { getLatestNews } from "../services/newsApi";
import type { NewsArticle } from "../types/news";

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getLatestNews()
      .then((data) => {
        setArticles(data);
        setError("");
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Tải tin tức thất bại";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-8">
      <div className="hover:scale-102 duration-100 animate-fade-in rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 to-blue-950 p-6 shadow-2xl">
        <h1 className="text-3xl font-bold md:text-4xl">Nền tảng Tinviahe – Trung tâm tổng hợp tin tức thông minh</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Frontend tối ưu trải nghiệm người dùng, backend API độc lập, dễ dàng mở rộng và phát triển.
        </p>
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
          <BellDot className="hover:text-yellow-500" />
          <h2 className="font-bold text-3xl text-shadow-white shadow-lg hover:shadow-blue-600">Nổi bật</h2>
          <article className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl transition hover:border-slate-700 md:grid md:grid-cols-2">
            <div className="relative aspect-video overflow-hidden bg-slate-800 md:aspect-auto">
              <ArticleCover imageUrl={featured.imageUrl} title={featured.title} />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              {featured.source ? (
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90">
                  {featured.source}
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
                    key={article.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-lg transition hover:border-slate-700 hover:shadow-blue-950/20"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-800">
                      <ArticleCover imageUrl={article.imageUrl} title={article.title} />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      {article.source ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/85">
                          {article.source}
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
