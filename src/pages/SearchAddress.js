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
import { API_EDIT_ADDRESS } from '../helper/Constants.js';
import api from '../api/api.js';
import { useUser } from '../hooks/useUser.js';

const SearchAddress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.form.isLoading);
  const formData = useSelector((state) => state.form.formData);
  const isUpdating = useSelector((state) => state.form.isUpdating);
  const tableData = useSelector((state) => state.form.tableData);
  const { user, loading: userLoading } = useUser();

  const transformTableDataForAPI = (tableData, user) => {
    const groupedData = tableData.reduce((acc, item) => {
      const { idEdress, description, edress, status, idCollectPreValue, idCollectType, collectType, preValue } = item;

      if (!acc[idEdress]) {
        acc[idEdress] = {
          idEdress,
          description,
          edress,
          status,
          lastModificationBy: user?.idUser || null,
          collectPreValue: [],
        };
      }

      if (idCollectPreValue && collectType !== '-') {
        acc[idEdress].collectPreValue.push({
          idCollectPreValue,
          idEdress,
          edress,
          idCollectType,
          collectType,
          preValue,
        });
      }

      return acc;
    }, {});

    return Object.values(groupedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const updatedTableData = transformTableDataForAPI(tableData, user);
    console.log('updatedTableData:', updatedTableData);

    try {
      const response = await api.post(API_EDIT_ADDRESS, updatedTableData);

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

  const flattenAddressData = (data) => {
    return data.flatMap((item) => {
      if (!item.collectPreValue && item.idCollectType) {
        return [{
          idEdress: item.idEdress,
          description: item.description,
          edress: item.edress,
          status: item.status,
          idCollectPreValue: item.idCollectPreValue || `empty-${item.idEdress}`,
          idCollectType: item.idCollectType,
          collectType: item.collectType || '-',
          preValue: item.preValue || null,
        }];
      }

      if (!item.collectPreValue || item.collectPreValue.length === 0) {
        return [{
          idEdress: item.idEdress,
          description: item.description,
          edress: item.edress,
          status: item.status,
          idCollectPreValue: `empty-${item.idEdress}`,
          collectType: '-',
          preValue: null,
        }];
      }

      return item.collectPreValue.map((collect) => ({
        idEdress: item.idEdress,
        description: item.description,
        edress: item.edress,
        status: item.status,
        idCollectPreValue: collect.idCollectPreValue,
        idCollectType: collect.idCollectType,
        collectType: collect.collectType || '-',
        preValue: collect.preValue || null,
      }));
    });
  };

  const handleSearchComplete = (apiData) => {
    const formatted = flattenAddressData(apiData);
    dispatch(setTableData(formatted));
  };

  const handleDataChange = (updatedData) => {
    console.log("Dados atualizados recebidos da tabela:", updatedData);
    const formattedData = flattenAddressData(updatedData);
    dispatch(setTableData(formattedData));
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
          height: 'calc(100vh - 64px)',
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
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              px: { xs: 2, md: 6 },
              py: 2,
              overflow: 'auto',
            }}
          >
            <SearchAddressBar onSearchComplete={handleSearchComplete} />
            <AddressTable data={tableData} onDataChange={handleDataChange} />
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
              flexShrink: 0,
              position: 'sticky',
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

export default SearchAddress;