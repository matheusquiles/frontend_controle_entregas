import { useEffect, useState } from 'react';
import api from '../api/api';
import { jwtDecode } from 'jwt-decode';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null); // Armazena a role

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
          throw new Error('Nenhum token encontrado no localStorage.');
        }

        const decodedToken = jwtDecode(storedToken);
        console.log("Token Decodificado:", decodedToken); // Verifica o que está vindo

        if (!decodedToken.exp || decodedToken.exp < Date.now() / 1000) {
          localStorage.removeItem('token');
          throw new Error('Token expirado.');
        }

        const userKey = decodedToken.userKey || decodedToken.sub;
        const userRole = decodedToken.role || null; // Pegando a role do token

        if (!userKey) {
          throw new Error('userKey não encontrada no token.');
        }

        const response = await api.get(`api/users/searchUser/${userKey}`);
        const userData = response.data;

        setUser({ ...userData, userType: userRole }); // Adiciona a role ao usuário
        setRole(userRole);
        setToken(storedToken);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error.message);
        setError(error.message || 'Erro ao carregar usuário. Tente novamente.');
        setUser(null);
        setToken(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, token, role, loading, error };
};
