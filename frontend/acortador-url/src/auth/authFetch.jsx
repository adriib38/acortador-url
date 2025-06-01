import { useAuth } from '../auth/AuthContext';
import { refresh } from '../services/authService';

export const useAuthFetch = () => {
  const { accessToken, logout } = useAuth();

  const authFetch = async (url, options = {}) => {
    const token = accessToken;

    const fetchWithToken = async (tokenToUse) => {
      return await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${tokenToUse}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    };

    let res = await fetchWithToken(token);
    if (res.status === 401) {
      try {
        let response_refresh = await refresh();
        let newAccessToken = response_refresh.data.access_token;

        // Actualizar cookie access token
        document.cookie = `access_token=${newAccessToken}; path=/; max-age=3600;`;
        res = await fetchWithToken(newAccessToken);
      } catch (err) {
        logout();
        console.log('Error al refrescar el token:', err);
        throw new Error('Sesión expirada. Redirigiendo al login...');
      }
    }

    if (!res.ok) {
      let errorData = {};
      try {
        errorData = await res.json();
      } catch (e) {
        // Si no es JSON, ignora
      }
      throw new Error(errorData.message || 'Error en la petición');
    }
    return res;
  };

  
  return authFetch;
};
