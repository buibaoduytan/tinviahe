  import type { NewsArticle } from "../types/news";

  export type NewsScope = "vn" | "intl";

  export async function getNews(
    scope: NewsScope,
    query?: string
  ): Promise<{ articles: NewsArticle[]; total: number }> {
    const params = new URLSearchParams({ scope });
    const q = query?.trim();
    if (q) params.set("q", q);

    let response: Response;
    try {
      response = await fetch(`/api/news?${params.toString()}`);
    } catch {
      return { articles: [], total: 0 };
    }

    if (!response.ok) return { articles: [], total: 0 };

    const data = (await response.json()) as { articles?: NewsArticle[]; total?: number };
    const articles = Array.isArray(data.articles) ? data.articles : [];
    return { articles, total: data.total ?? articles.length };
  }