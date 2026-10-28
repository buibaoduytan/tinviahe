export const ARTICLES_PER_PAGE = 350;
export const INITIAL_VISIBLE_BATCH = 40; // Nạp trước 40 bài để mượt DOM
export const BATCH_SIZE = 30;

export const HOT_TOPICS: string[] = [
  "Giá vàng hôm nay",
  "Trí tuệ nhân tạo AI",
  "Thị trường Bất động sản",
  "Ngoại hạng Anh",
  "Chuyển đổi số",
  "Tài chính doanh nghiệp",
  "Du lịch hè 2026",
  "Tỷ giá USD",
  "Xe điện Tesla & VinFast",
  "Giáo dục & Tuyển sinh",
];

export const CATEGORY_TAGS: {
    id: string;
    label: string;
}[] = [
  { id: "all", label: "Tất cả tin (350+)" },
  { id: "thoi-su", label: "Thời sự & Chính trị" },
  { id: "kinh-te", label: "Kinh tế & Đầu tư" },
  { id: "the-gioi", label: "Thế giới" },
  { id: "cong-nghe", label: "Công nghệ & AI" },
  { id: "giai-tri", label: "Giải trí & Showbiz" },
  { id: "the-thao", label: "Thể thao 24/7" },
  { id: "doi-song", label: "Đời sống & Gia đình" },
  { id: "phap-luat", label: "Pháp luật" },
  { id: "xe", label: "Xe & Giao thông" },
  { id: "suckhoe", label: "Sức khỏe" },
];
