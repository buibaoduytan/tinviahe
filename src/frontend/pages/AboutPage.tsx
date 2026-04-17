export default function AboutPage() {
  return (
    <div className="flex flex-col gap-3">
      <section className="hover:scale-110 duration-300 hover:shadow-lg hover:shadow-blue-500/50 animate-fade-in rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold text-blue-300">Về dự án <a href="/" className="text-slate-200 border-b-2 border-b-blue-300 hover:border-b-white transition-colors">Tinviahe</a></h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">
          Tinviahe được thiết kế để là một nền tảng tin tức nhẹ nhàng, nhanh chóng và dễ mở rộng. Mục tiêu chính là <b>tách biệt giao diện người dùng</b> khỏi <b>logic xử lý dữ liệu</b>, giúp dự án trở nên dễ bảo trì và phù hợp cho phát triển nhóm.
        </p>
      </section>

      <section className="hover:scale-110 duration-300 hover:shadow-lg hover:shadow-blue-500/50 animate-fade-in rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold text-blue-300">Triết lý</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">
          Triết lý của chúng tôi là xây dựng web theo hướng <b>đơn giản nhưng mạnh mẽ</b>:
        </p>
        <ul className="mt-4 list-disc list-inside space-y-2 text-slate-300">
          <li><b>Rõ ràng:</b> Mỗi phần mã có một nhiệm vụ cụ thể, dễ đọc và dễ mở rộng.</li>
          <li><b>Hiệu suất:</b> Tối ưu hiển thị và tải trang để người dùng có thể tiếp cận nội dung nhanh nhất.</li>
          <li><b>Thực dụng:</b> Ưu tiên trải nghiệm người dùng và độ tin cậy hơn là những tính năng quá phức tạp.</li>
          <li><b>Có thể phát triển:</b> Thiết kế sao cho dễ thêm trang mới, module mới và tích hợp API trong tương lai.</li>
        </ul>
      </section>

      <section className="hover:scale-110 duration-300 hover:shadow-lg hover:shadow-blue-500/50 animate-fade-in rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold text-blue-300">Thông tin dự án</h1>
        <div className="mt-4 max-w-3xl space-y-4 text-slate-300">
          <p>
            Tinviahe sử dụng cấu trúc frontend/backend rõ ràng. Phần frontend tập trung vào giao diện và điều hướng, còn phần backend đảm nhận việc xử lý dữ liệu và API.
          </p>
          <p>
            Hiện tại, web hỗ trợ các tính năng cơ bản như xem tin tức, đăng nhập/đăng ký, và theo dõi các video ngắn. Mục tiêu tiếp theo là mở rộng danh mục tin và cải thiện trải nghiệm đọc tin trên cả máy tính và thiết bị di động.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <h2 className="text-xl font-semibold text-blue-200">Công nghệ</h2>
              <ul className="mt-3 list-disc list-inside space-y-1 text-slate-300">
                <li>React + Vite</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Node.js / Express</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <h2 className="text-xl font-semibold text-blue-200">Hướng phát triển</h2>
              <ul className="mt-3 list-disc list-inside space-y-1 text-slate-300">
                <li>Mở rộng API tin tức</li>
                <li>Thêm bộ lọc và tìm kiếm nâng cao</li>
                <li>Tương tác người dùng và quản lý nội dung</li>
                <li>Thiết kế responsive, thân thiện di động</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
