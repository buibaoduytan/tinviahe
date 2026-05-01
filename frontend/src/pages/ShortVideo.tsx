import React from "react";
import { StepForward, VolumeX, Volume2, Link2, X, ChevronUp, ChevronDown, Heart, MessageCircle, Share2, Bookmark, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

// ============================================
// TYPES & INTERFACES
// ============================================

interface VideoItem {
  id: number;
  date: string;
  tag: string;
  imgUrl: string;
  quote: string;
  source: string;
  description: string;
  progress: number;
  videoUrl: string;
  duration: number;
  author: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  likedByUser: boolean;
  savedByUser: boolean;
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  likedByUser: boolean;
}

// ============================================
// MOCK DATA
// ============================================

const mockVideos: VideoItem[] = [
  {
    id: 0,
    date: "April 1, 2026",
    tag: "President",
    imgUrl: "https://static01.nyt.com/images/2026/04/05/multimedia/05hp-ncaa-pjgk/05hp-ncaa-pjgk-threeByTwoMediumAt2X.jpg?format=pjpg&quality=75&auto=webp&disable=upscale",
    quote: '"... build up some delayed courage."',
    source: "C-SPAN",
    description: "White House reporter Zolan Kanno-Youngs parses some of President's conflicting statements on the economy and trade policy.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4",
    progress: 35,
    duration: 180,
    author: "Zolan Kanno-Youngs",
    views: 12500,
    likes: 2340,
    comments: 456,
    shares: 120,
    likedByUser: false,
    savedByUser: false,
  },
  {
    id: 1,
    date: "April 2, 2026",
    tag: "Business",
    imgUrl: "https://via.placeholder.com/600x400?text=Business+News",
    quote: '"Market reaches new heights..."',
    source: "Reuters",
    description: "Tech stocks surge as new AI breakthroughs announced.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4",
    progress: 50,
    duration: 240,
    author: "Business Team",
    views: 8900,
    likes: 1200,
    comments: 234,
    shares: 89,
    likedByUser: false,
    savedByUser: false,
  },
];

const mockComments: Comment[] = [
  {
    id: 1,
    author: "John Doe",
    avatar: "https://i.pravatar.cc/40?img=1",
    text: "Great analysis! This really helps explain the situation.",
    timestamp: "2 hours ago",
    likes: 45,
    likedByUser: false,
  },
  {
    id: 2,
    author: "Jane Smith",
    avatar: "https://i.pravatar.cc/40?img=2",
    text: "I completely agree with this perspective.",
    timestamp: "1 hour ago",
    likes: 23,
    likedByUser: false,
  },
  {
    id: 3,
    author: "Mike Johnson",
    avatar: "https://i.pravatar.cc/40?img=3",
    text: "Can you elaborate more on the second point?",
    timestamp: "45 minutes ago",
    likes: 12,
    likedByUser: false,
  },
];

// ============================================
// SUB-COMPONENTS
// ============================================

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
  onLike: (liked: boolean) => void;
  onSave: (saved: boolean) => void;
  onShare: () => void;
}

