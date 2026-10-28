import React, { useState, useMemo, useRef, useEffect, useCallback, type JSX } from 'react';
import { 
  Sparkles, ChevronLeft, ChevronRight, Rocket, Trees, 
  Landmark, Cpu, HeartPulse, Search, X, Clock, Bookmark, 
  Share2, CheckCircle2, HelpCircle, Sun, Moon, Shuffle,
  BookMarked, Check, ArrowLeft, ArrowRight, Compass
} from 'lucide-react';

// Dữ liệu mẫu fallback phòng trường hợp đường dẫn JSON gặp sự cố
import RAW_FUN_FACTS_DATA from '/home/duytann/tinviahe/backend/src/data/funfact.json';

interface DeepInfo {
  subtitle: string;
  overview: string;
  content: string;
  key_takeaways: string[];
  did_you_know: string;
}

interface FunFact {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  fun_fact: string;
  readTime: string;
  img_url: string;
  deep_info: DeepInfo;
}

const FALLBACK_DATA: FunFact[] = [
  {
    id: '1',
    categoryId: 'space',
    categoryName: 'Vũ trụ & Khoa học',
    name: 'Một ngày trên Sao Kim dài hơn một năm của nó',
    fun_fact: 'Sao Kim tự quay quanh trục cực kỳ chậm, mất 243 ngày Trái Đất để hoàn thành một vòng quay, trong khi chỉ mất 225 ngày để quay quanh Mặt Trời.',
    readTime: '3 phút đọc',
    img_url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop',
    deep_info: {
      subtitle: 'Hiện tượng vật lý kỳ lạ của hành tinh xóm giềng',
      overview: 'Sao Kim là một trong những hành tinh đặc biệt nhất trong Hệ Mặt Trời với chu kỳ tự quay ngược và cực kỳ chậm.',
      content: 'Do chuyển động quay nghịch hướng (từ Đông sang Tây) cùng tốc độ quay quanh trục siêu chậm, khoảng thời gian từ bình minh này đến bình minh tiếp theo trên Sao Kim kéo dài tới 117 ngày Trái Đất.\n\nNgoài ra, bầu khí quyển siêu dày chứa CO2 cùng áp suất gấp 92 lần Trái Đất tạo ra hiệu ứng nhà kính phi mã, biến nơi đây thành hành tinh nóng nhất Hệ Mặt Trời.',
      key_takeaways: [
        'Sao Kim tự quay ngược chiều so với hầu hết các hành tinh khác.',
        'Một ngày trên Sao Kim dài 243 ngày Trái Đất.',
        'Nhiệt độ bề mặt có thể nung chảy cả chì (~465°C).'
      ],
      did_you_know: 'Nếu đứng trên Sao Kim, bạn sẽ thấy Mặt Trời mọc ở hướng Tây và lặn ở hướng Đông!'
    }
  },
  {
    id: '2',
    categoryId: 'nature',
    categoryName: 'Tự nhiên & Động vật',
    name: 'Bạch tuộc có đến 3 trái tim và máu màu xanh',
    fun_fact: 'Bạch tuộc sử dụng hai trái tim để bơm máu đến mang, trong khi trái tim thứ ba bơm máu đi nuôi toàn bộ cơ thể.',
    readTime: '2 phút đọc',
    img_url: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?q=80&w=1000&auto=format&fit=crop',
    deep_info: {
      subtitle: 'Sinh vật thông minh bậc nhất dưới lòng đại dương',
      overview: 'Hệ tuần hoàn và thần kinh của bạch tuộc cực kỳ độc đáo, giúp chúng thích nghi hoàn hảo với môi trường áp suất cao dưới đáy biển.',
      content: 'Máu của bạch tuộc có màu xanh lam vì chứa nguyên tố Đồng (Hemocyanin) để vận chuyển oxy thay vì Sắt (Hemoglobin) như con người. Hemocyanin hoạt động hiệu quả hơn rất nhiều trong môi trường nước biển lạnh và thiếu oxy.\n\nKhi bạch tuộc bơi, trái tim chính sẽ ngừng đập, điều này giải thích vì sao chúng thích bò hơn là bơi để tránh kiệt sức.',
      key_takeaways: [
        '3 trái tim đảm nhận vai trò bơm máu chuyên biệt.',
        'Máu màu xanh nhờ hợp chất gốc Đồng Hemocyanin.',
        '2/3 số lượng tế bào thần kinh nằm ở các tua cuốn.'
      ],
      did_you_know: 'Bạch tuộc có thể nếm vị thức ăn ngay khi chạm vào nó nhờ các giác hút trên vòi!'
    }
  }
];

