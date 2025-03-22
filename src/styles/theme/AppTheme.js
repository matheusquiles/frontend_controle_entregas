import * as React from 'react';
import PropTypes from 'prop-types';
import { GlobalStyle } from '../globalStyles.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { colorSchemes, typography, shadows, shape } from './themePrimitives';

const AppTheme = ({ children }) => {
  return (
    <ThemeProvider theme={{}}>
      <GlobalStyle /> {/* Aplique o GlobalStyle */}
      {children}
    </ThemeProvider>
  );
};

export default AppTheme;