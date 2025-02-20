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
      <AppAppBar onMenuClick={setActiveComponent}/>
      <Toolbar /> {/* Adiciona espaço equivalente ao AppBar */}
      <Box
        component="main"
        sx={{
          p: { xs: 2, md: 3 },
          maxWidth: 'lg',
          mx: 'auto',
        }}
      >
        {activeComponent || "Selecione uma opção"}
      </Box>
    </AppTheme>
  );
};

export default Frame;