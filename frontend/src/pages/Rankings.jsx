import {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {api} from '../api';
import {ErrorState, LoadingState} from '../components/PageState';
import {posterFor} from '../posterData';


export default function Rankings() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await api('/movies/');
      setMovies(
        [...data].sort(
          (first, second) => Number(second.site_rating) - Number(first.site_rating),
        ),
      );
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <LoadingState text="Формируем рейтинг…" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <section className="container page-pad">
      <span className="eyebrow">Рейтинг</span>
      <h1>Лучшие фильмы каталога</h1>

      <div className="table-responsive ranking-table mt-4">
        <table className="table table-dark align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Фильм</th>
              <th>Год</th>
              <th>Жанр</th>
              <th>Оценка</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => (
              <tr key={movie.id}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/movies/${movie.id}`} className="table-movie">
                    <img src={posterFor(movie)} alt={`Постер ${movie.title}`} />
                    <span>{movie.title}</span>
                  </Link>
                </td>
                <td>{movie.year}</td>
                <td>{movie.genre}</td>
                <td><b>★ {movie.site_rating}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
