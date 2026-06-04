import React, { useState, useRef, useCallback, useEffect } from "react";
import type { JSX } from "react/jsx-runtime";
import type { Video } from "../types/video";
import type { NewsArticle } from "../types/news";
import { getNews } from "../services/newsApi";
import {
  Play, VolumeX, Volume2,
  Heart, MessageCircle, Share2, Bookmark,
  Maximize2, Minimize2, X, ChevronUp, ChevronDown,
  MoreVertical, Link2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

// Merged type: a VideoCard can be driven by either a Video or a NewsArticle
type VideoItem = Partial<Video> & Partial<NewsArticle> & {
  id: string | number;
  resolvedVideoUrl: string;
  resolvedThumb: string;
  resolvedTitle: string;
  resolvedDescription: string;
  resolvedAuthor: string;
  resolvedTag: string;
  resolvedSource: string;
  resolvedDate: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  likedByUser: boolean;
  savedByUser: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}


function buildShareUrl(videoId: string | number): string {
  return `${window.location.origin}/video/${videoId}`;
}

/**
 * Normalise a raw Video or NewsArticle into a VideoItem.
 * Priority: video_url (NewsArticle) → videoUrl (Video)
 */
export function normaliseToVideoItem(
  raw: (Video & { id: number }) | NewsArticle,
  index: number,
): VideoItem {
  const asArticle = raw as NewsArticle;
  const asVideo = raw as Video & { id: number };

  const resolvedVideoUrl =
    asArticle.video_url ??
    asVideo.videoUrl ??
    "https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4";

  const resolvedThumb =
    asArticle.image_url ??
    asVideo.imgUrl ??
    `https://via.placeholder.com/600x400?text=Video+${index + 1}`;

  return {
    id: asArticle.article_id ?? asVideo.id ?? index,
    resolvedVideoUrl,
    resolvedThumb,
    resolvedTitle: asArticle.title ?? (asVideo as any).quote ?? "",
    resolvedDescription: asArticle.description ?? asVideo.description ?? "",
    resolvedAuthor: asArticle.creator ?? asVideo.author ?? "Unknown",
    resolvedTag: Array.isArray(asArticle.category)
      ? asArticle.category.join(", ")
      : asArticle.category ?? (asVideo as any).tag ?? "News",
    resolvedSource: asArticle.source_name ?? (asVideo as any).source ?? "",
    resolvedDate: asArticle.pubDate
      ? new Date(asArticle.pubDate).toLocaleDateString("vi-VN")
      : (asVideo as any).date ?? "",
    likes: (asVideo.likes as number) ?? 0,
    comments: (asVideo.comments as number) ?? 0,
    shares: (asVideo.shares as number) ?? 0,
    views: (asVideo.views as number) ?? 0,
    likedByUser: asVideo.likedByUser ?? false,
    savedByUser: asVideo.savedByUser ?? false,
  };
}

// ─── Mock data ────────────────────────────────────────────────────────────────


// ─── CommentSheet ─────────────────────────────────────────────────────────────

function CommentSheet({ count, onClose }: { count: number; onClose: () => void }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-30 rounded-t-3xl flex flex-col"
      style={{ background: "rgba(8, 16, 28, 0.97)", height: "60%", backdropFilter: "blur(12px)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <span className="text-white font-semibold text-sm">{fmt(count)} bình luận</span>
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {count === 0 ? (
          <div className="text-white/60 text-sm">Chưa có bình luận nào.</div>
        ) : (
          <div className="text-white/60 text-sm">Không có dữ liệu bình luận chi tiết.</div>
        )}
      </div>
      <div className="flex items-center gap-3 px-5 py-4 border-t border-white/10">
        <div className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-white/40 text-sm">
          Thêm bình luận...
        </div>
        <button className="text-[#378ADD] text-sm font-medium">Gửi</button>
      </div>
    </div>
  );
}

// ─── SideActions ──────────────────────────────────────────────────────────────

interface SideActionsProps {
  item: VideoItem;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
}

function SideActions({ item, onLike, onComment, onShare, onSave }: SideActionsProps) {
  return (
    <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 z-20">
      {/* Author avatar */}
      <div className="relative mb-2">
        <div
          className="w-12 h-12 rounded-full border-2 border-white overflow-hidden"
          style={{ background: "#1e3a5f" }}
        >
          <img
            src={`https://i.pravatar.cc/48?u=${item.id}`}
            alt={item.resolvedAuthor}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FE2C55] flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">+</span>
        </div>
      </div>

      <SideBtn
        icon={<Heart size={28} fill={item.likedByUser ? "#FE2C55" : "none"} />}
        label={fmt(item.likes)}
        onClick={onLike}
        active={item.likedByUser}
        activeColor="#FE2C55"
      />
      <SideBtn
        icon={<MessageCircle size={28} />}
        label={fmt(item.comments)}
        onClick={onComment}
      />
      <SideBtn
        icon={<Share2 size={26} />}
        label={fmt(item.shares)}
        onClick={onShare}
      />
      <SideBtn
        icon={<Bookmark size={26} fill={item.savedByUser ? "#FFD700" : "none"} />}
        onClick={onSave}
        active={item.savedByUser}
        activeColor="#FFD700"
      />
    </div>
  );
}

interface SideBtnProps {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  active?: boolean;
  activeColor?: string;
}

function SideBtn({ icon, label, onClick, active, activeColor }: SideBtnProps) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="flex flex-col items-center gap-1 group"
    >
      <div
        className="transition-transform group-active:scale-90"
        style={{ color: active && activeColor ? activeColor : "white" }}
      >
        {icon}
      </div>
      {label && (
        <span className="text-white text-xs font-semibold drop-shadow-md">{label}</span>
      )}
    </button>
  );
}

