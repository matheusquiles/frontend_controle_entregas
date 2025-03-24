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
          height: 'calc(100vh - 64px)', // Subtrai a altura do AppBar/Toolbar (ajuste se necessário)
          display: 'flex',
          flexDirection: 'column',
          color: 'black',
          p: { xs: 2, md: 3 },
          maxWidth: 'lg',
          mx: 'auto',
        }}
      >
        <form onSubmit={handleSubmit} className="cadastro-usuario-form" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {isLoading && (
            <LoadingOverlay>
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </LoadingOverlay>
          )}
          <Box
            sx={{
              flexGrow: 1, // Faz o conteúdo principal crescer para ocupar o espaço disponível
              display: 'flex',
              flexDirection: 'column',
              px: { xs: 2, md: 6 },
              py: 2,
              overflow: 'auto', // Rolagem interna se o conteúdo exceder
            }}
          >
            <FormUsuarios submitted={submitted} newUser={true} isAdmin={isAdmin} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              width: '100%',
              p: 2,
              borderTop: '1px solid #e0e0e0',
              backgroundColor: '#fff',
              justifyContent: 'flex-end',
              flexShrink: 0, // Impede que o rodapé encolha
              position: 'sticky', // Fixa o rodapé no fundo
              bottom: 0,
            }}
          >
            <FormButtons handleSubmit={handleSubmit} isLoading={isLoading} />
          </Box>
        </form>
        <NotificationSnackbar />
      </Box>
    </>
  );
};

export default NovoUsuario;