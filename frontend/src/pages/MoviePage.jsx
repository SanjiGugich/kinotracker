import {useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import {api} from '../api';
import {useAuth} from '../AuthContext';
import LibraryControls from '../components/LibraryControls';
import {ErrorState, LoadingState} from '../components/PageState';
import {posterFor} from '../posterData';


const initials = (name) => (
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
);


export default function MoviePage() {
  const {id} = useParams();
  const {user} = useAuth();

  const [movie, setMovie] = useState(null);
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState('');
  const [libraryError, setLibraryError] = useState('');

  const loadMovie = useCallback(async () => {
    setError('');

    try {
      setMovie(await api(`/movies/${id}/`));
    } catch (loadError) {
      setError(loadError.message);
    }
  }, [id]);

  useEffect(() => {
    setMovie(null);
    loadMovie();
  }, [loadMovie]);

  useEffect(() => {
    if (!user) {
      setEntry(null);
      setLibraryError('');
      return;
    }

    setLibraryError('');

    api('/library/')
      .then((items) => {
        setEntry(items.find((item) => item.movie.id === Number(id)) || null);
      })
      .catch((loadError) => setLibraryError(loadError.message));
  }, [user, id]);

  if (error) {
    return <ErrorState message={error} onRetry={loadMovie} />;
  }

  if (!movie) {
    return <LoadingState text="Загружаем фильм…" />;
  }

  const cast = (movie.actors || '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  return (
    <section className="container page-pad">
      <div className="movie-detail row g-5 align-items-start">
        <div className="col-md-4 col-lg-3">
          <img
            className="detail-poster"
            src={posterFor(movie)}
            alt={`Постер ${movie.title}`}
          />
        </div>

        <div className="col-md-8 col-lg-9">
          <span className="eyebrow">{movie.year}</span>
          <h1 className="detail-title">{movie.title}</h1>
          <p className="original-title">{movie.original_title}</p>

          <div className="facts">
            <span>★ {movie.site_rating}</span>
            <span>{movie.genre}</span>
            <span>{movie.duration} мин</span>
            <span>{movie.country}</span>
          </div>

          <p className="description">{movie.description}</p>

          <dl className="row info-list">
            <dt className="col-sm-3">Режиссёр</dt>
            <dd className="col-sm-9">{movie.director || '—'}</dd>

            <dt className="col-sm-3">Страна</dt>
            <dd className="col-sm-9">{movie.country || '—'}</dd>

            <dt className="col-sm-3">Год</dt>
            <dd className="col-sm-9">{movie.year}</dd>

            <dt className="col-sm-3">Продолжительность</dt>
            <dd className="col-sm-9">{movie.duration} мин</dd>
          </dl>

          {movie.trailer_url && (
            <a
              className="btn btn-outline-light mb-3"
              href={movie.trailer_url}
              target="_blank"
              rel="noreferrer"
            >
              ▶ Трейлер
            </a>
          )}

          {libraryError && (
            <div className="alert alert-warning py-2">
              Не удалось загрузить данные личного списка: {libraryError}
            </div>
          )}

          <LibraryControls movie={movie} initial={entry} onSaved={setEntry} />
        </div>
      </div>

      {cast.length > 0 && (
        <div className="mt-5">
          <span className="eyebrow">В ролях</span>
          <h2 className="mb-3">Актёрский состав</h2>

          <div className="cast-grid">
            {cast.map((name) => (
              <div className="actor-card" key={name}>
                <div className="actor-avatar">{initials(name)}</div>
                <strong>{name}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
