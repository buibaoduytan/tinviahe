import type { NewsApiResponse, NewsArticle } from "../types/news";

export type NewsScope = "vn" | "intl";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function getNews(
  scope: NewsScope,
  query?: string,
  full = false,
): Promise<NewsApiResponse> {
  const params = new URLSearchParams({ scope, full: String(full) });
  const q = query?.trim();
  if (q) params.set("q", q);

  try {
    const res = await fetch(`${BASE_URL}/news?${params.toString()}`);

    if (!res.ok) {
      console.error("Lỗi Http:", res.status);
      return { articles: [], total: 0 };
    }

    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("API trả về không phải JSON:", text);
      return { articles: [], total: 0 };
    }

    const data = await res.json();
    const rawArticles: NewsArticle[] = Array.isArray(data.articles)
      ? data.articles
      : [];

    return {
      articles: rawArticles,
      total: data.total ?? rawArticles.length,
    };
  } catch (err) {
    console.error("Fetch lỗi:", err);
    return { articles: [], total: 0 };
  }
}