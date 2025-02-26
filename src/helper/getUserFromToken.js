import { jwtDecode } from 'jwt-decode';

export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
};