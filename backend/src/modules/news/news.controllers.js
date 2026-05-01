const { getLatestNews, getAllNews } = require("./news.services");

function scopeToFilter(scope) {
  if (scope === "vn") {
    return { country: "vi", language: "vi" };
  }
  return { country: "us", language: "en" };
}

module.exports.fetchNews = async (req, res) => {
  try {
    const { q = "", scope = "vn", full = "false" } = req.query;
    const { country, language } = scopeToFilter(scope);

    const articles =
      full === "true"
        ? await getAllNews({ q, country, language })
        : await getLatestNews({ q, country, language });

    res.json({
      articles,
      total: articles.length,
    });
  } catch (err) {
    res.status(500).json({
      articles: [],
      total: 0,
      message: err instanceof Error ? err.message : "Không thể tải tin tức",
    });
  }
};