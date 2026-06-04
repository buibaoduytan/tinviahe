import type { Key } from "react"

export interface NewsArticle {
    publishedAt: string | number | Date
    source: any
    url: Key | null | undefined
    article_id: string
    link: string
    title: string
    description: string
    content: string
    keywords: string
    creator: string
    language: string

    country: string | string[];
    category: string | string[];

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
    duplicate: boolean
}
export interface NewsApiResponse {
  articles: NewsArticle[];
  total: number;
}