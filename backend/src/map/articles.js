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
    creator:          Array.isArray(raw.creator) ? (raw.creator[0] ?? null) : (raw.creator ?? null),
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
    duplicate:        raw.duplicate ?? false,
  };
}
module.exports = {mapArticle,};