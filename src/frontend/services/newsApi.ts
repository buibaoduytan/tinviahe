import type { NewsArticle } from "../types/news";

interface HnStory {
  objectID: string;
  title: string | null;
  story_title: string | null;
  url: string | null;
  story_url: string | null;
  author: string;
  created_at: string;
}

interface HnResponse {
  hits: HnStory[];
}

export async function getLatestNews(): Promise<NewsArticle[]> {
  const response = await fetch(
    "https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=6",
  );
  if (!response.ok) {
    throw new Error("Không thể tải tin tức mới nhất");
  }

  const data = (await response.json()) as HnResponse;
  return data.hits
    .map((item) => ({
      id: item.objectID,
      title: item.title ?? item.story_title ?? "Bản tin chưa có tiêu đề",
      url: item.url ?? item.story_url ?? "#",
      author: item.author,
      publishedAt: item.created_at,
    }))
    .filter((item) => item.url !== "#");
}
