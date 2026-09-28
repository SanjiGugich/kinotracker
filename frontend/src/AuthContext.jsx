import {createContext, useContext, useEffect, useState} from 'react';

import {api} from './api';


const AuthContext = createContext(null);


export function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const currentUser = await api('/auth/me/');
    setUser(currentUser);
    return currentUser;
  };

  useEffect(() => {
    if (!localStorage.getItem('kinotracker_token')) {
      setLoading(false);
      return;
    }

    refreshUser()
      .catch(() => {
        localStorage.removeItem('kinotracker_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const data = await api('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({username, password}),
    });
    localStorage.setItem('kinotracker_token', data.token);
    setUser(data.user);
  };

  const register = async (form) => {
    const data = await api('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    localStorage.setItem('kinotracker_token', data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api('/auth/logout/', {method: 'POST'});
    } catch {
      // Локальный выход всё равно должен сработать, даже если backend недоступен.
    }

    localStorage.removeItem('kinotracker_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => useContext(AuthContext);
