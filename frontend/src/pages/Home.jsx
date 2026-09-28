import {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {api} from '../api';
import MovieCard from '../components/MovieCard';
import {ErrorState, LoadingState} from '../components/PageState';


function visiblePopularCount() {
  const width = window.innerWidth;

  if (width >= 1500) return 6;
  if (width >= 1200) return 5;
  if (width >= 992) return 4;
  if (width >= 700) return 3;
  return 2;
}


export default function Home() {
  const [recommended, setRecommended] = useState([]);
  const [popular, setPopular] = useState([]);
  const [count, setCount] = useState(visiblePopularCount());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [recommendations, popularMovies] = await Promise.all([
        api('/movies/recommended/'),
        api('/movies/popular/'),
      ]);
      setRecommended(recommendations.slice(0, 3));
      setPopular(popularMovies);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const resize = () => setCount(visiblePopularCount());
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <LoadingState text="Загружаем фильмы…" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <>
      <section className="container page-pad">
        <div className="section-head">
          <div>
            <span className="eyebrow">Подборка</span>
            <h1>Рекомендуем посмотреть</h1>
            <p>Три фильма из каталога КиноТрекера.</p>
          </div>
        </div>

        <div className="latest-grid">
          {recommended.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="container pb-5">
        <div className="section-head">
          <div>
            <span className="eyebrow">Рейтинг</span>
            <h2>Популярные фильмы</h2>
          </div>
        </div>

        <div className="popular-row">
          {popular.slice(0, count).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <div className="mt-4">
          <Link className="btn btn-danger" to="/catalog">Все фильмы</Link>
        </div>
      </section>
    </>
  );
}
