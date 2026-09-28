import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {useAuth} from '../AuthContext';


const INITIAL_FORM = {
  first_name: '',
  username: '',
  email: '',
  password: '',
  password_confirm: '',
};


export default function Register() {
  const {register} = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.password_confirm) {
      setError('Пароли не совпадают.');
      return;
    }

    setBusy(true);

    try {
      await register(form);
      navigate('/profile');
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="container page-pad">
      <div className="auth-card">
        <span className="eyebrow">КиноТрекер</span>
        <h1>Создать аккаунт</h1>
        <p className="text-secondary">Ваши списки и оценки будут сохранены в системе.</p>

        <form onSubmit={submit}>
          <input
            className="form-control mb-3"
            placeholder="Имя (необязательно)"
            value={form.first_name}
            onChange={updateField('first_name')}
            autoComplete="given-name"
          />

          <input
            className="form-control mb-3"
            placeholder="Логин"
            value={form.username}
            onChange={updateField('username')}
            autoComplete="username"
            required
          />

          <input
            className="form-control mb-3"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={updateField('email')}
            autoComplete="email"
            required
          />

          <input
            className="form-control mb-3"
            type="password"
            minLength="6"
            placeholder="Пароль"
            value={form.password}
            onChange={updateField('password')}
            autoComplete="new-password"
            required
          />

          <input
            className="form-control mb-3"
            type="password"
            minLength="6"
            placeholder="Повторите пароль"
            value={form.password_confirm}
            onChange={updateField('password_confirm')}
            autoComplete="new-password"
            required
          />

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <button type="submit" disabled={busy} className="btn btn-danger w-100">
            {busy ? 'Создание…' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="mt-3 mb-0">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </section>
  );
}
