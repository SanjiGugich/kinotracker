import {Link} from 'react-router-dom';
import {posterFor} from '../posterData';

export default function MovieCard({movie}){
  return <article className="movie-card">
    <Link className="movie-link" to={`/movies/${movie.id}`}>
      <div className="poster-wrap">
        <img className="poster-img" src={posterFor(movie)} alt={`Постер ${movie.title}`} />
        <span className="score">★ {movie.site_rating}</span>
      </div>
      <div className="movie-meta">
        <h3>{movie.title}</h3>
        <p>{movie.year} · {movie.genre}</p>
      </div>
    </Link>
  </article>;
}
