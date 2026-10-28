import React, { useState, useEffect, useRef } from "react";
import {
  Github,
  Atom,
  Code2,
  Zap,
  Sparkles,
  Wind,
  ArrowRight,
  Play,
  Layers,
  Globe,
  Cpu,
  TrendingUp,
  Radio,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Terminal,
  Users,
  ExternalLink,
  ChevronDown,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "tong-quan", label: "Tổng quan" },
  { id: "he-sinh-thai", label: "Hệ sinh thái" },
  { id: "triet-ly", label: "Triết lý & Công nghệ" },
  { id: "loi-trinh", label: "Định hướng & Lộ trình" },
  { id: "tin-moi-nhat", label: "Tin nổi bật" },
  { id: "lich-su", label: "Lịch sử & Dự án" },
] as const;

interface VersionNode {
  version: string;
  date: string;
  badge?: string;
  changes: string[];
}

const versionHistory: VersionNode[] = [
  {
    version: "12.0.0-Beta",
    date: "25/09/2026",
    badge: "Mới nhất",
    changes: ["Tích hợp AI Tóm tắt tin tức tự động", "Giao diện Hệ sinh thái đa nền tảng", "Tối ưu hóa Video Player đa định dạng"],
  },
  {
    version: "11.2.3",
    date: "20/09/2026",
    changes: ["Sửa lỗi hiển thị responsive di động", "Tối ưu hóa tốc độ tải trang dưới 0.8s"],
  },
  {
    version: "11.2.0",
    date: "05/09/2026",
    changes: ["Thêm chế độ tối Dark Glassmorphism", "Cải thiện độ chính xác công cụ tìm kiếm tin tức"],
  },
  {
    version: "11.1.0",
    date: "18/08/2026",
    changes: ["Hệ thống thông báo đẩy (Push notification)", "Nâng cấp bảo mật định danh người dùng"],
  },
];

interface Platform {
  name: string;
  role: string;
  icon: React.ReactNode;
  iconClass: string;
}

