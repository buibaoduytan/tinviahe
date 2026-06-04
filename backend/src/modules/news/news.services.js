const { apikey } = require("../../config/env");
const NEWS_API_BASE_URL = "https://newsdata.io/api/1/latest";
const { mapArticle } = require("../../map/articles");
const { MAX_PAGES } = require("../../config/env");
async function requestNews({ q, country, language, nextPage }) {
  const params = {
    apikey,
    language,
    ...(q       ? { q }               : {}),
    ...(country ? { country }         : {}),
    // newsdata.io dùng "page" cho pagination token (string)
    ...(nextPage ? { page: nextPage } : {}),
  };

  const response = await fetch(`${NEWS_API_BASE_URL}?${new URLSearchParams(params).toString()}`);
  if (!response.ok) {
    throw new Error(`News API lỗi HTTP ${response.status}`);
  }
  const data = await response.json();
  if (data.status !== "success") {
    throw new Error(data.message ?? "News API trả về lỗi không xác định");
  }
  return {
    results:  Array.isArray(data.results) ? data.results : [],
    nextPage: data.nextPage ?? null,
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
