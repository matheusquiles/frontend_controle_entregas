import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './AppAppBar.js';
import AppTheme from '../styles/theme/AppTheme.js';
import { Toolbar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const Home = (props) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [cachedUserName, setCachedUserName] = useState(localStorage.getItem('userName') || 'Usuário');

  useEffect(() => {
    if (user?.name) {
      localStorage.setItem('userName', user.name);
      setCachedUserName(user.name);
    }
  }, [user]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Toolbar />
      <Box
        component="main"
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, md: 3 },
          maxWidth: 'lg',
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            flexGrow: 1, 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
          }}
        >
          <header>
            {loading ? (
              <h1>Carregando...</h1>
            ) : (
              <div>
                <h1>Bem-vindo, {cachedUserName}!</h1>
              </div>
            )}
          </header>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Home;