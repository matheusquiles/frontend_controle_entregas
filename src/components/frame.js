import React, { useState } from 'react';
import * as F from '../styles/frame.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './AppAppBar.js';
import AppTheme from '../styles/theme/AppTheme.js';
import Grid2 from '@mui/material/Grid2';
import { AppBar, Toolbar, Box } from '@mui/material';
import { CssVarsProvider } from '@mui/joy/styles';

const Frame = (props) => {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <AppTheme  {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar onMenuClick={setActiveComponent} />
      <Toolbar /> {/* Adiciona espaço equivalente ao AppBar */}
      <Box
        component="main"
        sx={{
          p: { xs: 2, md: 3 },
          maxWidth: 'lg',
          mx: 'auto',
          // background: 'linear-gradient(135deg, rgba(255, 191, 38, 0.5) 0%, rgba(238, 224, 191, 0.96)40%,  #FFFFFF 100%)', // Gradiente de cima (#FFBF26) para baixo (branco)
          minHeight: '100vh', // Garante que o gradiente cubra a tela inteira
        }}
      >
        {activeComponent || 'Selecione uma opção'}
      </Box>
    </AppTheme>
  );
};

export default Frame;