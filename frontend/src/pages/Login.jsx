import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {useAuth} from '../AuthContext';


export default function Login() {
  const {login} = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      await login(username, password);
      navigate('/profile');
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="container page-pad">
      <div className="auth-card">
        <span className="eyebrow">КиноТрекер</span>
        <h1>Вход</h1>

        <form onSubmit={submit}>
          <input
            className="form-control mb-3"
            placeholder="Логин или email"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <button type="submit" disabled={busy} className="btn btn-danger w-100">
            {busy ? 'Вход…' : 'Войти'}
          </button>
        </form>

        <p className="mt-3 mb-0">
          Нет аккаунта? <Link to="/register">Регистрация</Link>
        </p>
      </div>
    </section>
  );
}
