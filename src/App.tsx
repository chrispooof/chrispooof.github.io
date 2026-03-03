import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SocialThumbnails from './components/SocialThumbnails'
import Home from './views/Home'
import Projects from './views/Projects'
import Photos from './views/Photos'
import Contact from './views/Contact'
import Blog from './views/Blog'
import AnimeList from './views/AnimeList'
import MangaList from './views/MangaList'
import BookList from './views/BookList'

export default function App() {
  return (
    <div className="text-center bg-sky-200 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/anime-list" element={<AnimeList />} />
          <Route path="/manga-list" element={<MangaList />} />
          <Route path="/book-list" element={<BookList />} />
        </Routes>
      </main>

      <footer>
        <ul className="list-none m-0 p-0 overflow-hidden leading-loose">
          <SocialThumbnails />
        </ul>
        <p className="text-xs text-center pb-2">
          Designed &amp; Built by Christian Bjerre-Fernandes
        </p>
      </footer>
    </div>
  )
}
