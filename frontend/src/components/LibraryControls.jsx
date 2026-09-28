import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {api} from '../api';
import {useAuth} from '../AuthContext';
import {MOVIE_STATUSES} from '../constants';


export default function LibraryControls({movie, initial, onSaved}) {
  const {user} = useAuth();
  const [status, setStatus] = useState(initial?.status || 'planned');
  const [favorite, setFavorite] = useState(initial?.favorite || false);
  const [rating, setRating] = useState(initial?.user_rating || '');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setStatus(initial?.status || 'planned');
    setFavorite(Boolean(initial?.favorite));
    setRating(initial?.user_rating ?? '');
  }, [initial?.id, initial?.status, initial?.favorite, initial?.user_rating]);

  if (!user) {
    return (
      <div className="callout">
        Чтобы вести личный список, <Link to="/login">войдите в аккаунт</Link>.
      </div>
    );
  }

  const save = async () => {
    setBusy(true);
    setMessage('');

    try {
      const entry = await api('/library/', {
        method: 'POST',
        body: JSON.stringify({
          movie_id: movie.id,
          status,
          favorite,
          user_rating: rating ? Number(rating) : null,
        }),
      });
      setMessage('Сохранено');
      onSaved?.(entry);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="library-controls">
      <div className="library-control-grid">
        <label className="control-field">
          <span>Статус</span>
          <select
            className="form-select"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {MOVIE_STATUSES.map(({value, label}) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="control-field">
          <span>Моя оценка</span>
          <input
            className="form-control"
            type="number"
            min="1"
            max="10"
            placeholder="1–10"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
          />
        </label>

        <button
          type="button"
          className={`btn library-favorite-btn ${favorite ? 'is-active' : ''}`}
          onClick={() => setFavorite(!favorite)}
        >
          {favorite ? '♥ Любимое' : '♡ В любимое'}
        </button>

        <button
          type="button"
          className="btn btn-danger library-save-btn"
          onClick={save}
          disabled={busy}
        >
          {busy ? 'Сохраняю…' : 'Сохранить'}
        </button>
      </div>

      {message && (
        <small className={`library-save-message ${message === 'Сохранено' ? 'ok' : ''}`}>
          {message}
        </small>
      )}
    </div>
  );
}