const FUN_FACTS_DATA: FunFact[] = Array.isArray(RAW_FUN_FACTS_DATA) && RAW_FUN_FACTS_DATA.length > 0 
  ? (RAW_FUN_FACTS_DATA as FunFact[]) 
  : FALLBACK_DATA;

const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: Sparkles },
  { id: 'space', name: 'Vũ trụ & Khoa học', icon: Rocket },
  { id: 'nature', name: 'Tự nhiên & Động vật', icon: Trees },
  { id: 'history', name: 'Lịch sử & Văn hóa', icon: Landmark },
  { id: 'tech', name: 'Công nghệ & Tương lai', icon: Cpu },
  { id: 'human', name: 'Con người & Cơ thể', icon: HeartPulse }
];

export default function App(): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFact, setSelectedFact] = useState<FunFact | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Cuộn thanh Category
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Lọc danh sách bài viết
  const filteredFacts = useMemo(() => {
    return FUN_FACTS_DATA.filter(fact => {
      const matchCategory = selectedCategory === 'all' || fact.categoryId === selectedCategory;
      const matchSearch = fact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          fact.fun_fact.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBookmark = !showOnlyBookmarks || bookmarkedIds.includes(fact.id);
      return matchCategory && matchSearch && matchBookmark;
    });
  }, [selectedCategory, searchQuery, showOnlyBookmarks, bookmarkedIds]);

  // Lock body scroll khi mở Modal & xử lý phím Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedFact(null);
    };

    if (selectedFact) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedFact]);

  // Kiểm tra trạng thái cuộn của thanh thể loại
  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [checkScrollButtons]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Bookmark toggle
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Chia sẻ / Sao chép
  const handleShare = () => {
    if (selectedFact) {
      const textToCopy = `${selectedFact.name}\n${selectedFact.fun_fact}`;
      navigator.clipboard?.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Khám phá ngẫu nhiên
  const handleRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * FUN_FACTS_DATA.length);
    setSelectedFact(FUN_FACTS_DATA[randomIndex]);
  };

  // Chuyển bài trong Modal
  const handleNavigateModal = (direction: 'prev' | 'next') => {
    if (!selectedFact) return;
    const currentIndex = filteredFacts.findIndex(f => f.id === selectedFact.id);
    if (currentIndex === -1) return;

    if (direction === 'prev' && currentIndex > 0) {
      setSelectedFact(filteredFacts[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < filteredFacts.length - 1) {
      setSelectedFact(filteredFacts[currentIndex + 1]);
    }
  };

  const currentModalIndex = selectedFact ? filteredFacts.findIndex(f => f.id === selectedFact.id) : -1;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Header Sticky Glassmorphism */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-950/80 border-slate-800 text-slate-100' 
          : 'bg-white/80 border-slate-200 text-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-trrom-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-montserrat tracking-tight bg-linear-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Tri Thức Hub
              </h1>
              <p className={`text-xs hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Khám phá điều thú vị mỗi ngày
              </p>
            </div>
          </div>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end max-w-xl">
            {/* Search Input */}
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <input
                type="text"
                placeholder="Tìm kiếm kiến thức..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-9 py-2 text-sm rounded-full transition-all border outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:bg-slate-950' 
                    : 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Nút lọc Bài đã lưu */}
            <button
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              title="Danh sách bài đã lưu"
              className={`relative p-2.5 rounded-full border transition-all ${
                showOnlyBookmarks
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              {bookmarkedIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                  {bookmarkedIds.length}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle Theme Mode"
              className={`p-2.5 rounded-full border transition-all ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Hero */}
        <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden transition-all ${
          isDarkMode 
            ? 'bg-linear-to-brrom-slate-900 via-indigo-950 to-slate-900 border border-slate-800' 
            : 'bg-linear-to-br from-indigo-600 via-sky-600 to-cyan-600'
        }`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Thư viện tri thức đa chiều</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Thế giới quanh ta <span className="bg-linear-to-r from-amber-200 via-amber-300 to-cyan-300 bg-clip-text text-transparent">kỳ diệu</span> hơn bạn tưởng
            </h2>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
              Khám phá các sự thật khoa học thú vị, được giải thích ngắn gọn, chính xác và chuyên sâu.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={handleRandomFact}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition shadow-lg hover:scale-105 active:scale-95"
              >
                <Shuffle className="w-4 h-4 text-indigo-600" />
                Khám phá ngẫu nhiên
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Chủ đề khám phá
            </h3>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
              isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-200 text-slate-600'
            }`}>
              Hiển thị {filteredFacts.length} kết quả
            </span>
          </div>

          <div className="relative group">
            {/* Scroll Left Button */}
            {canScrollLeft && (
              <div className={`absolute left-0 top-0 bottom-0 w-12 z-20 flex items-center justify-start pl-1 pointer-events-none bg-linear-to-r ${
                isDarkMode ? 'from-slate-950 to-transparent' : 'from-slate-50 to-transparent'
              }`}>
                <button
                  onClick={() => handleScroll('left')}
                  className={`p-2 rounded-full shadow-lg border backdrop-blur-md pointer-events-auto transition hover:scale-110 ${
                    isDarkMode 
                      ? 'bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800' 
                      : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Categories Scroll Container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollButtons}
              className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
            >
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id && !showOnlyBookmarks;
                const count = cat.id === 'all' 
                  ? FUN_FACTS_DATA.length 
                  : FUN_FACTS_DATA.filter(f => f.categoryId === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setShowOnlyBookmarks(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 border ${
                      isActive
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/25 scale-100'
                        : isDarkMode
                          ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800/80'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                    <span>{cat.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-slate-950/20 text-slate-950 font-bold' 
                        : isDarkMode 
                          ? 'bg-slate-800 text-slate-400' 
                          : 'bg-slate-100 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            {canScrollRight && (
              <div className={`absolute right-0 top-0 bottom-0 w-12 z-20 flex items-center justify-end pr-1 pointer-events-none bg-linear-to-l ${
                isDarkMode ? 'from-slate-950 to-transparent' : 'from-slate-50 to-transparent'
              }`}>
                <button
                  onClick={() => handleScroll('right')}
                  className={`p-2 rounded-full shadow-lg border backdrop-blur-md pointer-events-auto transition hover:scale-110 ${
                    isDarkMode 
                      ? 'bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800' 
                      : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Fact Cards Grid */}
        <section>
          {filteredFacts.length === 0 ? (
            <div className={`text-center py-16 px-4 rounded-3xl border ${
              isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
              <h4 className={`text-lg font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                Không tìm thấy thông tin phù hợp
              </h4>
              <p className={`text-sm mt-1 max-w-md mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {showOnlyBookmarks 
                  ? 'Bạn chưa lưu bài viết nào vào danh sách yêu thích.' 
                  : 'Hãy thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác.'}
              </p>
              <button 
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setShowOnlyBookmarks(false); }}
                className="mt-5 px-5 py-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl text-sm font-semibold hover:bg-cyan-500/20 transition border border-cyan-500/20"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacts.map((fact) => {
                const isBookmarked = bookmarkedIds.includes(fact.id);

                return (
                  <div
                    key={fact.id}
                    onClick={() => setSelectedFact(fact)}
                    className={`group rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 ${
                      isDarkMode 
                        ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-cyan-500/5' 
                        : 'bg-white border-slate-200/80 shadow-sm hover:shadow-xl'
                    }`}
                  >
                    <div>
                      {/* Image Preview */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                        <img
                          src={fact.img_url}
                          alt={fact.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                        {/* Category Tag */}
                        <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/70 backdrop-blur-md text-xs font-semibold text-cyan-300 rounded-full border border-white/10">
                          {fact.categoryName}
                        </span>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => toggleBookmark(fact.id, e)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                            isBookmarked 
                              ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40' 
                              : 'bg-slate-950/50 text-white hover:bg-slate-950/80'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Content Card */}
                      <div className="p-5 space-y-2">
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{fact.readTime}</span>
                        </div>

                        <h3 className={`text-base font-serif-custom font-semibold line-clamp-2 group-hover:text-cyan-400 transition ${
                          isDarkMode ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {fact.name}
                        </h3>

                        <p className={`text-xs sm:text-sm line-clamp-3 leading-relaxed font-montserrat  ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {fact.fun_fact}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className={`px-5 py-3.5 flex items-center justify-between border-t text-xs font-semibold ${
                      isDarkMode ? 'border-slate-800/80 text-cyan-400' : 'border-slate-100 text-cyan-600'
                    }`}>
                      <span className="group-hover:underline flex items-center gap-1">
                        Chi tiết chuyên sâu
                      </span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Modal - Reader View */}
      {selectedFact && (
        <div 
          className="fixed inset-0 z-50 p-4 sm:p-6 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedFact(null)}
        >
          <div 
            className={`w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-slate-100' 
                : 'bg-white border-slate-200 text-slate-800'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-60 sm:h-72 w-full bg-slate-900 shrink-0">
              <img
                src={selectedFact.img_url}
                alt={selectedFact.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedFact(null)}
                className="absolute top-4 right-4 p-2.5 bg-slate-950/60 hover:bg-slate-950 text-white rounded-full backdrop-blur-md transition border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Info */}
              <div className="absolute bottom-5 left-6 right-6 space-y-1.5 text-white">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold rounded-full">
                    {selectedFact.categoryName}
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedFact.readTime}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {selectedFact.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-light">
                  {selectedFact.deep_info.subtitle}
                </p>
              </div>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
              
              {/* Quick Summary Box */}
              <div className={`p-4 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-cyan-950/30 border-cyan-800/40 text-cyan-200' 
                  : 'bg-cyan-50 border-cyan-200 text-cyan-900'
              }`}>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 text-cyan-400">
                  <Sparkles className="w-4 h-4" /> Tóm tắt nhanh
                </h4>
                <p className="font-medium">
                  {selectedFact.fun_fact}
                </p>
              </div>

              {/* Deep Content */}
              <div className="space-y-3">
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  Cơ chế & Giải thích khoa học
                </h3>
                <p className={`font-light leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {selectedFact.deep_info.overview}
                </p>
                <p className={`whitespace-pre-line leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {selectedFact.deep_info.content}
                </p>
              </div>

              {/* Key Takeaways */}
              <div className={`border-t pt-5 space-y-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  Điểm cốt lõi cần nhớ
                </h4>
                <div className="space-y-2">
                  {selectedFact.deep_info.key_takeaways.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Did you know block */}
              <div className={`p-4 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-amber-950/20 border-amber-800/30 text-amber-200' 
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <h4 className="text-xs font-bold mb-1 flex items-center gap-1.5 text-amber-400">
                  <HelpCircle className="w-4 h-4" /> Bạn có biết?
                </h4>
                <p className="italic text-xs sm:text-sm">
                  "{selectedFact.deep_info.did_you_know}"
                </p>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className={`p-4 px-6 border-t flex flex-wrap items-center justify-between gap-3 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              
              {/* Prev / Next Navigation */}
              <div className="flex items-center gap-1">
                <button
                  disabled={currentModalIndex <= 0}
                  onClick={() => handleNavigateModal('prev')}
                  className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition ${
                    currentModalIndex <= 0
                      ? 'opacity-40 cursor-not-allowed border-transparent'
                      : isDarkMode
                        ? 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                        : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Trước
                </button>
                <button
                  disabled={currentModalIndex >= filteredFacts.length - 1}
                  onClick={() => handleNavigateModal('next')}
                  className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition ${
                    currentModalIndex >= filteredFacts.length - 1
                      ? 'opacity-40 cursor-not-allowed border-transparent'
                      : isDarkMode
                        ? 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                        : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Sau <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bookmark & Share Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => toggleBookmark(selectedFact.id, e)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
                    bookmarkedIds.includes(selectedFact.id)
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : isDarkMode 
                        ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(selectedFact.id) ? 'fill-current' : ''}`} />
                  {bookmarkedIds.includes(selectedFact.id) ? 'Đã lưu' : 'Lưu bài'}
                </button>

                <button
                  onClick={handleShare}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : isDarkMode 
                        ? 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800' 
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copied ? 'Đã chép' : 'Chia sẻ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}