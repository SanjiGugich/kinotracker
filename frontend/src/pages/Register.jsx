import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../AuthContext';

export default function Register(){
  const {register}=useAuth();
  const nav=useNavigate();
  const [form,setForm]=useState({first_name:'',username:'',email:'',password:'',password_confirm:''});
  const [err,setErr]=useState('');
  const [busy,setBusy]=useState(false);
  const set=(key)=>(e)=>setForm({...form,[key]:e.target.value});
  const submit=async e=>{e.preventDefault();setErr('');if(form.password!==form.password_confirm){setErr('Пароли не совпадают.');return;}setBusy(true);try{await register(form);nav('/profile');}catch(e){setErr(e.message);}finally{setBusy(false);}};
  return <section className="container page-pad"><div className="auth-card"><span className="eyebrow">КиноТрекер</span><h1>Создать аккаунт</h1><p className="text-secondary">Ваши списки и оценки будут сохранены в системе.</p><form onSubmit={submit}><input className="form-control mb-3" placeholder="Имя (необязательно)" value={form.first_name} onChange={set('first_name')}/><input className="form-control mb-3" placeholder="Логин" required value={form.username} onChange={set('username')}/><input className="form-control mb-3" type="email" placeholder="Email" required value={form.email} onChange={set('email')}/><input className="form-control mb-3" type="password" minLength="6" placeholder="Пароль" required value={form.password} onChange={set('password')}/><input className="form-control mb-3" type="password" minLength="6" placeholder="Повторите пароль" required value={form.password_confirm} onChange={set('password_confirm')}/>{err&&<div className="alert alert-danger py-2">{err}</div>}<button disabled={busy} className="btn btn-danger w-100">{busy?'Создание…':'Создать аккаунт'}</button></form><p className="mt-3 mb-0">Уже есть аккаунт? <Link to="/login">Войти</Link></p></div></section>;}
