import {Mail,Facebook,Github, MapPin} from 'lucide-react';
import type { JSX } from 'react/jsx-runtime';

export default function Footer(): JSX.Element {
  return (
    <footer className="border-t border-slate-700 bg-linear-to-b from-slate-950 to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-4 text-4xl font-oleo weight- text-white">
              TinViaHe
            </h4>
            <p className="mb-4 text-sm text-slate-400">
              Nền tảng tin tức linh hoạt cho định hướng fullstack. Cập nhật kiến thức công nghệ hàng ngày.
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                <span>THPT Long Khanh A</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-500" />
                <a
                  href="mailto:alabatrap52@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  alabatrap52@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-base font-semibold text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {['Trang chủ', 'Tin tức', 'Danh mục', 'Trending'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 transition-colors hover:text-white inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-base font-semibold text-white">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {['Về chúng tôi', 'Blog', 'Công việc', 'Press'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 transition-colors hover:text-white inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-base font-semibold text-white">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              {['Điều khoản sử dụng', 'Chính sách riêng tư', 'Cookie Policy'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-400 transition-colors hover:text-white inline-block"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="my-8 border-t border-slate-700" />

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center text-sm text-slate-500 md:text-left">
            <p>© 2026 TinViaHe. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-4">
            {[
              { icon: Facebook, href: '#', label: 'Facebook' },
              { icon: Github, href: '#', label: 'GitHub' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 transition-all hover:border-blue-500 hover:bg-slate-800 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="h-0.5 bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />
    </footer>
  );
}