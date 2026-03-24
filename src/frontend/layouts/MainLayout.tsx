import type { ReactNode } from "react";
import Footer from "../ui/Footer";
import Navigation from "../ui/Navigation";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navigation />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">{children}</main>
      <Footer />
    </div>
  );
}
