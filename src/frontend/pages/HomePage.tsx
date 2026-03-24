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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? <p className="text-slate-300">Đang tải tin tức...</p> : null}
        {!loading && error ? <p className="text-red-300">{error}</p> : null}
        {!loading && !error
          ? articles.map((article, index) => (
              <article
                key={article.id}
                className="card-float rounded-xl border border-slate-800 bg-slate-900/70 p-4"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <h3 className="font-semibold text-blue-300">{article.title}</h3>
                <p className="mt-2 text-sm text-slate-400">Tác giả: {article.author}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(article.publishedAt).toLocaleString("vi-VN")}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-cyan-300 transition hover:text-cyan-200"
                >
                  Đọc bài viết
                </a>
              </article>
            ))
          : null}
      </div>
    </section>
  );
}
