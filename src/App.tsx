import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import SearchPage from './pages/SearchPage'
import PostDetailPage from './pages/PostDetailPage'
import CreatePostPage from './pages/CreatePostPage'
import ProfilePage from './pages/ProfilePage'
import BookmarksPage from './pages/BookmarksPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, retry: 1 },
  },
})

const basename = import.meta.env.BASE_URL

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename={basename}>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
