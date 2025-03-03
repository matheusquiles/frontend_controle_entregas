import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setRole(decodedToken.role || null);
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return { isAuthenticated, role };
}
