import { useEffect, useState } from 'react';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
          throw new Error('Nenhum token encontrado no localStorage.');
        }

        const decodedToken = jwtDecode(storedToken);

        if (!decodedToken.exp || decodedToken.exp < Date.now() / 1000) {
          localStorage.removeItem('token');
          throw new Error('Token expirado.');
        }

        const userKey = decodedToken.userKey || decodedToken.sub;
        if (!userKey) {
          throw new Error('userKey não encontrada no token.');
        }

        const response = await api.get(`api/users/searchUser/${userKey}`);
        setUser(response.data);
        setToken(storedToken);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error.message);
        setError(error.message || 'Erro ao carregar usuário. Tente novamente.');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, token, loading, error }; 
};