import {useCallback, useEffect, useState} from 'react';

import {api} from '../api';
import MovieCard from '../components/MovieCard';
import {ErrorState, LoadingState} from '../components/PageState';


export default function Catalog() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGenres = useCallback(async () => {
    try {
      setGenres(await api('/movies/genres/'));
    } catch (loadError) {
      setError(loadError.message);
    }
  }, []);

  useEffect(() => {
    loadGenres();
  }, [loadGenres]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (genre) params.set('genre', genre);

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');

      try {
        const query = params.toString();
        setMovies(await api(`/movies/${query ? `?${query}` : ''}`));
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [search, genre]);

  return (
    <section className="container page-pad">
      <div className="section-head">
        <div>
          <span className="eyebrow">Фильмы</span>
          <h1>Каталог</h1>
          <p>Поиск и фильтрация по жанрам.</p>
        </div>
      </div>

      <div className="filter-bar row g-2 mb-4">
        <div className="col-md-8">
          <input
            className="form-control form-control-lg"
            placeholder="Поиск фильма, режиссёра или жанра"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select form-select-lg"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          >
            <option value="">Все жанры</option>
            {genres.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : loading ? (
        <LoadingState text="Загружаем каталог…" />
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}
