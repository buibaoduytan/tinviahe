import { useState, useEffect, useRef, type JSX } from 'react';
import type { Cat, Room, Planet, Selected } from '../types/Flash';
import { ROOMS } from '../data_tsx/room_services';
import { PLANETS_DATA } from '../data_tsx/planet_services';
import CatStatRadar from '../ui/SpiderChart';
import ShowCatList from '../ui/ShowCatList'

type Point = { x: number; y: number };
type Phase = 'working' | 'moving';

const BASE_ACTIVITY_MS = 20000;
const BASE_MOVE_PERCENT_PER_SEC = 10;
const WANDER_PAUSE_MS = 300;
const SPEEDS = [1, 2, 4, 8];
const FACING_FLIP_THRESHOLD = 2;
const FACING_FLIP_COOLDOWN_MS = 400;

function pickNextRoomIndex(currentIndex: number) {
  let next = Math.floor(Math.random() * ROOMS.length);
  while (next === currentIndex && ROOMS.length > 1) {
    next = Math.floor(Math.random() * ROOMS.length);
  }
  return next;
}

function roomBounds(room: Room) {
  const padX = Math.min(room.w * 0.2, 4);
  const padYTop = Math.min(room.h * 0.15, 4);
  const padYBottom = Math.min(room.h * 0.15, 4);
  return {
    minX: room.x + padX,
    maxX: room.x + room.w - padX,
    minY: room.y + padYTop,
    maxY: room.y + room.h - padYBottom,
  };
}

function randomPointInRoom(room: Room): Point {
  const b = roomBounds(room);
  return {
    x: b.minX + Math.random() * Math.max(1, b.maxX - b.minX),
    y: b.minY + Math.random() * Math.max(1, b.maxY - b.minY),
  };
}

function randomPointOnMap(): Point {
  return { x: 8 + Math.random() * 84, y: 8 + Math.random() * 84 };
}

/* =========================================================================
   Đồng hồ mô phỏng — bắt đầu từ 00:00:00, chạy độc lập, tốc độ x1/x2/x4/x8
   ========================================================================= */
