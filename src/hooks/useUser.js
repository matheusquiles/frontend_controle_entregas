import { useEffect, useState } from 'react';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para armazenar erros

  useEffect(() => {
    const fetchUser = async () => {
      console.log('Iniciando fetchUser...');
      try {
        const storedToken = localStorage.getItem('token');
        console.log('Token armazenado:', storedToken);

        if (!storedToken) {
          throw new Error('Nenhum token encontrado no localStorage.');
        }

        const decodedToken = jwtDecode(storedToken);
        console.log('Token decodificado:', decodedToken);

        if (!decodedToken.exp || decodedToken.exp < Date.now() / 1000) {
          localStorage.removeItem('token');
          throw new Error('Token expirado.');
        }

        const userKey = decodedToken.userKey || decodedToken.sub;
        if (!userKey) {
          throw new Error('userKey não encontrada no token.');
        }

        console.log('Buscando usuário com userKey:', userKey);
        const response = await api.get(`api/users/searchUser/${userKey}`);
        console.log('Resposta da API:', response.data);
        setUser(response.data);
        setToken(storedToken);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error.message);
        setError(error.message || 'Erro ao carregar usuário. Tente novamente.');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
        console.log('Carregamento concluído. User:', user, 'Token:', token, 'Loading:', loading, 'Error:', error);
      }
    };

    fetchUser();
  }, []);

  return { user, token, loading, error }; // Retorna o erro junto com os outros estados
};