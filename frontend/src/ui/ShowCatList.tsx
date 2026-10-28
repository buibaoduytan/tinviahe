import { useState, useRef, useEffect, type JSX } from "react";
import { createPortal } from "react-dom";
import type { Planet } from "../types/Flash"
// Bạn tự thêm href ảnh vào đây
const MEMORY_IMAGES: string[] = [
  "/assets/photos/memories/dinh-1.jpg",
  "/assets/photos/memories/dinh-2.jpg",
  "/assets/photos/memories/dinh-3.jpg",
  "/assets/photos/memories/dinh-4.jpg",

  "/assets/photos/memories/gang1.jpg",
  "/assets/photos/memories/gang2.jpg",

  "/assets/photos/memories/tapthe.jpg",
  "/assets/photos/memories/tapthe2.jpg",
  
  "/assets/photos/memories/aura.jpg",

];

// Bạn tự thêm đường dẫn bài hát vào đây
const MEMORY_SONGS: string[] = [
  "/assets/photos/music/Vạn Vật Thay Đổi Vật Chất Lên Ngôi Remix Ver 🎵 Nguyễn Đình Vũ Em Muốn Đi Xe Hơi.mp3",
  "/assets/photos/music/Thế Là Anh Bỏ Lỡ Chuyến Xe Cuộc Đời Remix Chuyến Xe Cuộc Đời Thanh Hưng x Domino Remix.mp3",
  "/assets/photos/music/Xin Đừng Rời Xa Anh VietMino Remix Xin Đừng Rời Xa Anh Đừng Để Lệ Hoen Mi Anh Remix Siêu Cuốn.mp3"
];

export default function ShowCatList({ planet }: { planet: Planet }): JSX.Element {
  const [showCats, setShowCats] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalPrice =
    planet.total_price ??
    planet.cats.reduce((acc: number, c: any) => acc + (c.value || 0), 0);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const openImage = (src: string) => {
    stopAudio();
    setActiveImage(src);
    if (MEMORY_SONGS.length > 0) {
      const song = MEMORY_SONGS[Math.floor(Math.random() * MEMORY_SONGS.length)];
      const audio = new Audio(song);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
  };

  const closeImage = () => {
    stopAudio();
    setActiveImage(null);
  };

  const toggleDropdown = () => {
    setShowCats((v) => !v);
    setShowMemories(false);
  };

  // Dừng nhạc khi component bị huỷ
  useEffect(() => stopAudio, []);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="px-3 py-1.5 bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/60 text-cyan-400 font-bold text-xs rounded-lg transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
      >
        <span>Thành viên ({planet.cats.length})</span>
      </button>

      {showCats && (
        
        <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-slate-900/95 border border-cyan-500/50 rounded-2xl shadow-2xl z-50 backdrop-blur-md divide-y divide-slate-800">
          <div className="p-3 bg-slate-950/80 sticky top-0 border-b border-slate-800 flex justify-between items-center z-10 gap-2">
            {showMemories ? (
              <button
                onClick={() => setShowMemories(false)}
                className="font-bold text-xs text-slate-300 hover:text-cyan-300 cursor-pointer"
              >
                ← Danh sách Flashcard
              </button>
            ) : (
              <span className="font-bold text-xs text-slate-300">Danh sách Flashcard</span>
            )}

            <div className="flex items-center gap-2">
              {!showMemories && (
                <button
                  onClick={() => setShowMemories(true)}
                  className="text-[10px] font-bold bg-pink-500/20 text-pink-300 hover:bg-pink-500/40 px-2 py-0.5 rounded-full border border-pink-500/30 cursor-pointer transition-colors"
                >
                  Ảnh kỷ niệm
                </button>
              )}
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                {showMemories ? MEMORY_IMAGES.length : planet.cats.length}
              </span>
            </div>
          </div>

          {showMemories ? (
            <div className="p-2 grid grid-cols-3 gap-2">
              {MEMORY_IMAGES.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Kỷ niệm ${i + 1}`}
                  onClick={() => openImage(src)}
                  className="w-full aspect-square object-cover rounded-lg border border-slate-800 hover:border-pink-400/60 cursor-pointer transition-all hover:scale-105"
                />
              ))}
            </div>
          ) : (
            <>
              <ul className="p-2 space-y-2">
                {planet.cats.map((cat: any) => (
                  <li
                    key={cat.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-cyan-500/40 transition-colors"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-10 h-10 rounded-lg object-cover border border-cyan-500/40 shrink-0"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-bold text-sm text-white truncate">{cat.name}</span>
                      <span className="text-[11px] text-slate-400 italic truncate">{cat.meme}</span>
                    </div>
                    <span className="font-bold text-amber-400 text-xs whitespace-nowrap bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                      ${(cat.value ?? 0).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="p-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between sticky bottom-0">
                <span className="font-bold text-slate-300 text-xs">Tổng giá trị đội hình</span>
                <span className="font-black text-amber-400 text-sm bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {activeImage &&
        createPortal(
          <div
            className="fixed inset-0 z-100 bg-black/85 flex items-center justify-center p-4"
            onClick={closeImage}
          >
            <button
              onClick={closeImage}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-pink-500 cursor-pointer"
            >
              ✕
            </button>
            <img
              src={activeImage}
              alt="Ảnh kỷ niệm"
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            />
          </div>,
          document.body
        )}
    </div>
  );
}