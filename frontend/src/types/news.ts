export interface NewsArticle {
  title: string;
  url: string;
  imageUrl: string | null;
  description: string | null;
  content: string | null;
  author: string | null;
  publishedAt: string;
  source: {
    id: string | null;
    name: string | null;
  } | null;
}

export interface NewsApiResponse {
  articles: NewsArticle[];
  total: number;
}

export interface RawNewsArticle {
  title?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  description: string | null;
  content?: string | null;
  author?: string | null;
  publishedAt?: string | null;
  source?: {
    id?: string | null;
    name?: string | null;
  } | null;
}