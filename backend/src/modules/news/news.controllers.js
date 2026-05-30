const { getLatestNews, getAllNews } = require("./news.services");

function scopeToFilter(scope = "vn") {
  if (scope === "intl") {
    return { language: "en", country: "us" };
  }
  // default: vn
  return { language: "vi", country: "vn" };
}

module.exports.fetchNews = async (req, res) => {
  try {
    const { q = "", scope = "vn", full = "false" } = req.query;
    const { language, country } = scopeToFilter(scope);
    const isFull = String(full).toLowerCase() === "true";

    const articles = isFull
      ? await getAllNews({ q: q.trim(), language, country })
      : await getLatestNews({ q: q.trim(), language, country });

    res.json({
      articles,
      total: articles.length,
    });
  } catch (err) {
    console.error("[fetchNews]", err);
    res.status(500).json({
      articles: [],
      total: 0,
      message: err instanceof Error ? err.message : "Không thể tải tin tức",
    });
  }
};