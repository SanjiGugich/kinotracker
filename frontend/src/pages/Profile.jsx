import {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {api} from '../api';
import {useAuth} from '../AuthContext';
import {ErrorState, LoadingState} from '../components/PageState';


export default function Profile() {
  const {user, loading: authLoading, refreshUser} = useAuth();
  const [data, setData] = useState(null);
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user) return;

    setError('');
    try {
      const profile = await api('/auth/profile/');
      setData(profile);
      setForm(profile.user);
    } catch (loadError) {
      setError(loadError.message);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (authLoading) {
    return <LoadingState text="Проверяем аккаунт…" />;
  }

  if (!user) {
    return (
      <section className="container page-pad">
        <h1>Профиль</h1>
        <p>Чтобы открыть профиль, <Link to="/login">войдите</Link>.</p>
      </section>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!data || !form) {
    return <LoadingState text="Загружаем профиль…" />;
  }

  const save = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const updated = await api('/auth/profile/', {
        method: 'PATCH',
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          first_name: form.first_name,
        }),
      });
      setData(updated);
      setForm(updated.user);
      await refreshUser();
      setMessage('Профиль сохранён.');
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const stats = data.stats;

  return (
    <section className="container page-pad">
      <div className="profile-head">
        <div>
          <span className="eyebrow">Личный кабинет</span>
          <h1>{data.user.first_name || data.user.username}</h1>
          <p className="text-secondary">
            Аккаунт хранится в базе КиноТрекера. Ваши списки доступны после любого следующего входа.
          </p>
        </div>

        <Link className="btn btn-outline-light" to="/library">Мой список</Link>
      </div>

      <div className="profile-stats my-4">
        <div><strong>{stats.total}</strong><span>в списках</span></div>
        <div><strong>{stats.watched}</strong><span>просмотрено</span></div>
        <div><strong>{stats.favorites}</strong><span>любимое</span></div>
        <div>
          <strong>
            {stats.average_rating ? Number(stats.average_rating).toFixed(1) : '—'}
          </strong>
          <span>средняя оценка</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="content-card">
            <h2 className="h4">Данные профиля</h2>

            <form onSubmit={save}>
              <label className="form-label mt-2">Имя</label>
              <input
                className="form-control"
                value={form.first_name || ''}
                onChange={(event) => setForm({...form, first_name: event.target.value})}
              />

              <label className="form-label mt-3">Логин</label>
              <input
                className="form-control"
                value={form.username}
                onChange={(event) => setForm({...form, username: event.target.value})}
              />

              <label className="form-label mt-3">Email</label>
              <input
                className="form-control"
                type="email"
                value={form.email || ''}
                onChange={(event) => setForm({...form, email: event.target.value})}
              />

              <button className="btn btn-danger mt-3">Сохранить</button>
              {message && <div className="small text-secondary mt-2">{message}</div>}
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="content-card">
            <h2 className="h4">Статистика</h2>
            <p>Хочу посмотреть: <strong>{stats.planned}</strong></p>
            <p>Смотрю: <strong>{stats.watching}</strong></p>
            <p>Просмотрено: <strong>{stats.watched}</strong></p>
            <p>Отложено: <strong>{stats.postponed}</strong></p>
            <p>Брошено: <strong>{stats.dropped}</strong></p>
            <p>Любимое: <strong>{stats.favorites}</strong></p>
            <p className="mb-0">
              Дата регистрации:{' '}
              <strong>{new Date(data.user.date_joined).toLocaleDateString('ru-RU')}</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
