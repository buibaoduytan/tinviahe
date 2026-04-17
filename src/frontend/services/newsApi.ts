import type { NewsArticle } from "../types/news";

export type NewsScope = "vn" | "intl";

const BASE_URL = "http://localhost:3001";

export async function getNews(
  scope: NewsScope,
  query?: string
): Promise<{ articles: NewsArticle[]; total: number }> {
  const params = new URLSearchParams({ scope });
  const q = query?.trim();
  if (q) params.set("q", q);

  try {
    const res = await fetch(`${BASE_URL}/api/news?${params.toString()}`);

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

    const articles = Array.isArray(data.articles) ? data.articles : [];

    return {
      articles,
      total: data.total ?? articles.length,
    };
  } catch (err) {
    console.error("Fetch lỗi:", err);
    return { articles: [], total: 0 };
  }
}