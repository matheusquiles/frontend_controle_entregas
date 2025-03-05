// useUser.js
import { useEffect, useState } from 'react';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Adiciona estado para o token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(storedToken);
        if (!decodedToken.exp || decodedToken.exp < Date.now() / 1000) {
          console.warn('Token expirado');
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
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
        setToken(storedToken); // Armazena o token no estado
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, token, loading }; // Retorna o token junto com user e loading
};