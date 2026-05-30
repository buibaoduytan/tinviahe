const { apikey } = require("../../config/env");

const NEWS_API_BASE_URL = "https://newsdata.io/api/1/latest";
const MAX_PAGES = 3;

function mapArticle(raw = {}) {
  return {
    article_id:       raw.article_id ?? raw.link ?? null,
    title:            raw.title ?? "Không có tiêu đề",
    link:             raw.link ?? "#",
    image_url:        raw.image_url ?? null,
    video_url:        raw.video_url ?? null,
    description:      raw.description ?? null,
    content:          raw.content ?? null,
    // creator trong newsdata.io là string[], lấy phần tử đầu
    creator:          Array.isArray(raw.creator)
                        ? (raw.creator[0] ?? null)
                        : (raw.creator ?? null),
    pubDate:          raw.pubDate ?? new Date().toISOString(),
    pubDateTZ:        raw.pubDateTZ ?? null,
    // source info
    source_id:        raw.source_id ?? null,
    source_name:      raw.source_name ?? null,
    source_url:       raw.source_url ?? null,
    source_icon:      raw.source_icon ?? null,
    source_priority:  raw.source_priority ?? 0,
    // meta
    language:         raw.language ?? null,
    country:          Array.isArray(raw.country) ? raw.country : (raw.country ? [raw.country] : []),
    category:         Array.isArray(raw.category) ? raw.category : (raw.category ? [raw.category] : []),
    keywords:         raw.keywords ?? null,
    // AI / sentiment
    ai_tag:           raw.ai_tag ?? null,
    ai_region:        raw.ai_region ?? null,
    ai_org:           raw.ai_org ?? null,
    ai_summary:       raw.ai_summary ?? null,
    sentiment:        raw.sentiment ?? null,
    sentiment_stats:  raw.sentiment_stats ?? null,
    duplicate:        raw.duplicate ?? false,
  };
}

async function requestNews({ q, country, language, nextPage }) {
  const params = {
    apikey,
    language,
    ...(q       ? { q }               : {}),
    ...(country ? { country }         : {}),
    // newsdata.io dùng "page" cho pagination token (string)
    ...(nextPage ? { page: nextPage } : {}),
  };

  const response = await fetch(
    `${NEWS_API_BASE_URL}?${new URLSearchParams(params).toString()}`
  );
  if (!response.ok) {
    throw new Error(`News API lỗi HTTP ${response.status}`);
  }

  const payload = await response.json();

  if (payload.status !== "success") {
    throw new Error(payload.message ?? "News API trả về lỗi không xác định");
  }

  return {
    results:  Array.isArray(payload.results) ? payload.results : [],
    nextPage: payload.nextPage ?? null,
  };
}

module.exports.getLatestNews = async ({ q, country, language }) => {
  const data = await requestNews({ q, country, language, nextPage: null });
  return data.results.map(mapArticle);
};

module.exports.getAllNews = async ({ q, country, language }) => {
  const allArticles = [];
  let nextPage = null;
  let pageCount = 0;

  do {
    const data = await requestNews({ q, country, language, nextPage });
    allArticles.push(...data.results.map(mapArticle));
    nextPage = data.nextPage;
    pageCount++;
  } while (nextPage && pageCount < MAX_PAGES);

  return allArticles;
};