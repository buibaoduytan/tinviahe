import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { NewsArticle } from "../types/news";
import type { JSX } from 'react/jsx-runtime';

interface ArticlesGridProps {
  bottomArticles: NewsArticle[];
}

export function ArticlesGrid({ bottomArticles }: ArticlesGridProps): JSX.Element {
  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);

  return (
    <>
      {bottomArticles.length > 0 && (
        <div className="space-y-5 border-t border-slate-800 pt-8">
          <h3 
            className="text-lg font-bold text-white" 
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            Tin khác ({bottomArticles.length})
          </h3>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {bottomArticles.map((article) => (
              <article
                key={article.url}
                className="group flex gap-4 overflow-hidden rounded-lg border border-slate-800/50 bg-slate-900/20 p-4 transition hover:border-slate-700 hover:bg-slate-900/40"
              >
                {/* IMAGE CONTAINER - HOVER HERE */}
                <div
                  className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-slate-800 cursor-pointer"
                  onMouseEnter={() => setHoveredArticle(article.url)}
                  onMouseLeave={() => setHoveredArticle(null)}
                >
                  {/* IMAGE */}
                  <img
                    src={article.imageUrl || ''}
                    alt={article.title}
                    className={`h-full w-full object-cover transition-all duration-300 ${
                      hoveredArticle === article.url
                        ? 'scale-110 blur-sm'
                        : 'scale-100 blur-0'
                    }`}
                  />

                  {/* DARK OVERLAY - ALWAYS THERE */}
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/40 to-black/80" />

                  {/* HOVER CARD - APPEARS ON HOVER */}
                  <div
                    className={`absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-300 ${
                      hoveredArticle === article.url ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* CATEGORY BADGE */}
                      {article.source && (
                        <span className="text-[8px] font-bold uppercase tracking-wider text-blue-300 inline-block bg-blue-600/60 px-2 py-1 rounded">
                          {article.content}
                        </span>
                      )}

                      {/* TITLE */}
                      <h4
                        className="text-sm font-semibold text-white line-clamp-2 leading-tight"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                      >
                        {article.title}
                      </h4>

                      {/* DESCRIPTION */}
                      {article.description && (
                        <p className="text-[10px] text-slate-200 line-clamp-2 leading-tight">
                          {article.description}
                        </p>
                      )}

                      {/* DATE */}
                      <time className="text-[8px] text-slate-300 block">
                        {new Date(article.publishedAt).toLocaleDateString("vi-VN")}
                      </time>
                    </div>
                  </div>
                </div>

                {/* TEXT CONTENT - ALWAYS VISIBLE (NO TITLE) */}
                <div className="flex flex-1 flex-col justify-between">
                  {/* CATEGORY - ALWAYS SHOW */}
                  {article.source && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400">
                      {article.content}
                    </span>
                  )}

                 <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center px-2 py-1 text-xs font-medium text-blue-300 transition hover:text-blue-200 active:scale-95"
                      title="Mở bài viết"
                    >
                      Xem bài
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  <div />

                  {/* DATE + BUTTON */}
                  <div className="flex items-center justify-between gap-2">
                    <time className="text-xs text-slate-500">
                      {new Date(article.publishedAt).toLocaleDateString("vi-VN")}
                    </time>

                   
                  </div>
                  
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </>
  );
}