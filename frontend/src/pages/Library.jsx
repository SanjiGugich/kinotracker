import {useEffect,useState} from 'react';
import {api} from '../api';
import {useAuth} from '../AuthContext';
import {Link} from 'react-router-dom';
import {posterFor} from '../posterData';

const STATUS_LABELS={
  planned:'Хочу посмотреть',
  watching:'Смотрю',
  watched:'Просмотрено',
  postponed:'Отложено',
  dropped:'Брошено',
};

export default function Library(){
  const {user,loading}=useAuth();
  const [items,setItems]=useState([]);
  const [filter,setFilter]=useState('all');

  useEffect(()=>{if(user)api('/library/').then(setItems)},[user]);

  if(loading)return null;
  if(!user)return <section className="container page-pad"><h1>Мой список</h1><p>Для персонального трекера нужно <Link to="/login">войти</Link>.</p></section>;

  const shown=items.filter(x=>filter==='all'||(filter==='favorite'?x.favorite:x.status===filter));

  return <section className="container page-pad">
    <div className="d-flex flex-wrap justify-content-between gap-3 align-items-end">
      <div>
        <span className="eyebrow">Личный кабинет</span>
        <h1>Мой список</h1>
      </div>
      <select className="form-select library-filter" value={filter} onChange={e=>setFilter(e.target.value)}>
        <option value="all">Все</option>
        <option value="planned">Хочу посмотреть</option>
        <option value="watching">Смотрю</option>
        <option value="watched">Просмотрено</option>
        <option value="postponed">Отложено</option>
        <option value="dropped">Брошено</option>
        <option value="favorite">Любимое</option>
      </select>
    </div>

    <div className="library-list mt-4">
      {shown.length?shown.map(x=><article className="library-row" key={x.id}>
        <img src={posterFor(x.movie)} alt={`Постер ${x.movie.title}`}/>
        <div className="flex-grow-1">
          <Link to={`/movies/${x.movie.id}`}><h3>{x.movie.title}</h3></Link>
          <p>{x.movie.year} · {x.movie.genre}</p>
          <span className={`status-badge status-${x.status}`}>{STATUS_LABELS[x.status]||x.status}</span>
          {x.favorite&&<span className="status-badge favorite-badge ms-2">♥ Любимое</span>}
          {x.user_rating&&<span className="badge text-bg-warning ms-2">Моя оценка {x.user_rating}/10</span>}
        </div>
        <button className="btn btn-outline-danger" onClick={async()=>{
          await api(`/library/${x.movie.id}/`,{method:'DELETE'});
          setItems(items.filter(i=>i.id!==x.id));
        }}>Удалить</button>
      </article>):<div className="empty-state">В этом разделе пока нет фильмов.</div>}
    </div>
  </section>;
}
