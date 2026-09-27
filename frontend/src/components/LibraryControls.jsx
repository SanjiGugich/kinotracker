import {useEffect,useState} from 'react';
import {api} from '../api';
import {useAuth} from '../AuthContext';
import {Link} from 'react-router-dom';

export default function LibraryControls({movie,initial,onSaved}){
  const {user}=useAuth();
  const [status,setStatus]=useState(initial?.status||'planned');
  const [favorite,setFavorite]=useState(initial?.favorite||false);
  const [rating,setRating]=useState(initial?.user_rating||'');
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{
    setStatus(initial?.status||'planned');
    setFavorite(Boolean(initial?.favorite));
    setRating(initial?.user_rating ?? '');
  },[initial?.id, initial?.status, initial?.favorite, initial?.user_rating]);

  if(!user){
    return <div className="callout">Чтобы вести личный список, <Link to="/login">войдите в аккаунт</Link>.</div>;
  }

  const save=async()=>{
    setBusy(true);
    setMsg('');
    try{
      const d=await api('/library/',{
        method:'POST',
        body:JSON.stringify({
          movie_id:movie.id,
          status,
          favorite,
          user_rating:rating?Number(rating):null
        })
      });
      setMsg('Сохранено');
      onSaved?.(d);
    }catch(e){
      setMsg(e.message);
    }finally{
      setBusy(false);
    }
  };

  return <div className="library-controls">
    <div className="library-control-grid">
      <label className="control-field">
        <span>Статус</span>
        <select className="form-select" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="planned">Хочу посмотреть</option>
          <option value="watching">Смотрю</option>
          <option value="watched">Просмотрено</option>
          <option value="postponed">Отложено</option>
          <option value="dropped">Брошено</option>
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
          onChange={e=>setRating(e.target.value)}
        />
      </label>

      <button
        type="button"
        className={`btn library-favorite-btn ${favorite?'is-active':''}`}
        onClick={()=>setFavorite(!favorite)}
      >
        {favorite?'♥ Любимое':'♡ В любимое'}
      </button>

      <button className="btn btn-danger library-save-btn" onClick={save} disabled={busy}>
        {busy?'Сохраняю…':'Сохранить'}
      </button>
    </div>

    {msg&&<small className={`library-save-message ${msg==='Сохранено'?'ok':''}`}>{msg}</small>}
  </div>;
}
