import type { NewsApiResponse, NewsArticle, RawNewsArticle } from "../types/news";

export type NewsScope = "vn" | "intl";

const BASE_URL = "http://localhost:3001";

export async function getNews(
  scope: NewsScope,
  query?: string
): Promise<NewsApiResponse> {
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
    const rawArticles: RawNewsArticle[] = Array.isArray(data.articles) ? data.articles : [];
    const articles: NewsArticle[] = rawArticles.map((article, index) => ({
      title: article.title ?? "Không có tiêu đề",
      url: article.url ?? `#article-${index}`,
      imageUrl: article.imageUrl ?? null,
      description: article.description ?? null,
      content: article.content ?? null,
      author: article.author ?? null,
      publishedAt: article.publishedAt ?? new Date().toISOString(),
      source: article.source
        ? {
            id: article.source.id ?? null,
            name: article.source.name ?? null,
          }
        : null,
    }));

    return {
      articles,
      total: data.total ?? articles.length,
    };
  } catch (err) {
    console.error("Fetch lỗi:", err);
    return { articles: [], total: 0 };
  }
}