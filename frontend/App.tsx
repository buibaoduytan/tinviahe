import type { JSX } from "react/jsx-runtime";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./src/pages/HomePage";
import AboutPage from "./src/pages/AboutPage";
import KnowPage from "./src/pages/KnowPage";
import VideoCard from "./src/pages/ShortVideo"; 
import MainLayout from "./src/layouts/MainLayout";
import Planet from "./src/pages/Flashcard";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<> <HomePage /></>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/know" element={<KnowPage />} />
          <Route path="/short-video" element={<VideoCard />} />
          <Route path="/flashcard" element={<Planet />}/>
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;