const router = require("express").Router();
const { NEWS_API_KEY } = require("../config/env");

const BASE = "https://newsapi.org/v2";
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();


async function fetchNews(url) {
  const cached = cache.get(url);
  if (cached && Date.now() < cached.expireAt) return cached.data;

  const response = await fetch(url);
  const rawText = await response.text();

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    return { ok: false, status: 502, data: { message: "Phản hồi NewsAPI không hợp lệ" } };
  }

  const result = { ok: response.ok, status: response.status, data };
  if (response.ok) {
    cache.set(url, { data: result, expireAt: Date.now() + CACHE_TTL });
  }
  return result;
}

function buildArticle(a, idx, scope) {
  const id = a.url
    ? `${scope}-${Buffer.from(a.url).toString("hex").slice(0, 24)}`
    : `${scope}-${idx}`;
  return {
    id,
    title: a.title || "Không có tiêu đề",
    description: a.description || null,
    url: a.url || null,
    author: a.author || a.source?.name || "Không rõ",
    publishedAt: a.publishedAt || new Date().toISOString(),
    imageUrl: a.urlToImage || null,
    source: a.source?.name || null,
  };
}


router.get("/", async (req, res) => {
  try {
    const scope = req.query.scope === "intl" ? "intl" : "vn";
    const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
    const country = scope === "vn" ? "vn" : "us";

    const urlTop = `${BASE}/top-headlines?country=${country}&apiKey=${NEWS_API_KEY}`;
    const urlEverything = `${BASE}/everything?q=${encodeURIComponent(q || "Vietnam")}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;

    const primaryUrl = q ? urlEverything : urlTop;
    const primaryRes = await fetchNews(primaryUrl);

    if (!primaryRes.ok || primaryRes.data?.status === "error") {
      const msg = primaryRes.data?.message || `NewsAPI lỗi ${primaryRes.status}`;
      return res.status(502).json({ error: msg });
    }

    let list = primaryRes.data.articles ?? [];

    if (!q && scope === "vn" && list.length === 0) {
      const fallback = await fetchNews(urlEverything);
      if (fallback.ok && fallback.data?.status !== "error") {
        list = fallback.data.articles ?? [];
      }
    }

    const articles = list
      .map((a, idx) => buildArticle(a, idx, scope))
      .filter((a) => a.url);

    return res.json({ articles, total: articles.length, provider: "newsapi.org" });
  } catch (err) {
    console.error("[news] fetch error:", err);
    return res.status(500).json({ error: "Lỗi server khi lấy tin tức" });
  }
});

module.exports = router;