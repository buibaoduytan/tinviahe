import { StepForward, VolumeX, Volume2, Link2, X, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface VideoItem {
  id: number;
  date: string;
  tag: string;
  imgUrl: string;
  quote: string;
  source: string;
  description: string;
  progress: number;
}

const videos: VideoItem[] = [
  {
    id: 0,
    date: "April 1, 2026",
    tag: "President",
    imgUrl:
      "https://static01.nyt.com/images/2026/04/05/multimedia/05hp-ncaa-pjgk/05hp-ncaa-pjgk-threeByTwoMediumAt2X.jpg?format=pjpg&quality=75&auto=webp&disable=upscale",
    quote: '"... build up some delayed courage."',
    source: "C-SPAN",
    description:
      "White House reporter Zolan Kanno-Youngs parses some of President's conflicting statements on the economy and trade policy.",
    progress: 35,
  },
];

// ─── Sub-components ───────────────────────────────────────────────

function PlayButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center transition-all duration-200 ${
        hovered ? "opacity-100 scale-110" : "opacity-70 scale-100"
      }`}
    >
      <StepForward size={20} className="text-white" />
    </div>
  );
}

interface VideoCardProps {
  video: VideoItem;
  isActive: boolean;
  onClick: () => void;
}

function VideoCard({ video, isActive, onClick }: VideoCardProps) {
  const [muted, setMuted] = useState(true);
  const [copied, setCopied] = useState(false);
  const goToPage = useNavigate();

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard
      .writeText(`${window.location.origin}/video/${video.id}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }

  return (
    <div
      onClick={onClick}
      className={`flex flex-col border-b border-[#0c2d4a] cursor-pointer transition-colors duration-150 ${
        isActive ? "bg-[#061824]" : "bg-transparent hover:bg-[#060f1a]"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#061824]">
        <img
          src={video.imgUrl}
          alt={video.quote}
          className="w-full h-full object-cover"
        />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayButton />
        </div>

        {/* Date badge */}
        <span className="absolute top-3 left-3 text-white text-[12px] font-medium bg-black/55 px-2.5 py-0.5 rounded-md select-none">
          {video.date}
        </span>

        {/* Top-right: close */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPage("/");
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 border border-[#1e4d72] flex items-center justify-center text-[#7dd3fc] hover:bg-[#0c2d4a] transition-colors"
        >
          <X size={14} />
        </button>

        {/* Bottom-right controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {/* Copy link */}
          <button
            onClick={handleCopy}
            title={copied ? "Đã sao chép!" : "Sao chép liên kết"}
            className={`w-8 h-8 rounded-full bg-black/60 border border-[#1e4d72] flex items-center justify-center transition-all hover:bg-[#0c2d4a] ${
              copied ? "text-green-400 border-green-500/50" : "text-[#7dd3fc]"
            }`}
          >
            <Link2 size={14} />
          </button>

          {/* Mute toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMuted((p) => !p);
            }}
            className={`w-8 h-8 rounded-full bg-black/60 border border-[#1e4d72] flex items-center justify-center transition-all hover:bg-[#0c2d4a] ${
              muted ? "opacity-50 text-[#7dd3fc]" : "opacity-100 text-[#7dd3fc]"
            }`}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-[#378ADD] transition-all duration-300"
          style={{ width: `${video.progress}%` }}
        />
      </div>

      {/* Card info */}
      <div className="px-5 pt-4 pb-5 bg-[#040e1a]">
        <p className="text-[11px] font-semibold text-[#378ADD] tracking-widest uppercase mb-2">
          {video.tag}
        </p>
        <p className="text-xl text-[#c8e4f8] leading-snug font-serif mb-3">
          {video.quote}
        </p>
        <p className="text-xs text-[#3b6d9a] mb-2">{video.source}</p>
        <p className="text-[13px] text-[#4a7fa8] leading-relaxed">
          {video.description}
        </p>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────

export default function VideoScrollPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  function navigate(dir: -1 | 1) {
    const next = activeIndex + dir;
    if (next < 0 || next >= videos.length) return;
    setActiveIndex(next);
    cardRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <div className="bg-[#03111f] min-h-screen flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full flex items-center px-6 py-3.5 bg-[#03111f] border-b border-[#0c2d4a]">
        <span className="text-[#7dd3fc] text-lg font-medium tracking-wide">
          TinVideos
        </span>
      </header>

      {/* Content */}
      <div className="flex w-full max-w-3xl">
        {/* Cards */}
        <div className="flex-1 min-w-0">
          {videos.map((video, i) => (
            <div
              key={video.id}
              ref={(el) => { cardRefs.current[i] = el; }}
            >
              <VideoCard
                video={video}
                isActive={activeIndex === i}
                onClick={() => setActiveIndex(i)}
              />
            </div>
          ))}
        </div>

        {/* Nav sidebar */}
        <div className="flex flex-col items-center gap-2 px-2.5 py-4 bg-[#03111f]">
          <button
            onClick={() => navigate(-1)}
            disabled={activeIndex === 0}
            className={`w-9 h-9 rounded-full bg-[#060f1a] border border-[#1e4d72] flex items-center justify-center transition-all ${
              activeIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : "cursor-pointer hover:bg-[#0c2d4a]"
            }`}
          >
            <ChevronUp size={18} className="text-[#7dd3fc]" />
          </button>

          {/* Dot indicators */}
          <div className="flex flex-col gap-1.5 py-1">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-1.5 h-1.5 rounded-full p-0 border-0 cursor-pointer transition-colors duration-200 ${
                  activeIndex === i ? "bg-[#378ADD]" : "bg-[#1e4d72]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => navigate(1)}
            disabled={activeIndex === videos.length - 1}
            className={`w-9 h-9 rounded-full bg-[#060f1a] border border-[#1e4d72] flex items-center justify-center transition-all ${
              activeIndex === videos.length - 1
                ? "opacity-30 cursor-not-allowed"
                : "cursor-pointer hover:bg-[#0c2d4a]"
            }`}
          >
            <ChevronDown size={18} className="text-[#7dd3fc]" />
          </button>
        </div>
      </div>
    </div>
  );
}