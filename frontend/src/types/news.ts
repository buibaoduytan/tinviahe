export interface NewsArticle {
    article_id: string
    link: string
    title: string
    description: string
    content: string
    keywords: string
    creator: string
    language: string

    country: string
    category: string

    datatype: string

    pubDate: string
    pubDateTZ: string
    fetched_at: string

    image_url: string | null
    video_url: string | null

    source_id: string
    source_name: string
    source_priority: number
    source_url: string
    source_icon: string | null

    sentiment: string
    sentiment_stats: string

    ai_tag: string
    ai_region: string
    ai_org: string
    ai_summary: string

    duplicate: boolean
}
export interface NewsApiResponse {
  articles: NewsArticle[];
  total: number;
}