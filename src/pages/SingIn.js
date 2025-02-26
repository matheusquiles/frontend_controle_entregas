import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../styles/theme/AppTheme.js';
import api from '../api/api.js';
import { API_LOGIN } from '../helper/Contants.js';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props) {
  const [loginError, setLoginError] = React.useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loginError || passwordError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    const loginData = {
      userKey: data.get('login'),
      password: data.get('password'),
    };
  
    try {
      const response = await api.post('auth/login', loginData);
      localStorage.setItem('token', response.data.token);
      console.log('Login bem-sucedido:', response.data);
      navigate('/home');
    } catch (error) {
      console.error('Erro no login:', error);
      setLoginError(true);
      setLoginErrorMessage('Erro no login. Verifique suas credenciais.');
    }
  };

  const validateInputs = () => {
    const login = document.getElementById('login');
    const password = document.getElementById('password');

    let isValid = true;

    if (!login.value) {
      setLoginError(true);
      setLoginErrorMessage('Informe um login válido');
      isValid = false;
    } else {
      setLoginError(false);
      setLoginErrorMessage('');
    }

    if (!password.value ) {
      setPasswordError(true);
      setPasswordErrorMessage('Informe uma senha');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          {/* <SitemarkIcon /> */}
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Entrar
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="login">Usuário</FormLabel>
              <TextField
                error={loginError}
                helperText={loginErrorMessage}
                id="login"
                type="login"
                name="login"
                placeholder="seu usuário"
                autoComplete="login"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={loginError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Entrar
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}