const platforms: Platform[] = [
  { name: "React 19", role: "UI Framework", icon: <Atom className="h-4 w-4" />, iconClass: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  { name: "TypeScript", role: "Type Safety", icon: <Code2 className="h-4 w-4" />, iconClass: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { name: "Vite Engine", role: "Bundler", icon: <Zap className="h-4 w-4" />, iconClass: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { name: "Framer Motion", role: "Animations", icon: <Sparkles className="h-4 w-4" />, iconClass: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20" },
  { name: "Tailwind CSS", role: "Styling", icon: <Wind className="h-4 w-4" />, iconClass: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
  { name: "Node.js / Express", role: "API Backend", icon: <Terminal className="h-4 w-4" />, iconClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
];

const ecosystemItems = [
  {
    id: "web",
    title: "TinViaHe Web Reader",
    desc: "Nền tảng đọc tin tức tốc độ cao với giao diện tối giản, tóm tắt AI thông minh và tùy chỉnh luồng tin tức cá nhân hóa.",
    icon: <Globe className="h-6 w-6 text-cyan-400" />,
    status: "Hoạt động",
    tag: "Core Platform",
    mediaType: "image",
    mediaSrc: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop",
    caption: "Giao diện đọc tin tức đa thiết bị của TinViaHe"
  },
  {
    id: "ai-summary",
    title: "TinViaHe AI Engine",
    desc: "Bộ lọc và tổng hợp tin tức thông minh, giúp chắt lọc 90% thông tin rác, đưa ra bản tóm tắt 3 câu cho từng sự kiện nóng.",
    icon: <Cpu className="h-6 w-6 text-fuchsia-400" />,
    status: "Thử nghiệm Beta",
    tag: "AI & Data",
    mediaType: "video",
    mediaSrc: "https://classin.vn/wp-content/uploads/2023/09/20230426181117835.mp4",
    caption: "Demo thuật toán AI tự động tóm tắt tin tức thời gian thực"
  },
  {
    id: "mobile",
    title: "TinViaHe Mobile App",
    desc: "Trải nghiệm tin tức mượt mà trên iOS & Android với tính năng nghe tin podcast AI, đọc ngoại tuyến và thông báo theo thời gian thực.",
    icon: <Radio className="h-6 w-6 text-emerald-400" />,
    status: "Sắp ra mắt",
    tag: "Mobile Native",
    mediaType: "image",
    mediaSrc: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
    caption: "Ứng dụng di động tối ưu hóa trải nghiệm một tay"
  },
  {
    id: "open-api",
    title: "TinViaHe Open API",
    desc: "Cung cấp cổng kết nối dữ liệu tin tức mã nguồn mở cho nhà phát triển, nhà báo độc lập và các ứng dụng bên thứ ba.",
    icon: <Layers className="h-6 w-6 text-amber-400" />,
    status: "Sẵn sàng",
    tag: "Developer Hub",
    mediaType: "image",
    mediaSrc: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    caption: "Hệ thống API RESTful và GraphQL linh hoạt"
  }
];

const roadmapSteps = [
  {
    phase: "Giai đoạn 1",
    title: "Chuẩn hóa trải nghiệm cốt lõi",
    period: "Q3/2026 - Đã hoàn thành",
    status: "completed",
    details: [
      "Xây dựng kiến trúc React + Vite + Tailwind CSS",
      "Tối ưu tốc độ tải trang dưới 1s",
      "Triển khai giao diện Dark Mode Glassmorphism",
    ]
  },
  {
    phase: "Giai đoạn 2",
    title: "Hệ sinh thái AI & Đa phương tiện",
    period: "Q4/2026 - Đang thực hiện",
    status: "in-progress",
    details: [
      "Tích hợp mô hình AI tóm tắt tin tức tự động",
      "Hỗ trợ trình phát video ngắn và tin tức bằng giọng nói (Text-to-Speech)",
      "Ra mắt cổng tra cứu sự kiện nóng theo dòng thời gian"
    ]
  },
  {
    phase: "Giai đoạn 3",
    title: "Cộng đồng & Phi tập trung tin tức",
    period: "Q1/2027 - Kế hoạch",
    status: "planned",
    details: [
      "Mở cổng kiểm chứng thông tin cộng đồng (Community Fact-check)",
      "Chương trình Nhà báo độc lập & Creator Hub",
      "Tích hợp API tin tức thời gian thực cho doanh nghiệp"
    ]
  }
];

const newsHighlights = [
  {
    id: 1,
    title: "TinViaHe ra mắt tính năng AI Tóm Tắt Tin Tức trong 30 giây",
    date: "26/09/2026",
    category: "Cập nhật sản phẩm",
    summary: "Người dùng giờ đây có thể nắm bắt diễn biến chính của toàn bộ bài báo chỉ với một cú chạm nhờ AI Engine mới.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    readTime: "3 phút đọc"
  },
  {
    id: 2,
    title: "Mở rộng hạ tầng Serverless: Tăng 200% tốc độ truyền tải nội dung",
    date: "15/09/2026",
    category: "Kỹ thuật",
    summary: "Nâng cấp hệ thống Edge Caching giúp trải nghiệm đọc tin không bị gián đoạn ngay cả khi lượng truy cập tăng vọt.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    readTime: "5 phút đọc"
  },
  {
    id: 3,
    title: "TinViaHe vượt mốc 100,000 lượt đọc hàng ngày",
    date: "01/09/2026",
    category: "Cột mốc",
    summary: "Sự tin tưởng của cộng đồng là động lực giúp chúng tôi tiếp tục duy trì nền tảng tin tức minh bạch và mã nguồn mở.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    readTime: "2 phút đọc"
  }
];

export default function AboutPage(): React.ReactElement {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(true);
  const [activeEcoTab, setActiveEcoTab] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.12 }
    );

    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -40% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (!el) return;
      revealObserver.observe(el);
      activeObserver.observe(el);
    });

    return () => {
      revealObserver.disconnect();
      activeObserver.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-[#E2E8F0] selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Decorative Background Lighting Effects */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-60" />
      <div className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 h-125800px] rounded-full bg-cyan-600/10 blur-[120px]" />
      <div className="pointer-events-none fixed top-1/3 -right-40 h-100400px] rounded-full bg-purple-600/10 blur-[140px]" />

      <div className="font-sans-custom relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        
        {}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-teal-300 to-sky-200 transition hover:opacity-90"
            >
              TinViaHe
            </a>
            <span className="rounded-full bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-400">
              v12.0 Ecosystem
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/buibaoduytan/tinviahe"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-cyan-500/30 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-white"
            >
              <Github className="h-4 w-4" />
              <span>Mã nguồn Open-Source</span>
            </a>
          </div>
        </header>

        {}
        <nav className="sticky top-4 z-40 mt-6 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2">
          <div className="glass-panel mx-auto flex items-center gap-1 overflow-x-auto rounded-2xl p-1.5 shadow-2xl scrollbar-none">
            {SECTIONS.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`relative whitespace-nowrap rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "text-cyan-950 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 rounded-xl bg-linear-to-r from-cyan-400 to-teal-300 shadow-md shadow-cyan-500/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{s.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {}
        <section
          id="tong-quan"
          ref={(el) => { sectionRefs.current["tong-quan"] = el; }}
          className={`tvh-reveal scroll-mt-28 border-b border-slate-800/80 py-12 lg:py-20 ${
            visibleSections["tong-quan"] ? "tvh-visible" : ""
          }`}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1.5 text-xs font-medium text-cyan-400">
                <Sparkles className="h-3.5 w-3.5" />
                Nền tảng tin tức thế hệ mới
              </div>

              <h1 className="font-serif-custom text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-slate-100">
                Tin tức gọn nhẹ, <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-teal-300 to-sky-400">
                  xây trên nền tảng mở
                </span>
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-slate-400 max-w-2xl">
                TinViaHe tách biệt hoàn toàn giao diện người dùng và logic xử lý dữ liệu phức tạp. 
                Chúng tôi mang tới trải nghiệm đọc tin tối giản, chính xác, loại bỏ thông tin rác nhờ sức mạnh của AI và kiến trúc hiện đại.
              </p>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/60 max-w-lg">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">0.8s</div>
                  <div className="text-xs text-slate-500">Tốc độ tải trung bình</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">100%</div>
                  <div className="text-xs text-slate-500">Mã nguồn mở</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">90%</div>
                  <div className="text-xs text-slate-500">Lọc nhiễu thông tin</div>
                </div>
              </div>
            </div>

            {/* Right Media Hero Placeholder (Video & Image Player) */}
            <div className="lg:col-span-5">
              <div className="group relative rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/80 shadow-2xl transition hover:border-cyan-500/40">
                
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                  {!isVideoPlaying ? (
                    <>
                      {/* Image Preview / Video Poster */}
                      <img
                        src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop"
                        alt="TinViaHe Showcase"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105 opacity-80"
                      />
                      <div className="absolute inset-0 bg-linear-to-trom-slate-950 via-slate-950/30 to-transparent" />
                      
                      {/* Interactive Play Button */}
                      <button
                        onClick={() => setIsVideoPlaying(true)}
                        className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-xl transition transform group-hover:scale-110 hover:bg-cyan-400"
                        aria-label="Play video intro"
                      >
                        <Play className="h-7 w-7 fill-slate-950 ml-1" />
                      </button>

                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" /> Video giới thiệu tổng quan
                        </span>
                        <span className="bg-slate-900/80 px-2 py-0.5 rounded text-[11px] text-slate-400">01:45</span>
                      </div>
                    </>
                  ) : (
                    /* Actual Embedded Video Player */
                    <video
                      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                      controls
                      autoPlay
                      className="h-full w-full object-cover"
                    >
                      Trình duyệt không hỗ trợ thẻ video.
                    </video>
                  )}
                </div>

                <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Khám phá hành trình TinViaHe tái định nghĩa đọc tin tức</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {}
        <section
          id="he-sinh-thai"
          ref={(el) => { sectionRefs.current["he-sinh-thai"] = el; }}
          className={`tvh-reveal scroll-mt-28 border-b border-slate-800/80 py-16 ${
            visibleSections["he-sinh-thai"] ? "tvh-visible" : ""
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Kiến trúc đa dịch vụ</span>
              <h2 className="font-serif-custom text-3xl sm:text-4xl font-bold text-slate-100 mt-1">
                Hệ sinh thái TinViaHe
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Các mô-đun hoạt động độc lập nhưng liên kết chặt chẽ nhằm đem lại trải nghiệm đọc tin liền mạch trên mọi nền tảng.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Ecosystem Item Tabs */}
            <div className="lg:col-span-5 space-y-3">
              {ecosystemItems.map((item, idx) => {
                const isSelected = activeEcoTab === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveEcoTab(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-slate-800/90 border-cyan-500/50 shadow-lg shadow-cyan-950/40"
                        : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                          {item.icon}
                        </div>
                        <h3 className="font-semibold text-slate-100 text-base">{item.title}</h3>
                      </div>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${
                        item.status === 'Hoạt động' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        item.status === 'Thử nghiệm Beta' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 pl-12">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Ecosystem Dynamic Media Display */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={ecosystemItems[activeEcoTab].id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel rounded-2xl p-6 border border-slate-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {ecosystemItems[activeEcoTab].tag}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5 text-emerald-400" /> Cập nhật mới nhất
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 mb-2">
                    {ecosystemItems[activeEcoTab].title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {ecosystemItems[activeEcoTab].desc}
                  </p>

                  {/* Dynamic Video / Image Frame */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 aspect-video group">
                    {ecosystemItems[activeEcoTab].mediaType === "video" ? (
                      <video
                        src={ecosystemItems[activeEcoTab].mediaSrc}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={ecosystemItems[activeEcoTab].mediaSrc}
                        alt={ecosystemItems[activeEcoTab].title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-90"
                      />
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent p-3">
                      <p className="text-xs text-slate-300 flex items-center gap-1.5">
                        <ChevronRight className="h-3.5 w-3.5 text-cyan-400" />
                        {ecosystemItems[activeEcoTab].caption}
                      </p>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

        {}
        <section
          id="triet-ly"
          ref={(el) => { sectionRefs.current["triet-ly"] = el; }}
          className={`tvh-reveal scroll-mt-28 border-b border-slate-800/80 py-16 ${
            visibleSections["triet-ly"] ? "tvh-visible" : ""
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Giá trị cốt lõi</span>
              <h2 className="font-serif-custom text-3xl font-bold text-slate-100 mt-1">
                Triết lý thiết kế & Phát triển
              </h2>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                Chúng tôi tin rằng tin tức nên được tiếp cận một cách trung lập, nhanh chóng và không bị quấy rầy bởi quảng cáo độc hại hay giao diện rườm rà.
              </p>

              {/* Supporting Image Slot */}
              <div className="mt-6 rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
                  alt="Philosophy Visual"
                  className="w-full h-40 object-cover opacity-80"
                />
                <div className="p-3 text-[12px] text-slate-400 italic text-center border-t border-slate-800">
                  "Đơn giản hóa trải nghiệm - Tối đa hóa giá trị thông tin."
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Rõ ràng & Minh bạch",
                    desc: "Mỗi phần mã nguồn đều được mô đun hóa minh bạch, dễ đọc và dễ đóng góp từ cộng đồng open-source.",
                    icon: <ShieldCheck className="h-5 w-5 text-cyan-400" />
                  },
                  {
                    title: "Tối ưu Hiệu suất",
                    desc: "Sử dụng Vite và React 19 giúp tối ưu tốc độ render, giảm dung lượng bundle và tải trang tức thì.",
                    icon: <Zap className="h-5 w-5 text-amber-400" />
                  },
                  {
                    title: "Thực dụng & Thân thiện",
                    desc: "Đặt trải nghiệm đọc của người dùng làm trung tâm, loại bỏ các thành phần gây phân tâm.",
                    icon: <Users className="h-5 w-5 text-emerald-400" />
                  },
                  {
                    title: "Dễ dàng Mở rộng",
                    desc: "Sẵn sàng kết nối các mô hình AI tiên tiến, API tin tức toàn cầu và ứng dụng di động.",
                    icon: <TrendingUp className="h-5 w-5 text-purple-400" />
                  }
                ].map((item, idx) => (
                  <div key={idx} className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 w-fit mb-3">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-slate-100 text-base mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {}
        <section
          id="loi-trinh"
          ref={(el) => { sectionRefs.current["loi-trinh"] = el; }}
          className={`tvh-reveal scroll-mt-28 border-b border-slate-800/80 py-16 ${
            visibleSections["loi-trinh"] ? "tvh-visible" : ""
          }`}
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Tương lai TinViaHe</span>
            <h2 className="font-serif-custom text-3xl sm:text-4xl font-bold text-slate-100 mt-1">
              Định hướng & Lộ trình phát triển
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Kế hoạch từng bước để mở rộng nền tảng từ một trang đọc tin cá nhân thành hệ sinh thái tin tức đa chiều.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmapSteps.map((step, idx) => (
              <div
                key={idx}
                className={`relative rounded-2xl p-6 border transition-all ${
                  step.status === 'in-progress'
                    ? "bg-slate-900/90 border-cyan-500/50 shadow-xl shadow-cyan-950/30"
                    : "glass-panel border-slate-800"
                }`}
              >
                {step.status === 'in-progress' && (
                  <span className="absolute -top-3 right-4 bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase px-3 py-0.5 rounded-full shadow">
                    Đang thực hiện
                  </span>
                )}

                <div className="text-xs font-semibold text-cyan-400 mb-1">{step.phase}</div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{step.title}</h3>
                <div className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {step.period}
                </div>

                <ul className="space-y-2 border-t border-slate-800/80 pt-4 text-xs text-slate-300">
                  {step.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${
                        step.status === 'completed' ? 'text-emerald-400' :
                        step.status === 'in-progress' ? 'text-cyan-400' : 'text-slate-600'
                      }`} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Project Contribution Banner Placeholder */}
          <div className="mt-10 rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-900/80 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl font-bold text-slate-100">Bạn muốn đồng hành cùng TinViaHe?</h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Dự án luôn chào đón các nhà phát triển, nhà báo độc lập và người đóng góp nội dung tham gia xây dựng cộng đồng.
              </p>
            </div>
            <a
              href="https://github.com/buibaoduytan/tinviahe"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 px-5 py-2.5 rounded-xl border  border-cyan-300 bg-slte-900 text-cyan-500 font-semibold text-sm hover:bg-cyan-400 hover:text-slate-900 transition shadow-lg shadow-cyan-500/20"
            >
              Tham gia đóng góp
            </a>
          </div>
        </section>

        {}
        <section
          id="tin-moi-nhat"
          ref={(el) => { sectionRefs.current["tin-moi-nhat"] = el; }}
          className={`tvh-reveal scroll-mt-28 border-b border-slate-800/80 py-16 ${
            visibleSections["tin-moi-nhat"] ? "tvh-visible" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Thông tin cập nhật</span>
              <h2 className="font-serif-custom text-3xl font-bold text-slate-100 mt-1">
                Tin tức & Cột mốc nổi bật
              </h2>
            </div>
            <a href="#" className="text-xs font-medium text-cyan-400 hover:underline flex items-center gap-1">
              Xem tất cả bài viết <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsHighlights.map((news) => (
              <article
                key={news.id}
                className="group glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition flex flex-col"
              >
                {/* News Image Frame */}
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-85"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-700 px-2.5 py-1 rounded-md text-[11px] font-medium text-cyan-300">
                    {news.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                      <span>{news.date}</span>
                      <span>•</span>
                      <span>{news.readTime}</span>
                    </div>
                    <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-cyan-300 transition">
                      {news.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {news.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-cyan-400 font-medium">
                    <span>Đọc tiếp</span>
                    <ArrowRight className="h-3.5 w-3.5 transition transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {}
        <section
          id="lich-su"
          ref={(el) => { sectionRefs.current["lich-su"] = el; }}
          className={`tvh-reveal scroll-mt-28 py-16 ${
            visibleSections["lich-su"] ? "tvh-visible" : ""
          }`}
        >
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Nhật ký phiên bản</span>
            <h2 className="font-serif-custom text-3xl font-bold text-slate-100 mt-1">
              Lịch sử phát triển & Công nghệ
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Version History Collapsible Tree */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800">
              <button
                onClick={() => setIsVersionHistoryOpen(!isVersionHistoryOpen)}
                className="w-full flex items-center justify-between font-bold text-slate-100 text-lg p-2 rounded-lg hover:bg-slate-800/50 transition"
              >
                <span className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-cyan-400" />
                  Nhật ký cập nhật hệ thống
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                    isVersionHistoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isVersionHistoryOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="relative mt-6 pl-4 border-l border-slate-800 space-y-6">
                      {versionHistory.map((node, index) => (
                        <motion.div
                          key={node.version}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08, duration: 0.25 }}
                          className="relative pl-4"
                        >
                          <span
                            className={`absolute -left-5.25 top-1 h-2.5 w-2.5 rounded-full border-2 ${
                              index === 0
                                ? "border-cyan-400 bg-cyan-400 shadow-sm shadow-cyan-400"
                                : "border-slate-600 bg-slate-900"
                            }`}
                          />

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-200">v{node.version}</span>
                            <span className="text-[11px] text-slate-500">{node.date}</span>
                            {node.badge && (
                              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.2 rounded border border-cyan-500/30">
                                {node.badge}
                              </span>
                            )}
                          </div>

                          <ul className="mt-2 space-y-1 text-xs text-slate-400">
                            {node.changes.map((change, cIdx) => (
                              <li key={cIdx} className="flex items-start gap-1.5">
                                <span className="text-cyan-500">•</span>
                                <span>{change}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Platform Tech Stack Panel */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Stack công nghệ cốt lõi</h3>
                  <p className="text-xs text-slate-400 mt-1">Xây dựng bằng các giải pháp hiện đại & hiệu năng cao.</p>
                </div>
                <Atom className="h-6 w-6 text-cyan-400 animate-spin-slow" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2 rounded-lg border ${platform.iconClass}`}>
                        {platform.icon}
                      </span>
                      <div>
                        <div className="font-semibold text-sm text-slate-200">{platform.name}</div>
                        <div className="text-[11px] text-slate-500">{platform.role}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {}
        <footer className="border-t border-slate-800/80 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-cyan-400">TinViaHe</span>
            <span>— Nền tảng tin tức mã nguồn mở thế hệ mới.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/buibaoduytan/tinviahe" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">
              GitHub
            </a>
            <a href="#" className="hover:text-cyan-400 transition">Điều khoản</a>
            <a href="#" className="hover:text-cyan-400 transition">Bảo mật</a>
          </div>
        </footer>

      </div>
    </div>
  );
}