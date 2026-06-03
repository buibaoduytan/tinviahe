import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import HomePage from "./pages/HomePage.tsx";

import VideoCard from "./pages/ShortVideo.tsx";
import type { JSX } from "react/jsx-runtime";
import KnowPage from "./pages/KnowPage.tsx";

export default function AppRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/know" element={<KnowPage />} />
          <Route path="/short-video" element={<VideoCard />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
