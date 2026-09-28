import {HashRouter, Route, Routes} from 'react-router-dom';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import Home from './pages/Home';
import Library from './pages/Library';
import Login from './pages/Login';
import MoviePage from './pages/MoviePage';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Rankings from './pages/Rankings';
import Register from './pages/Register';


export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/movies/:id" element={<MoviePage />} />
            <Route path="/ratings" element={<Rankings />} />
            <Route path="/library" element={<Library />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
}
