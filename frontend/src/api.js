const rawBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const API = rawBase.replace(/\/$/, '');

export const token = () => localStorage.getItem('kinotracker_token');


export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token()) {
    headers.Authorization = `Token ${token()}`;
  }

  let response;
  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Сервер КиноТрекера недоступен. Попробуйте ещё раз позже.');
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const details = (
      data.detail
      || Object.values(data).flat().join(' ')
      || `Ошибка ${response.status}`
    );
    throw new Error(details);
  }

  return data;
}

export {API};
