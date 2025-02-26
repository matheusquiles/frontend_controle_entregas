import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './AppAppBar.js';
import AppTheme from '../styles/theme/AppTheme.js';
import { AppBar, Toolbar, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateCollect from '../pages/createCollect.js';
import { useUser } from '../hooks/useUser';

const Home = (props) => {
  const [activeComponent, setActiveComponent] = useState(null);
  const { user, loading } = useUser();

  console.log('Dados do usuário:', user); // Verifica o que está sendo retornado

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar onMenuClick={setActiveComponent} />
      <Toolbar />
      <Box
        component="main"
        sx={{
          p: { xs: 2, md: 3 },
          maxWidth: 'lg',
          mx: 'auto',
          minHeight: '100vh',
        }}
      >
        <header>
          {loading ? (
            <h1>Carregando...</h1>
          ) : (
            <h1>Bem-vindo, {user?.name || 'Usuário'}!</h1>
          )}
        </header>

        <Routes>
          <Route path="/coletas" element={<CreateCollect />} />
        </Routes>
      </Box>
    </AppTheme>
  );
};

export default Home;