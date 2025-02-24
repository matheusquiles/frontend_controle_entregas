import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './AppAppBar.js';
import AppTheme from '../styles/theme/AppTheme.js';
import { AppBar, Toolbar, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateCollect from '../pages/createCollect.js';

const Home = (props) => {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <AppTheme  {...props}>
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
        <Routes>
          <Route path="/coletas" element={<CreateCollect />} />
        </Routes>
      </Box>
    </AppTheme>
  );
};

export default Home;