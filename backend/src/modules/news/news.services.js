const { NEWS_API_KEY } = require("../../config/env");

const NEWS_API_BASE_URL = "https://newsdata.io/api/1/latest";
const MAX_PAGES = 3;

function mapArticle(raw = {}) {
  return {
    title: raw.title ?? "Không có tiêu đề",
    url: raw.link ?? "#",
    imageUrl: raw.image_url ?? null,
    description: raw.description ?? null,
    content: raw.content ?? null,
    author: Array.isArray(raw.creator) ? raw.creator[0] ?? null : raw.creator ?? null,
    publishedAt: raw.pubDate ?? new Date().toISOString(),
    source: {
      id: raw.source_id ?? null,
      name: raw.source_name ?? null,
    },
  };
}

async function requestNews(params) {
  if (!NEWS_API_KEY) {
    throw new Error("Thiếu NEWS_API_KEY trong môi trường backend.");
  }

  const query = new URLSearchParams({
    apikey: NEWS_API_KEY,
    language: params.language,
    ...(params.q ? { q: params.q } : {}),
    ...(params.country ? { country: params.country } : {}),
    ...(params.nextPage ? { page: params.nextPage } : {}),
  });

  const response = await fetch(`${NEWS_API_BASE_URL}?${query.toString()}`);
  if (!response.ok) {
    throw new Error(`News API lỗi HTTP ${response.status}`);
  }

  const payload = await response.json();
  return {
    results: Array.isArray(payload.results) ? payload.results : [],
    nextPage: payload.nextPage ?? null,
  };
}

module.exports.getLatestNews = async ({ q, country, language }) => {
  const data = await requestNews({ q, country, language });
  return data.results.map(mapArticle);
};

module.exports.getAllNews = async ({ q, country, language }) => {
  const allNews = [];
  let nextPage = null;
  let pageCount = 0;

  while (pageCount < MAX_PAGES) {
    const data = await requestNews({ q, country, language, nextPage });
    allNews.push(...data.results.map(mapArticle));
    pageCount += 1;

    if (!data.nextPage) {
      break;
    }
    nextPage = data.nextPage;
  }

  return allNews;
};