function useSimulatedClock(speed: number) {
  const [simMs, setSimMs] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    const tick = (timestamp: number) => {
      if (lastRef.current == null) lastRef.current = timestamp;
      const delta = timestamp - lastRef.current;
      lastRef.current = timestamp;
      setSimMs((prev) => (prev + delta * speedRef.current) % 86400000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const totalSeconds = Math.floor(simMs / 1000);
  const hh = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');
  return `${hh}:${ss}`;
}

function CatWalker({
  cat,
  initialRoomIndex,
  speed,
  onSelect,
}: {
  cat: Cat;
  initialRoomIndex: number;
  speed: number;
  onSelect: (cat: Cat, room: Room) => void;
}) {
  const initialRoom = ROOMS[initialRoomIndex];
  const [pos, setPos] = useState<Point>(() => randomPointInRoom(initialRoom));
  const [facingLeft, setFacingLeft] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>('working');
  const [displayRoomIndex, setDisplayRoomIndex] = useState(initialRoomIndex);
  const lastFlipAtRef = useRef(0);

  const speedRef = useRef(speed);
  speedRef.current = speed;
  const posRef = useRef(pos);
  posRef.current = pos;
  const phaseRef = useRef<Phase>('working');
  const progressRef = useRef(0);
  const roomIndexRef = useRef(initialRoomIndex);
  const targetRef = useRef<Point>(randomPointInRoom(initialRoom));
  const queueRef = useRef<Point[]>([]);
  const pauseUntilRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  const maybeUpdateFacing = (dx: number, now: number) => {
    if (Math.abs(dx) <= FACING_FLIP_THRESHOLD) return;
    if (now - lastFlipAtRef.current < FACING_FLIP_COOLDOWN_MS) return;

    const shouldFaceLeft = dx < 0;
    setFacingLeft((prev) => {
      if (prev === shouldFaceLeft) return prev;
      lastFlipAtRef.current = now;
      return shouldFaceLeft;
    });
  };

  useEffect(() => {
    const tick = (timestamp: number) => {
      if (lastRef.current == null) lastRef.current = timestamp;
      const delta = timestamp - lastRef.current;
      lastRef.current = timestamp;
      const sp = speedRef.current;

      if (phaseRef.current === 'working') {
        const duration = BASE_ACTIVITY_MS / sp;
        progressRef.current += (delta / duration) * 100;
        if (progressRef.current >= 100) {
          progressRef.current = 0;
          const nextRoomIndex = pickNextRoomIndex(roomIndexRef.current);
          queueRef.current = [randomPointOnMap(), randomPointOnMap(), randomPointInRoom(ROOMS[nextRoomIndex])];
          roomIndexRef.current = nextRoomIndex;
          phaseRef.current = 'moving';
          setPhase('moving');
          targetRef.current = queueRef.current.shift()!;
        }
        setProgress(progressRef.current);
      }

      if (timestamp >= pauseUntilRef.current) {
        const cur = posRef.current;
        const tgt = targetRef.current;
        const dx = tgt.x - cur.x;
        const dy = tgt.y - cur.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const step = (BASE_MOVE_PERCENT_PER_SEC * sp * delta) / 1000;

        if (dist <= step || dist < 0.6) {
          posRef.current = tgt;
          setPos({ ...tgt });
          setIsWalking(false);

          if (phaseRef.current === 'moving') {
            if (queueRef.current.length > 0) {
              const nextTarget = queueRef.current.shift()!;
              if (Math.abs(nextTarget.x - tgt.x) > 1) maybeUpdateFacing(nextTarget.x - tgt.x, timestamp);

              targetRef.current = nextTarget;
            } else {
              phaseRef.current = 'working';
              setPhase('working');
              setDisplayRoomIndex(roomIndexRef.current);
              targetRef.current = randomPointInRoom(ROOMS[roomIndexRef.current]);
              pauseUntilRef.current = timestamp + WANDER_PAUSE_MS;
            }
          } else {
            const nextTarget = randomPointInRoom(ROOMS[roomIndexRef.current]);
            if (Math.abs(nextTarget.x - tgt.x) > 1) maybeUpdateFacing(nextTarget.x - tgt.x, timestamp);

            targetRef.current = nextTarget;
            pauseUntilRef.current = timestamp + WANDER_PAUSE_MS + Math.random() * 500;
          }
        } else {
          const nx = cur.x + (dx / dist) * step;
          const ny = cur.y + (dy / dist) * step;
          posRef.current = { x: nx, y: ny };
          setPos({ x: nx, y: ny });
          setIsWalking(true);
          if (Math.abs(dx) > FACING_FLIP_THRESHOLD) maybeUpdateFacing(dx, timestamp);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const room = ROOMS[displayRoomIndex];

  return (
    <div
      onClick={() => onSelect(cat, room)}
      className="absolute cursor-pointer group z-20 transition-transform active:scale-95 hover:z-30"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <div
        className={`relative flex flex-col items-center ${isWalking ? 'animate-bounce' : ''}`}
        style={{ transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)' }}
      >
        <span
          className="mb-1 px-2 py-0.5 rounded-full bg-slate-950/85 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold whitespace-nowrap shadow-md backdrop-blur-xs"
          style={{ transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)' }}
        >
          {cat.name}
        </span>
        <img
          src={cat.image}
          alt={cat.name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shadow-lg group-hover:scale-110 group-hover:border-amber-300 transition-all duration-200"
        />
        <div className="w-6 h-1.5 bg-black/50 rounded-full mt-0.5 blur-[1px]" />
      </div>

      {phase === 'working' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-slate-900 border border-slate-700 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-linear-to-r from-cyan-500 to-blue-500" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function CatDetailModal({
  cat,
  onBack,
}: {
  cat: Cat;
  onBack: () => void;
}) {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="animate-fade-in fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 gap-6 flex-wrap">
      <div className="relative w-full max-w-sm bg-slate-900 border border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/50">
        <div className="relative">
          <img src={cat.image} alt={cat.name} className="w-full h-80 object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
        </div>
        <div className="p-5 space-y-3 relative -mt-6">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-2xl font-black text-white tracking-tight">{cat.name}</h3>
            <button
              onClick={() => setShowStats((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-bold hover:bg-cyan-500 hover:text-slate-950 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              {showStats ? 'Ẩn chỉ số' : 'Xem chỉ số'}
            </button>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 backdrop-blur-sm italic">
            "{cat.meme}"
          </p>
        </div>
        <div className="p-4 bg-slate-950/80 border-t border-slate-800">
          <button
            onClick={onBack}
            className="w-full py-3 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 text-cyan-300 rounded-xl font-extrabold text-sm active:scale-95 transition-all cursor-pointer"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {showStats && (
        <div className="animate-fade-in bg-slate-900/90 border border-cyan-500/40 rounded-2xl shadow-2xl p-4 backdrop-blur-md">
          <CatStatRadar cat={cat} />
        </div>
      )}
    </div>
  );
}


/* =========================================================================
   Bản đồ hành tinh — khung MAP LUÔN LÀ HÌNH VUÔNG (aspect-square) để khớp
   đúng tỉ lệ 100x100 của file house-map.svg, không bị kéo méo.
   ========================================================================= */
function PlanetGround({ planet, onBack }: { planet: Planet; onBack: () => void }) {
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState<Selected | null>(null);
  const clock = useSimulatedClock(speed);

  const initialRooms = useRef(planet.cats.map((_, i) => i % ROOMS.length)).current;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md flex-wrap z-30">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
        >
          ← Quay lại
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide">{planet.name}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-mono text-cyan-300 text-xs sm:text-sm bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shadow-inner">
            {clock}
          </div>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                  speed === s ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                x{s}
              </button>
            ))}
          </div>
          <ShowCatList planet={planet} />
        </div>
      </div>

      {/* Khung chứa bản đồ: căn giữa, cho phép co theo cả chiều rộng lẫn chiều cao */}
      <div className="relative flex-1 flex items-center justify-center p-3 sm:p-6 overflow-hidden bg-slate-950">
        <div
          className={`relative aspect-square h-full max-h-full max-w-full w-auto mx-auto rounded-2xl overflow-hidden border-4 ${planet.borderColor} shadow-2xl shadow-cyan-950/50`}
          style={{
            backgroundImage: `url(${planet.mapBg})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {ROOMS.map((room) => (
            <div
              key={room.activityId}
              className="absolute p-1.5 pointer-events-none"
              style={{ left: `${room.x}%`, top: `${room.y}%` }}
            />
          ))}

          {planet.cats.map((cat, i) => (
            <CatWalker
              key={cat.id}
              cat={cat}
              initialRoomIndex={initialRooms[i]}
              speed={speed}
              onSelect={(c, room) => setSelected({ cat: c, room })}
            />
          ))}
        </div>
      </div>
      {selected && <CatDetailModal cat={selected.cat} onBack={() => setSelected(null)} />}
    </div>
  );
}

export default function App(): JSX.Element {
  const [activePlanetId, setActivePlanetId] = useState<string | null>(null);
  const activePlanet = PLANETS_DATA.find((p) => p.id === activePlanetId) || null;
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-900">
      {/* Background glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-b from-cyan-500/10 via-purple-500/5 to-transparent pointer-events-none blur-3xl" />

      <header className="pt-12 pb-8 text-center px-4 border-b border-slate-800/80 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/30 text-xs font-bold text-amber-300 shadow-lg mb-4 backdrop-blur-md">
          ✨ VŨ TRỤ MEME FLASHCARDS ✨
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-amber-200 via-orange-300 to-pink-400">
          Hành Tinh Cột Sống
        </h1>
        <p className="mt-3 text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Khám phá và tương tác với cuộc sống sinh hoạt hằng ngày của các nhân vật Flashcard độc đáo trên các hành tinh.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {PLANETS_DATA.map((planet) => {
          // Calculate total squad price
          const totalPrice =
            planet.total_price ??
            planet.cats.reduce((acc: number, c: any) => acc + (c.value || 0), 0);

          // Get top 4 member avatars
          const memberAvatars = planet.cats.slice(0, 4);
          const extraCatsCount = Math.max(0, planet.cats.length - 4);

          return (
            <button
              key={planet.id}
              onClick={() => setActivePlanetId(planet.id)}
              className="text-left group bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1.5 backdrop-blur-md flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Thumbnail với overlay */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-slate-800 group-hover:border-cyan-500/40 transition-colors">
                  <img
                    src={planet.thumb}
                    alt={planet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Badge số lượng thành viên */}
                  <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-xs text-cyan-300 border border-cyan-500/30 text-[11px] font-bold px-2 py-0.5 rounded-md">
                    {planet.cats.length} Thành Viên
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  {planet.name}
                </h2>
                <p className="text-amber-300/80 text-xs font-medium mt-1 mb-3">
                  {planet.subtitle}
                </p>

                {/* Avatar Thành Viên & Giá Trị Đội Hình */}
                <div className="py-3 border-y border-slate-800/80 my-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Thành viên:</span>
                    <div className="flex items-center -space-x-2 overflow-hidden">
                      {memberAvatars.map((cat: any) => (
                        <img
                          key={cat.id}
                          src={cat.image}
                          alt={cat.name}
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
                          title={cat.name}
                        />
                      ))}
                      {extraCatsCount > 0 && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-cyan-300 ring-2 ring-slate-900">
                          +{extraCatsCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Giá trị đội hình:</span>
                    <span className="text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 group-hover:text-cyan-400 transition-colors">
                  Khám phá căn nhà →
                </span>
                <span className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950 text-xs font-bold transition-all">
                  Vào nhà
                </span>
              </div>
            </button>
          );
        })}
      </main>

      {activePlanet && <PlanetGround planet={activePlanet} onBack={() => setActivePlanetId(null)} />}
    </div>
  );
}
