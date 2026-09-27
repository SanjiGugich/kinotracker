import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {api} from '../api';
import {useAuth} from '../AuthContext';

export default function Profile(){
  const {user,loading,refreshUser}=useAuth();
  const [data,setData]=useState(null);
  const [form,setForm]=useState(null);
  const [msg,setMsg]=useState('');

  useEffect(()=>{if(user)api('/auth/profile/').then(d=>{setData(d);setForm(d.user);});},[user]);

  if(loading)return null;
  if(!user)return <section className="container page-pad"><h1>Профиль</h1><p>Чтобы открыть профиль, <Link to="/login">войдите</Link>.</p></section>;
  if(!data||!form)return <section className="container page-pad">Загрузка профиля…</section>;

  const save=async e=>{
    e.preventDefault();
    setMsg('');
    try{
      const d=await api('/auth/profile/',{method:'PATCH',body:JSON.stringify({username:form.username,email:form.email,first_name:form.first_name})});
      setData(d);setForm(d.user);await refreshUser();setMsg('Профиль сохранён.');
    }catch(e){setMsg(e.message);}
  };

  const s=data.stats;
  return <section className="container page-pad">
    <div className="profile-head">
      <div>
        <span className="eyebrow">Личный кабинет</span>
        <h1>{data.user.first_name||data.user.username}</h1>
        <p className="text-secondary">Аккаунт хранится в базе КиноТрекера. Ваши списки доступны после любого следующего входа.</p>
      </div>
      <Link className="btn btn-outline-light" to="/library">Мой список</Link>
    </div>

    <div className="profile-stats my-4">
      <div><strong>{s.total}</strong><span>в списках</span></div>
      <div><strong>{s.watched}</strong><span>просмотрено</span></div>
      <div><strong>{s.favorites}</strong><span>любимое</span></div>
      <div><strong>{s.average_rating?Number(s.average_rating).toFixed(1):'—'}</strong><span>средняя оценка</span></div>
    </div>

    <div className="row g-4">
      <div className="col-lg-7">
        <div className="content-card">
          <h2 className="h4">Данные профиля</h2>
          <form onSubmit={save}>
            <label className="form-label mt-2">Имя</label>
            <input className="form-control" value={form.first_name||''} onChange={e=>setForm({...form,first_name:e.target.value})}/>
            <label className="form-label mt-3">Логин</label>
            <input className="form-control" value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/>
            <label className="form-label mt-3">Email</label>
            <input className="form-control" type="email" value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})}/>
            <button className="btn btn-danger mt-3">Сохранить</button>
            {msg&&<div className="small text-secondary mt-2">{msg}</div>}
          </form>
        </div>
      </div>
      <div className="col-lg-5">
        <div className="content-card">
          <h2 className="h4">Статистика</h2>
          <p>Хочу посмотреть: <strong>{s.planned}</strong></p>
          <p>Смотрю: <strong>{s.watching}</strong></p>
          <p>Просмотрено: <strong>{s.watched}</strong></p>
          <p>Отложено: <strong>{s.postponed}</strong></p>
          <p>Брошено: <strong>{s.dropped}</strong></p>
          <p>Любимое: <strong>{s.favorites}</strong></p>
          <p className="mb-0">Дата регистрации: <strong>{new Date(data.user.date_joined).toLocaleDateString('ru-RU')}</strong></p>
        </div>
      </div>
    </div>
  </section>;
}
