import { useEffect, useState } from 'react';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        if (!decodedToken.exp || decodedToken.exp < Date.now() / 1000) {
          console.warn('Token expirado');
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
          return;
        }

        const userKey = decodedToken.userKey || decodedToken.sub;
        if (!userKey) {
          console.error('userKey não encontrada no token.');
          setLoading(false);
          return;
        }

        const response = await api.get(`api/users/searchUser/${userKey}`);
        setUser(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
