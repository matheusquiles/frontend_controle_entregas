import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoading, setNotification, resetForm, setTableData } from '../redux/reducers/FormSlice';
import { CssBaseline, Box, Toolbar } from '@mui/material';
import { LoadingOverlay } from '../styles/globalStyles';
import { FaSpinner } from 'react-icons/fa';
import api from '../api/api';
import { useUser } from '../hooks/useUser';
import AppAppBar from '../components/AppAppBar';
import SearchCollectBar from '../components/lookups/SearchCollectBar';
import CollectTable from '../components/tables/CollectTable';
import FormButtons from '../components/FormButtons';
import NotificationSnackbar from '../components/NotificacaoSnackbar';

const AprovarColetas = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.form.isLoading);
  const formData = useSelector((state) => state.form.formData);
  const isUpdating = useSelector((state) => state.form.isUpdating);
  const tableData = useSelector((state) => state.form.tableData);
  const { user, loading: userLoading } = useUser();

  const handleDataChange = (updatedData) => {
    dispatch(setTableData(updatedData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const updatedTableData = tableData.map(item => ({
      ...item,
      lastModificationBy: user?.idUser || null,
    }));

    try {
      const response = await api.post('api/collects/editCollect', updatedTableData);

      if (response.data === false) {
        const errorData = await response.data;
        throw new Error(errorData.message || 'Erro ao enviar os dados para a API');
      }

      dispatch(setNotification({ message: 'Dados salvos com sucesso!', severity: 'success' }));
    } catch (error) {
      dispatch(setNotification({ message: error.message || 'Erro ao salvar os dados', severity: 'error' }));
      console.error('Erro:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearchComplete = (data) => {
    dispatch(setTableData(data));
  };

  useEffect(() => {
    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());
  }, [dispatch]);

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
          maxWidth: 'xl',
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
            <SearchCollectBar onSearchComplete={handleSearchComplete} />
            <CollectTable data={tableData} onDataChange={handleDataChange} />
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
            <FormButtons
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              isUpdating={isUpdating}
              btEnviar="Salvar"
              back="/home"
            />
          </Box>
        </form>
        <NotificationSnackbar />
      </Box>
    </>
  );
};

export default AprovarColetas;