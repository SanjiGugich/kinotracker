import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Navbar from './components/Navbar'; import Footer from './components/Footer';
import Home from './pages/Home'; import Catalog from './pages/Catalog'; import MoviePage from './pages/MoviePage';
import Rankings from './pages/Rankings'; import Library from './pages/Library'; import Login from './pages/Login'; import Register from './pages/Register'; import Profile from './pages/Profile';
export default function App(){return <BrowserRouter><div className="app-shell"><Navbar/><main><Routes>
<Route path="/" element={<Home/>}/><Route path="/catalog" element={<Catalog/>}/><Route path="/movies/:id" element={<MoviePage/>}/><Route path="/ratings" element={<Rankings/>}/><Route path="/library" element={<Library/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/profile" element={<Profile/>}/>
</Routes></main><Footer/></div></BrowserRouter>}
