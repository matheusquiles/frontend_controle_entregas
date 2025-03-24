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
import SearchUserBar from '../components/lookups/SearchUserBar.js';
import TableUsers from '../components/tables/TableUsers.js';

const SearchUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.form.isLoading);
  const formData = useSelector((state) => state.form.formData);
  const isUpdating = useSelector((state) => state.form.isUpdating);
  const tableData = useSelector((state) => state.form.tableData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setLoading(false));
  };

  const handleSearchComplete = (data) => {
    dispatch(setTableData(data));
  };

  const handleEdit = (idUser) => {
    dispatch(setEditing(true));
    navigate(`/usuarios/editar/${idUser}`);
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
            <SearchUserBar onSearchComplete={handleSearchComplete} />
            <TableUsers data={tableData} onEdit={handleEdit} />
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
            />
          </Box>
        </form>
        <NotificationSnackbar />
      </Box>
    </>
  );
};

export default SearchUser;