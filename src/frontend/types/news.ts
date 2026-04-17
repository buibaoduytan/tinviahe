export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  }
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  content: string | null;
}