import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFormData,
  setLoading,
  resetForm,
  setEditing,
  setNotification,
  setUpdating,
  setTableData,
} from '../redux/reducers/FormSlice.js';
import { LoadingOverlay } from '../styles/globalStyles.jsx';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Box, Toolbar } from '@mui/material';
import NotificationSnackbar from '../components/NotificacaoSnackbar.js';
import FormButtons from '../components/FormButtons.js';
import AppAppBar from '../components/AppAppBar.js';
import AddressTable from '../components/tables/AddressTable.js';
import SearchAddressBar from '../components/lookups/SearchAddressBar.js';

const SearchAddress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.form.isLoading);
  const formData = useSelector((state) => state.form.formData);
  const isUpdating = useSelector((state) => state.form.isUpdating);
  const tableData = useSelector((state) => state.form.tableData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      // Simulação de envio para a API com os dados da tabela
      const response = await fetch('/api/addresses', {
        method: 'POST', // ou 'PUT' se for atualização
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tableData), // Envia os dados atualizados da tabela
      });

      if (response.ok) {
        dispatch(setNotification({ message: 'Dados salvos com sucesso!', severity: 'success' }));
      } else {
        throw new Error('Erro ao salvar os dados');
      }
    } catch (error) {
      dispatch(setNotification({ message: error.message, severity: 'error' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearchComplete = (data) => {
    dispatch(setTableData(data));
  };

  const handleEdit = (idUser) => {
    dispatch(setEditing(true));
    navigate(`/usuarios/editar/${idUser}`); // handleEdit apenas redireciona, sem salvar
  };

  const handleDataChange = (updatedData) => {
    dispatch(setTableData(updatedData)); // Atualiza o estado com as alterações da tabela
  };

  useEffect(() => {
    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());
  }, [dispatch]);

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
              <SearchAddressBar onSearchComplete={handleSearchComplete} />
              <AddressTable data={tableData} onDataChange={handleDataChange} />
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
            />
          </Box>
        </form>
        <NotificationSnackbar />
      </Box>
    </>
  );
};

export default SearchAddress;