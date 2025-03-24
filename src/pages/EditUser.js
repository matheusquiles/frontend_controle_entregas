import React, { useEffect, useState } from 'react';
import { setFormData, setLoading, resetForm, setEditing, setNotification } from '../redux/reducers/FormSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../styles/globalStyles.jsx';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { CssBaseline, Box, Toolbar } from '@mui/material';
import NotificationSnackbar from '../components/NotificacaoSnackbar.js';
import FormButtons from '../components/FormButtons.js';
import AppAppBar from '../components/AppAppBar.js';
import FormUsuariosEdit from '../components/FormUsuariosEdit.js';
import api from '../api/api.js';

const EditUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isLoading = useSelector((state) => state.form.isLoading);
  const formData = useSelector((state) => state.form.formData);
  const invalidFields = useSelector((state) => state.form.invalidFields);
  const isEditing = useSelector((state) => state.form.isEditing);

  const [submitted, setSubmitted] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (dataFetched) return;

    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());

    const fetchUserData = async () => {
      dispatch(setLoading(true));
      try {
        const response = await api.get(`api/users/getById/${id}`);
        const userData = response.data;

        const hierarchyName =
          userData.availableHierarchies?.find(h => h.id === userData.hierarchyId)?.name || '';

        const formDataToSet = {
          idUser: userData.idUser,
          name: userData.name,
          cpf: userData.cpf || '',
          email: userData.email,
          userKey: userData.userKey,
          status: userData.status,
          userType: userData.userType || '',
          idUserType: userData.idUserType || '',
          hierarchy: userData.hierarchyId || '',
          availableHierarchies: userData.availableHierarchies || [],
        };

        dispatch(setFormData(formDataToSet));
        setDataFetched(true);
      } catch (error) {
        let errorMessage = 'Erro ao carregar dados do usuário';
        if (error.response) {
          errorMessage = `Erro ${error.response.status}: ${error.response.data.message || 'Erro desconhecido'}`;
        } else if (error.request) {
          errorMessage = 'Erro: Nenhuma resposta recebida do servidor';
        } else {
          errorMessage = `Erro ao configurar a requisição: ${error.message}`;
        }
        dispatch(setNotification({
          message: errorMessage,
          severity: 'error',
        }));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUserData();
  }, [dispatch, id, dataFetched]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
  
    const requiredFields = ['name', 'userKey', 'email', 'userType'];
    const currentInvalidFields = requiredFields.filter(field => !formData[field]);
  
    if (formData.userType === 'Motoboy' && !formData.hierarchy) {
      currentInvalidFields.push('hierarchy');
    }
  
    if (currentInvalidFields.length > 0) {
      dispatch(setNotification({
        message: 'Existem campos obrigatórios não preenchidos!',
        severity: 'error',
      }));
      return;
    }
  
    dispatch(setEditing(false));
    dispatch(setLoading(true));
  
    try {
      const dataToSend = {
        idUser: formData.idUser,
        name: formData.name,
        userKey: formData.userKey,
        status: formData.status,
        cpf: formData.cpf,
        email: formData.email,
        userType: formData.idUserType, 
        ...(formData.hierarchy && { hierarchy: parseInt(formData.hierarchy) }),
      };
      const response = await api.post(`api/users/editUser`, dataToSend);
  
      if (response.data === true) {
        dispatch(setNotification({ message: 'Usuário atualizado com sucesso!', severity: 'success' }));
        dispatch(setLoading(false));
        dispatch(setEditing(true));
      } else {
        dispatch(setNotification({ message: 'Erro ao atualizar usuário', severity: 'error' }));
        dispatch(setEditing(true));
      }
    } catch (error) {
      if (error.response) {
        const msg = !error.response.data.message ? 'Erro desconhecido' : 'Erro ao atualizar usuário: ' + error.response.data.message;
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
            <FormUsuariosEdit
              submitted={submitted}
              isAdmin={true}
              hierarchies={formData.availableHierarchies || []}
              initialHierarchyId={formData.hierarchy}
            />
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
            <FormButtons handleSubmit={handleSubmit} isLoading={isLoading} enableCancel={false} back={'/usuarios/editar'} />
          </Box>
        </form>
        <NotificationSnackbar />
      </Box>
    </>
  );
};

export default EditUser;