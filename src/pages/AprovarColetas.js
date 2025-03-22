import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoading, setNotification, resetForm, setTableData } from '../redux/reducers/FormSlice'; // Adicione setTableData
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
  const tableData = useSelector((state) => state.form.tableData); // Acesse o tableData do formSlice
  const { user, loading: userLoading } = useUser();

  const handleDataChange = (updatedData) => {
    dispatch(setTableData(updatedData)); // Atualiza os dados da tabela no formSlice
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const updatedTableData = tableData.map(item => ({
      ...item,
      lastModificationBy: user?.idUser || null,
    }));

    console.log('Data to send', updatedTableData);

    try {
      const response = await api.post('api/collects/editCollect', updatedTableData);

      if (response.data === false) {
        const errorData = await response.data;
        throw new Error(errorData.message || 'Erro ao enviar os dados para a API');
      }

      const result = response.data;
      dispatch(setNotification({ message: 'Dados salvos com sucesso!', severity: 'success' }));
      console.log('Resposta da API:', result);
    } catch (error) {
      dispatch(setNotification({ message: error.message || 'Erro ao salvar os dados', severity: 'error' }));
      console.error('Erro:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearchComplete = (data) => {
    dispatch(setTableData(data)); // Atualiza os dados da tabela no formSlice
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
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          color: 'black',
          p: { xs: 2, md: 3 },
          maxWidth: 'xl',
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
              <SearchCollectBar onSearchComplete={handleSearchComplete} />
              <CollectTable data={tableData} onDataChange={handleDataChange} />
            </Box>
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
              position: 'sticky',
              bottom: 0,
              color: 'black',
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