// ─── VideoSlide (one full-screen TikTok card) ─────────────────────────────────

interface VideoSlideProps {
  item: VideoItem;
  isActive: boolean;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

function VideoSlide({
  item,
  isActive,
  onLike,
  onSave,
  onShare,
  isExpanded,
  onExpand,
  onCollapse,
}: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Play / pause when slide becomes active
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setPlaying(false);
      setShowComments(false);
    }
  }, [isActive]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  }, [playing]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (duration) setProgress((currentTime / duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(buildShareUrl(item.id)).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1500);
    });
  };

  return (
    <div
      className="relative w-full h-full shrink-0 overflow-hidden bg-black"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* ── Video ── */}
      <video
        ref={videoRef}
        src={item.resolvedVideoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted={muted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        poster={item.resolvedThumb}
      />

      {/* Dark gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)" }}
      />
      <div
        className="absolute top-0 inset-x-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)" }}
      />

      {/* Play / Pause indicator */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center">
            <Play size={32} className="text-white ml-1" />
          </div>
        </div>
      )}

      {/* ── Top bar ── */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 pt-safe pt-4 z-20">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
          style={{ background: "rgba(55,138,221,0.8)" }}
        >
          {item.resolvedTag}
        </span>
        <div className="flex items-center gap-2">
          {/* Mute */}
          <button
            onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}
            className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          {/* Expand / Collapse */}
          <button
            onClick={(e) => { e.stopPropagation(); isExpanded ? onCollapse() : onExpand(); }}
            className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* ── Side actions ── */}
      <SideActions
        item={item}
        onLike={onLike}
        onComment={() => setShowComments((p) => !p)}
        onShare={onShare}
        onSave={onSave}
      />

      {/* ── Bottom info ── */}
      <div className="absolute bottom-0 left-0 right-16 px-4 pb-6 z-20 space-y-2">
        <p className="text-white font-semibold text-sm">@{item.resolvedAuthor}</p>
        <p className="text-white text-base font-medium leading-snug line-clamp-2">
          {item.resolvedTitle}
        </p>
        {item.resolvedDescription && (
          <p className="text-white/70 text-xs leading-relaxed line-clamp-2">
            {item.resolvedDescription}
          </p>
        )}
        <div className="flex items-center gap-3 text-white/50 text-xs">
          <span>{item.resolvedSource}</span>
          {item.resolvedDate && <><span>·</span><span>{item.resolvedDate}</span></>}
          <span>·</span>
          <span>{fmt(item.views)} lượt xem</span>
        </div>

        {/* Scrolling hashtag row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(item.resolvedTag.split(",")).map((t, i) => (
            <span key={i} className="text-[#7dd3fc] text-xs whitespace-nowrap">#{t.trim()}</span>
          ))}
          {(item as NewsArticle).keywords?.split(",").slice(0, 4).map((k: string, i: number) => (
            <span key={`kw-${i}`} className="text-white/50 text-xs whitespace-nowrap">#{k.trim()}</span>
          ))}
        </div>

        {/* Copy link */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors text-xs"
        >
          <Link2 size={13} />
          {showCopied ? "Đã sao chép!" : "Sao chép liên kết"}
        </button>
      </div>

      {/* ── Progress bar ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-0.5 cursor-pointer z-20"
        style={{ background: "rgba(255,255,255,0.2)" }}
        onClick={handleSeek}
      >
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${progress}%`, background: "#378ADD" }}
        />
      </div>

      {/* ── Comment sheet ── */}
      {showComments && (
        <CommentSheet
          count={item.comments}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface VideoScrollPageProps {
  /**
   * Pass either Video[] or NewsArticle[].
   * If omitted, the page fetches video items from the backend API.
   */
  rawItems?: ((Video & { id: number }) | NewsArticle)[];
}

export default function VideoScrollPage({ rawItems }: VideoScrollPageProps): JSX.Element {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Observe which slide is in view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      const containerH = container.clientHeight;
      let best = 0;
      let bestDist = Infinity;
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top - containerTop + rect.height / 2;
        const dist = Math.abs(center - containerH / 2);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setActiveIndex(best);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = (dir: -1 | 1) => {
    const next = activeIndex + dir;
    if (next < 0 || next >= items.length) return;
    slideRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLike = (id: string | number) => {
    setItems((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, likedByUser: !v.likedByUser, likes: v.likes + (v.likedByUser ? -1 : 1) }
          : v,
      ),
    );
  };

  const handleSave = (id: string | number) => {
    setItems((prev) =>
      prev.map((v) => (v.id === id ? { ...v, savedByUser: !v.savedByUser } : v)),
    );
  };

  const handleShare = (item: VideoItem) => {
    const url = buildShareUrl(item.id);
    if (navigator.share) {
      navigator.share({ title: item.resolvedTitle, text: item.resolvedDescription, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  useEffect(() => {
    let active = true;

    if (rawItems) {
      setItems(rawItems.map((r, i) => normaliseToVideoItem(r, i)));
      setFetchError(null);
      setIsLoading(false);
      return;
    }

    async function load() {
      setIsLoading(true);
      setFetchError(null);

      const data = await getNews("vn", undefined, true);
      if (!active) return;

      const normalized = data.articles.map((r, i) => normaliseToVideoItem(r, i));
      setItems(normalized);
      setFetchError(normalized.length === 0 ? "Không tìm thấy video từ backend." : null);
      setIsLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [rawItems]);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white text-sm">
        Đang tải video...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white text-sm px-4 text-center">
        {fetchError}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white text-sm px-4 text-center">
        Không có video để hiển thị.
      </div>
    );
  }

  return (
      <div
      className={`bg-black font-sans flex flex-col transition-all duration-300 ${
        expanded ? "fixed inset-0 z-50" : "relative w-full"
      }`}
      style={{ height: expanded ? "100dvh" : "100dvh" }}
    >
      {/* ── Header ── */}
      {!expanded && (
        <header className="absolute top-0 inset-x-0 z-40 flex items-center justify-center py-3 pointer-events-none">
          <div className="flex items-center gap-6 text-sm font-semibold text-white/50">
            <span className="text-white">Tin tức</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>Khám phá</span>
          </div>
        </header>
      )}

      {/* ── Slide container ── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll"
        style={{
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((item, i) => (
          <div
            key={String(item.id)}
            ref={(el) => { slideRefs.current[i] = el; }}
            style={{ height: "100dvh", scrollSnapAlign: "start", flexShrink: 0 }}
          >
            <VideoSlide
              item={item}
              isActive={activeIndex === i}
              onLike={() => handleLike(item.id)}
              onSave={() => handleSave(item.id)}
              onShare={() => handleShare(item)}
              isExpanded={expanded}
              onExpand={() => setExpanded(true)}
              onCollapse={() => setExpanded(false)}
            />
          </div>
        ))}
      </div>

      {/* ── Nav arrows (right edge) ── */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30 pointer-events-none opacity-0">
        {/* hidden; kept for keyboard nav via useEffect if desired */}
      </div>

      {/* ── Dot nav ── */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => slideRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="rounded-full transition-all duration-200"
            style={{
              width: activeIndex === i ? 6 : 4,
              height: activeIndex === i ? 24 : 8,
              background: activeIndex === i ? "#378ADD" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* ── Keyboard nav indicator ── */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-1.5 z-30">
        <button
          onClick={() => navigate(-1)}
          disabled={activeIndex === 0}
          className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white disabled:opacity-20 hover:bg-black/60 transition-colors"
        >
          <ChevronUp size={18} />
        </button>
        <button
          onClick={() => navigate(1)}
          disabled={activeIndex === items.length - 1}
          className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white disabled:opacity-20 hover:bg-black/60 transition-colors"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {/* ── Close expanded ── */}
      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="absolute top-4 left-4 z-50 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}