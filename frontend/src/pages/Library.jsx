import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {api} from '../api';
import {useAuth} from '../AuthContext';
import {MOVIE_STATUSES, STATUS_LABELS} from '../constants';
import {posterFor} from '../posterData';


export default function Library() {
  const {user, loading} = useAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      api('/library/').then(setItems);
    }
  }, [user]);

  if (loading) return null;

  if (!user) {
    return (
      <section className="container page-pad">
        <h1>Мой список</h1>
        <p>Для персонального трекера нужно <Link to="/login">войти</Link>.</p>
      </section>
    );
  }

  const shown = items.filter((entry) => (
    filter === 'all'
      || (filter === 'favorite' ? entry.favorite : entry.status === filter)
  ));

  const removeMovie = async (entry) => {
    await api(`/library/${entry.movie.id}/`, {method: 'DELETE'});
    setItems((current) => current.filter((item) => item.id !== entry.id));
  };

  return (
    <section className="container page-pad">
      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-end">
        <div>
          <span className="eyebrow">Личный кабинет</span>
          <h1>Мой список</h1>
        </div>

        <select
          className="form-select library-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">Все</option>
          {MOVIE_STATUSES.map(({value, label}) => (
            <option key={value} value={value}>{label}</option>
          ))}
          <option value="favorite">Любимое</option>
        </select>
      </div>

      <div className="library-list mt-4">
        {shown.length ? shown.map((entry) => (
          <article className="library-row" key={entry.id}>
            <img
              src={posterFor(entry.movie)}
              alt={`Постер ${entry.movie.title}`}
            />

            <div className="flex-grow-1">
              <Link to={`/movies/${entry.movie.id}`}>
                <h3>{entry.movie.title}</h3>
              </Link>
              <p>{entry.movie.year} · {entry.movie.genre}</p>

              <span className={`status-badge status-${entry.status}`}>
                {STATUS_LABELS[entry.status] || entry.status}
              </span>

              {entry.favorite && (
                <span className="status-badge favorite-badge ms-2">♥ Любимое</span>
              )}

              {entry.user_rating && (
                <span className="badge text-bg-warning ms-2">
                  Моя оценка {entry.user_rating}/10
                </span>
              )}
            </div>

            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => removeMovie(entry)}
            >
              Удалить
            </button>
          </article>
        )) : (
          <div className="empty-state">В этом разделе пока нет фильмов.</div>
        )}
      </div>
    </section>
  );
}
