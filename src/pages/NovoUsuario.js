import React, { useEffect, useState } from 'react';
import { setFormData, setLoading, resetForm, setEditing, setNotification } from '../redux/reducers/FormSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../styles/globalStyles.jsx';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Box, Toolbar } from '@mui/material';
import NotificationSnackbar from '../components/NotificacaoSnackbar.js';
import FormButtons from '../components/FormButtons.js';
import AppAppBar from '../components/AppAppBar.js';
import FormUsuarios from '../components/FormUsuarios.js';
import api from '../api/api.js';
import { useUser } from '../hooks/useUser.js';
import { jwtDecode } from 'jwt-decode';

const NovoUsuario = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.form.isLoading);
  const formData = useSelector((state) => state.form.formData);
  const invalidFields = useSelector((state) => state.form.invalidFields);
  const isEditing = useSelector((state) => state.form.isEditing);

  const { user, token, loading: userLoading, error: userError } = useUser(); 
  const [submitted, setSubmitted] = useState(false);

  const decodedToken = token ? jwtDecode(token) : null;
  const userRoles = Array.isArray(decodedToken?.roles) ? decodedToken.roles : [decodedToken?.role].filter(Boolean);
  const isAdmin = userRoles.includes('ADMIN');

  useEffect(() => {
    if (userLoading) return;

    if (!user && !token) {
      dispatch(setNotification({ message: 'Usuário não autenticado. Faça login novamente.', severity: 'error' }));
      navigate('/');
      return;
    }
    if (userError) {
      dispatch(setNotification({ message: userError, severity: 'error' }));
      return;
    }

    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());

    if (!isAdmin && user) {
      dispatch(setFormData({ 
        ...formData, 
        ['users/searchCordinator']: user.idUser,
        description: 'Motoboy',
        idUserType: 3 // Assumindo que 3 é o idUserType para "Motoboy"
      }));
    }
  }, [dispatch, user, token, userLoading, isAdmin, navigate, userError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
  
    const requiredFields = ['nome', 'userKey', 'email', 'password', 'description'];
    let currentInvalidFields = requiredFields.filter(field => !formData[field]);
  
    if (isAdmin && formData.description === 'Motoboy' && !formData['users/searchCordinator']) {
      currentInvalidFields = [...currentInvalidFields, 'users/searchCordinator'];
    }
  
    const passwordsMatch = formData.password === formData.confirmPassword;
  
    if (currentInvalidFields.length > 0 || !passwordsMatch) {
      dispatch(setNotification({
        message: currentInvalidFields.length > 0 
          ? 'Existem campos obrigatórios não preenchidos!' 
          : 'As senhas não correspondem!',
        severity: 'error'
      }));
      return;
    }
  
    dispatch(setEditing(false));
    dispatch(setLoading(true));
  
    try {
      const dataToSend = {
        name: formData.nome,
        userKey: formData.userKey,
        cpf: formData.cpf,
        email: formData.email,
        password: formData.password,
        userType: formData.idUserType,
        ...(formData['users/searchCordinator'] && {
          hierarchy: parseInt(formData['users/searchCordinator']) // Envia apenas o ID como integer
        })
      };
  
      if (!isAdmin && formData.description === 'Motoboy' && !formData['users/searchCordinator']) {
        dataToSend.hierarchy = user.idUser;
      }
  
      console.log("Dados a serem enviados:", JSON.stringify(dataToSend, null, 2));
      const response = await api.post('api/users/saveUser', dataToSend);
  
      if (response.data === true) {
        dispatch(setNotification({ message: 'Usuário criado com sucesso!', severity: 'success' }));
        dispatch(setLoading(false));
      } else {
        dispatch(setNotification({ message: 'Erro ao criar usuário', severity: 'error' }));
        dispatch(setEditing(true));
      }
    } catch (error) {
      if (error.response) {
        const msg = !error.response.data.message ? 'Erro desconhecido' : 'Erro ao criar usuário: ' + error.response.data.message;
        dispatch(setNotification({ message: msg, severity: 'error' }));
      } else if (error.request) {
        dispatch(setNotification({ message: 'Erro: Nenhuma resposta recebida do servidor', severity: 'error' }));
      } else {
        dispatch(setNotification({ message: 'Erro ao configurar a requisição: ' + error.message, severity: 'error' }));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (userLoading) {
    return (
      <LoadingOverlay>
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </LoadingOverlay>
    );
  }

  return (
    <>
      <CssBaseline />
      <AppAppBar />
      <Toolbar />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          color: 'black',
          p: { xs: 2, md: 3 },
          maxWidth: 'lg',
          mx: 'auto',
        }}
      >
        <form onSubmit={handleSubmit} className="cadastro-usuario-form">
          {isLoading && (
            <LoadingOverlay>
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </LoadingOverlay>
          )}
          <Box sx={{ flexGrow: 1, display: 'flex', minHeight: '100dvh' }}>
            <Box
              component="main"
              className="MainContent"
              sx={{
                px: { xs: 2, md: 6 },
                pt: {
                  xs: 'calc(12px + var(--Header-height))',
                  sm: 'calc(12px + var(--Header-height))',
                  md: 3,
                },
                pb: { xs: 2, sm: 2, md: 3 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                gap: 1,
                color: 'black',
              }}
            >
              <FormUsuarios submitted={submitted} newUser={true} isAdmin={isAdmin} />
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            gap: 2,
            width: '100%',
            p: 2,
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#fff',
            justifyContent: 'flex-end',
            position: 'sticky',
            bottom: 0,
            color: 'black',
          }}>
            <FormButtons handleSubmit={handleSubmit} isLoading={isLoading} />
          </Box>
        </form>
        <NotificationSnackbar />
      </Box>
    </>
  );
};

export default NovoUsuario;