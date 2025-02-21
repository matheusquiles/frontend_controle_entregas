import React, { useEffect } from 'react';
import { setFormData, setInvalidFields, setSelectedPedidos, resetForm, setUpdating, setNotification } from '../redux/reducers/FormSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as F from '../styles/globalStyles.jsx';
import { LoadingOverlay } from '../styles/globalStyles.jsx';

import { CssBaseline, Box, Button, CircularProgress } from '@mui/material';
import NotificationSnackbar from '../components/NotificacaoSnackbar.js';
import SelectRest from '../components/SelectRest.js';
import LoaderComponent from '../components/LoaderComponent.js';
import Input from '../components/input.js';
import { API_SAVE_URL } from '../helper/Contants.js';
import camelCase from '../helper/camelCase.js';
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../styles/Colors.jsx';


const CreateCollect = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.form.loading);
  const formData = useSelector((state) => state.form.formData);
  const invalidFields = useSelector((state) => state.form.invalidFields);
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
      const camelCaseFormData = camelCase.convertKeysToCamelCase(formData);
      const dataToSend = {
        date: new Date().toISOString().split('T')[0], // Preenche a data atual
        status: true, // Padrão true
        userId: {
          idUser: 6 // Padrão 24
        },
        edress: {
          idEdress: parseInt(camelCaseFormData.edress) // Recebendo da tela
        },
        itens: [
          {
            collectType: {
              idCollectType: parseInt(camelCaseFormData.collectType) // Recebendo da tela
            },
            quantity: parseInt(camelCaseFormData.quantity), // Recebendo da tela
            deliveryStatus: true // Padrão true
          }
        ]
      };

      console.log("Dados a serem enviados:", JSON.stringify(dataToSend, null, 2));
      const response = await axios.post(`${API_SAVE_URL}`, dataToSend);

      if (response.data === true) {
       dispatch(setNotification({ message: 'Coleta criada com sucesso!', severity: 'success' }));
      } else {
        dispatch(setNotification({ message: 'Erro ao criar coleta', severity: 'error' }));
      }

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
        {loading && <LoaderComponent />}
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', color: 'black' }}>
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
              <F.InputLine column>
                <Box mb={2} width={'100%'}>
                  <F.InputLine>
                    <SelectRest
                      label="Endereço"
                      first
                      route='edress'
                      id='idEdress'
                      name='edress'
                      onChange={handleChange}
                      form={formData}
                      defaultValue=""
                      invalidFields={invalidFields}
                      loading={loading}
                    />
                  </F.InputLine>
                </Box>

                <F.InputLine>
                  <Box mb={2} width={'100%'}>
                    <F.MediumInputLine>
                      <SelectRest
                        label="Tipo de Coleta"
                        first
                        route='collectType'
                        id='idCollectType'
                        name='description'
                        onChange={handleChange}
                        form={formData}
                        defaultValue=""
                        invalidFields={invalidFields}
                        loading={loading}
                      />
                    </F.MediumInputLine>
                  </Box>
                </F.InputLine>

                <F.InputLine>
                  <Box mb={2} width={'100%'}>
                    <F.MediumInputLine>
                      <Input
                        first label="Quantidade de entregas"
                        fieldName="quantity"
                        formData={formData}
                        setFormData={setFormData}
                        onChange={handleChange}
                        invalidFields={invalidFields}
                      />
                    </F.MediumInputLine>
                  </Box>
                </F.InputLine>
              </F.InputLine>
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
            <Button 
              type="button" 
              variant='outlined' 
              onClick={handleCancelClick}
              sx={{ color: `${MAIN_YELLOW}`, borderColor: `${MAIN_YELLOW}` }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit} 
              disabled={isUpdating} 
              startDecorator={isUpdating ? <CircularProgress variant="solid" /> : null}
              sx={{ bgcolor: MAIN_YELLOW, color: MAIN_FONT_COLLOR }} variant="contained"
            >
              {isUpdating ? 'Cadastrando...' : 'Cadastrar Processo'}
            </Button>
          </Box>
        </Box>

        <NotificationSnackbar />
      </form >
    </>
  );
};

export default CreateCollect;