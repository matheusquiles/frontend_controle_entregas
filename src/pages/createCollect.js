import React, { useEffect } from 'react';
import { setFormData, setInvalidFields, setSelectedPedidos, resetForm, setUpdating, setNotification } from '../redux/reducers/FormSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as F from '../styles/globalStyles.jsx';

import { CssBaseline, Box, Breadcrumbs, Button, CircularProgress } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import NotificationSnackbar from '../components/NotificacaoSnackbar.js';
import SelectRest from '../components/SelectRest.js';

const CreateCollect = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.form.loading);
  const formData = useSelector((state) => state.form.formData);
  const invalidFields = useSelector((state) => state.form.invalidFields);
  const selectedPedidos = useSelector((state) => state.form.selectedPedidos);
  const isUpdating = useSelector((state) => state.form.isUpdating);

  useEffect(() => {
    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());
  }, [dispatch]);

  const handleChange = (e) => {
    if (e.target && e.target.name && e.target.value !== undefined) {
      const { name, value } = e.target;
      dispatch(setFormData({ [name]: value }));
    } else {
      console.error('Event target is missing name or value:', e.target);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setUpdating(true));

    try {
      // console.log("Dados a serem enviados:", JSON.stringify(dataToSend, null, 2));
      // const response = await axios.post(`${API_SAVE_URL}`, dataToSend);
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      // if (response.data === true) {
      //   dispatch(setNotification({ message: 'Coleta criada com sucesso!', severity: 'success' }));
      // } else {
      //   dispatch(setNotification({ message: 'Erro ao criar coleta', severity: 'error' }));
      // }

    } catch (error) {
      if (error.response) {
        const msg = !error.response.data.message ? 'Erro desconhecido' : 'Erro ao criar coleta' + error.response.data.message;
        dispatch(setNotification({ message: msg, severity: 'error' }));
      } else if (error.request) {
        dispatch(setNotification({ message: 'Erro: Nenhuma resposta recebida do servidor', severity: 'error' }));
      } else {
        dispatch(setNotification({ message: 'Erro ao configurar a requisição: ' + error.message, severity: 'error' }));
      }
    } finally {
      dispatch(setUpdating(false));
    }
  };

  const handleCancelClick = () => {
    dispatch(resetForm());
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="cadastro-coleta-form">
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
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
              height: '100dvh',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Breadcrumbs
                size="sm"
                aria-label="breadcrumbs"
                separator={<ChevronRightRoundedIcon fontSize="sm" />}
                sx={{ pl: 0 }}
              >
              </Breadcrumbs>
            </Box>
            <Box
              sx={{
                display: 'flex',
                mb: 1,
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'start', sm: 'center' },
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              <SelectRest
                label="Endereço"
                first route='edress'
                id='idEdress'
                name='edress'
                onChange={handleChange}
                form={formData}
                defaultValue=""
                invalidFields={invalidFields}
                loading={loading}
              />
            </Box>
          </Box>
        </Box>

        <F.InputLine>
          <Box sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: 2,
            mt: 15,
            mb: 1,
            width: '100%',
            paddingBottom: '30px',
            overflow: 'visible',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-end'
          }}>
            <Button type="button" variant='outlined' onClick={handleCancelClick}>Cancelar</Button>
            <Button type="submit" onClick={handleSubmit} disabled={isUpdating} startDecorator={isUpdating ? <CircularProgress variant="solid" /> : null}>
              {isUpdating ? 'Cadastrando...' : 'Cadastrar Processo'}
            </Button>
          </Box>
        </F.InputLine>
        <NotificationSnackbar />
      </form>
    </>
  );
};

export default CreateCollect;