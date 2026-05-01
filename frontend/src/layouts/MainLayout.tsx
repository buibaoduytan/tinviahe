import type { ReactNode } from "react";
import Footer from "../ui/Footer";
import Navigation from "../ui/Navigation";
import { Categories } from "../ui/Categories";
import type { JSX } from "react/jsx-runtime";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-(--surface-bg) text-(--app-text)">
      <Navigation />
      <Categories />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