function VideoCard({ video, isActive, onClick, onLike, onSave, onShare }: VideoCardProps) {
  const [muted, setMuted] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  }

  return (
    <div
      onClick={onClick}
      className={`flex flex-col border-b border-[#0c2d4a] cursor-pointer transition-colors duration-150 ${
        isActive ? "bg-[#061824]" : "bg-transparent hover:bg-[#060f1a]"
      }`}
    >
      {/* Video Player */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#061824]">
        {isActive ? (
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-cover"
            muted={muted}
            controls
          />
        ) : (
          <img
            src={video.imgUrl}
            alt={video.quote}
            className="w-full h-full object-cover"
          />
        )}

        {/* Play overlay */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayButton />
          </div>
        )}

        {/* Date badge */}
        <span className="absolute top-3 left-3 text-white text-[12px] font-medium bg-black/55 px-2.5 py-0.5 rounded-md select-none">
          {video.date}
        </span>

        {/* Duration badge */}
        <span className="absolute top-3 right-3 text-white text-[12px] font-medium bg-black/55 px-2.5 py-0.5 rounded-md select-none">
          {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, "0")}
        </span>

        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPage("/");
          }}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 border border-[#1e4d72] flex items-center justify-center text-[#7dd3fc] hover:bg-[#0c2d4a] transition-colors"
        >
          <X size={14} />
        </button>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-[#378ADD] transition-all duration-300"
          style={{ width: `${video.progress}%` }}
        />
      </div>

      {/* Video Info */}
      <div className="px-5 pt-4 pb-6 bg-[#040e1a] space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-[#378ADD] tracking-widest uppercase mb-2">
              {video.tag}
            </p>
            <p className="text-xl text-[#c8e4f8] leading-snug font-serif mb-2">
              {video.quote}
            </p>
            <p className="text-xs text-[#3b6d9a]">{video.source}</p>
          </div>
          <button className="text-[#7dd3fc] hover:text-[#c8e4f8] transition">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#4a7fa8] leading-relaxed">
          {video.description}
        </p>

        {/* Author & Stats */}
        <div className="flex items-center justify-between text-xs text-[#3b6d9a] border-t border-[#0c2d4a] pt-3">
          <span>{video.author}</span>
          <span>{formatNumber(video.views)} views</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6 justify-between">
          {/* Like */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(!video.likedByUser);
            }}
            className="flex items-center gap-2 text-[#7dd3fc] hover:text-[#c8e4f8] transition"
            title="Like"
          >
            <Heart size={16} fill={video.likedByUser ? "currentColor" : "none"} />
            <span className="text-xs">{formatNumber(video.likes)}</span>
          </button>

          {/* Comments */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
            className="flex items-center gap-2 text-[#7dd3fc] hover:text-[#c8e4f8] transition"
            title="Comments"
          >
            <MessageCircle size={16} />
            <span className="text-xs">{formatNumber(video.comments)}</span>
          </button>

          {/* Share */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className="flex items-center gap-2 text-[#7dd3fc] hover:text-[#c8e4f8] transition"
            title="Share"
          >
            <Share2 size={16} />
            <span className="text-xs">{formatNumber(video.shares)}</span>
          </button>

          {/* Save */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(!video.savedByUser);
            }}
            className="flex items-center gap-2 text-[#7dd3fc] hover:text-[#c8e4f8] transition"
            title="Save"
          >
            <Bookmark size={16} fill={video.savedByUser ? "currentColor" : "none"} />
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            title={copied ? "Đã sao chép!" : "Sao chép liên kết"}
            className={`flex items-center gap-2 transition ${
              copied ? "text-green-400" : "text-[#7dd3fc] hover:text-[#c8e4f8]"
            }`}
          >
            <Link2 size={16} />
          </button>

          {/* Mute */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMuted(!muted);
            }}
            className={`flex items-center gap-2 transition ${
              muted ? "opacity-50 text-[#7dd3fc]" : "opacity-100 text-[#7dd3fc]"
            }`}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-[#0c2d4a] pt-4 space-y-3 max-h-48 overflow-y-auto">
            {mockComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-8 h-8 rounded-full shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-[#c8e4f8]">
                      {comment.author}
                    </p>
                    <p className="text-xs text-[#3b6d9a]">{comment.timestamp}</p>
                  </div>
                  <p className="text-xs text-[#4a7fa8] mt-1 leading-relaxed">
                    {comment.text}
                  </p>
                  <button className="text-xs text-[#3b6d9a] hover:text-[#7dd3fc] mt-1">
                    ❤️ {comment.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// MAIN COMPONENT

export default function VideoScrollPage(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videos, setVideos] = useState<VideoItem[]>(mockVideos);
  const [loading] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch videos on mount
  useEffect(() => {
    // setLoading(true);
    // fetch('/api/videos')
    //   .then(res => res.json())
    //   .then(data => {
    //     setVideos(data.videos);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error('Error fetching videos:', err);
    //     setLoading(false);
    //   });
  }, []);

  function navigate(dir: -1 | 1) {
    const next = activeIndex + dir;
    if (next < 0 || next >= videos.length) return;
    setActiveIndex(next);
    cardRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function handleLike(videoId: number, liked: boolean) {
    setVideos(videos.map(v => 
      v.id === videoId 
        ? { ...v, likedByUser: liked, likes: liked ? v.likes + 1 : v.likes - 1 }
        : v
    ));
  }

  function handleSave(videoId: number, saved: boolean) {
    setVideos(videos.map(v => 
      v.id === videoId 
        ? { ...v, savedByUser: saved }
        : v
    ));
  }

  function handleShare(video: VideoItem) {
    const shareUrl = `${window.location.origin}/video/${video.id}`;
    if (navigator.share) {
      navigator.share({
        title: video.quote,
        text: video.description,
        url: shareUrl,
      }).catch(err => console.error('Share failed:', err));
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  }

  if (loading) {
    return (
      <div className="bg-[#03111f] min-h-screen flex items-center justify-center">
        <p className="text-[#7dd3fc]">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#03111f] min-h-screen flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-[#03111f] border-b border-[#0c2d4a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#378ADD] flex items-center justify-center text-white font-bold text-sm">
            ▶
          </div>
          <span className="text-[#7dd3fc] text-lg font-medium tracking-wide">TinVideos</span>
        </div>
        <div className="text-[#3b6d9a] text-sm">
          {activeIndex + 1} / {videos.length}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex w-full max-w-4xl">
        {/* Video List */}
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
                onLike={(liked) => handleLike(video.id, liked)}
                onSave={(saved) => handleSave(video.id, saved)}
                onShare={() => handleShare(video)}
              />
            </div>
          ))}
        </div>

        {/* Navigation Sidebar */}
        <div className="flex flex-col items-center gap-3 px-4 py-6 bg-[#03111f] border-l border-[#0c2d4a]">
          {/* Up Button */}
          <button
            onClick={() => navigate(-1)}
            disabled={activeIndex === 0}
            className={`w-10 h-10 rounded-full bg-[#060f1a] border border-[#1e4d72] flex items-center justify-center transition-all ${
              activeIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : "cursor-pointer hover:bg-[#0c2d4a]"
            }`}
            title="Previous video"
          >
            <ChevronUp size={18} className="text-[#7dd3fc]" />
          </button>

          {/* Dot Indicators */}
          <div className="flex flex-col gap-2 py-2">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveIndex(i);
                  cardRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }}
                className={`w-2 h-2 rounded-full p-0 border-0 cursor-pointer transition-colors duration-200 ${
                  activeIndex === i ? "bg-[#378ADD] w-2.5 h-2.5" : "bg-[#1e4d72]"
                }`}
                title={`Video ${i + 1}`}
              />
            ))}
          </div>

          {/* Down Button */}
          <button
            onClick={() => navigate(1)}
            disabled={activeIndex === videos.length - 1}
            className={`w-10 h-10 rounded-full bg-[#060f1a] border border-[#1e4d72] flex items-center justify-center transition-all ${
              activeIndex === videos.length - 1
                ? "opacity-30 cursor-not-allowed"
                : "cursor-pointer hover:bg-[#0c2d4a]"
            }`}
            title="Next video"
          >
            <ChevronDown size={18} className="text-[#7dd3fc]" />
          </button>
        </div>
      </div>
    </div>
  );
}