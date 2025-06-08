import { createContext, useState, useEffect, useContext } from 'react';
import { 
  getUser, 
  login as loginService,
  logout as logoutService,
  refresh as refreshService
} from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Al iniciar, recuperar usuario de localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.username && storedUser.access_token) {
      setUsername(storedUser.username);
      setAccessToken(storedUser.access_token);
    }
  }, []);

  const login = async (credentials) => {
    const response = await loginService(credentials);
    const username = response.data.user;
    const token = response.data.access_token;
    setUsername(username);
    setAccessToken(token);
    document.cookie = `access_token=${token}; path=/; max-age=3600;`;
    // Guardar usuario en localStorage
    localStorage.setItem('user', JSON.stringify({
      username,
      access_token: token
    }));
  };

  const refresh = async () => {
    try {
      const response = await refreshService(); // debe incluir credentials: 'include'
      const token = response.data.access_token;
      const username = response.data.user;
      setAccessToken(token);
      setUsername(username);
      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify({
        username,
        access_token: token
      }));
    } catch (error) {
      logout(); // si falla el refresh, cerramos sesión
    }
  };

  const logout = async () => {
    await logoutService();
    setUsername(null);
    setAccessToken(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        accessToken,
        isAuthenticated: !!username,
        login,
        logout,
        refresh,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
