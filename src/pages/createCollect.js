import React, { useEffect, useState } from 'react';
import { setFormData, setLoading, resetForm, setEditing, setNotification, setUpdating } from '../redux/reducers/FormSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as F from '../styles/globalStyles.jsx';
import { LoadingOverlay } from '../styles/globalStyles.jsx';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { CssBaseline, Box, IconButton, Toolbar } from '@mui/material';
import NotificationSnackbar from '../components/NotificacaoSnackbar.js';
import SelectRest from '../components/SelectRest.js';
import SelectRestCollect from '../components/SelectRestCollect.js';
import Input from '../components/input.js';
import { API_SAVE_URL } from '../helper/Contants.js';
import camelCase from '../helper/camelCase.js';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useUser } from '../hooks/useUser';
import FormButtons from '../components/FormButtons.js';
import AppAppBar from '../components/AppAppBar.js';

const CreateCollect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.form.isLoading);
  const loading = useSelector((state) => state.form.loading);
  const formData = useSelector((state) => state.form.formData);
  const invalidFields = useSelector((state) => state.form.invalidFields);
  const isUpdating = useSelector((state) => state.form.isUpdating);
  const isEditing = useSelector((state) => state.form.isEditing);
  const { user } = useUser();

  const [items, setItems] = useState([{ collectType: '', quantity: '' }]);

  useEffect(() => {
    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());
  }, [dispatch]);

  const handleChange = (e, index) => {
    const { name, value, selectedOption } = e.target;
    const newItems = [...items];

    if (name === 'description') {
      newItems[index]['collectType'] = selectedOption ? selectedOption.id : value;
    } else {
      newItems[index][name] = value;
    }

    setItems(newItems);
  };

  const handleAddFields = () => {
    setItems([...items, { collectType: '', quantity: '' }]);
  };

  const handleRemoveFields = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setEditing(false));
    dispatch(setUpdating(true));
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 2000);

    try {
      const camelCaseFormData = camelCase.convertKeysToCamelCase(formData);
      const dataToSend = {
        date: new Date().toISOString().split('T')[0],
        status: true,
        userId: {
          idUser: user?.idUser
        },
        edress: {
          idEdress: parseInt(camelCaseFormData.edress)
        },
        itens: items.map(item => ({
          collectType: {
            idCollectType: parseInt(item.collectType)
          },
          quantity: parseInt(item.quantity),
          deliveryStatus: false
        }))
      };

      await new Promise((resolve) => setTimeout(resolve, 3000));

      console.log("Dados a serem enviados:", JSON.stringify(dataToSend, null, 2));
      const response = await axios.post(`${API_SAVE_URL}`, dataToSend);

      if (response.data === true) {
        dispatch(setNotification({ message: 'Coleta criada com sucesso!', severity: 'success' }));
        dispatch(setLoading(false));
      } else {
        dispatch(setNotification({ message: 'Erro ao criar coleta', severity: 'error' }));
        dispatch(setEditing(true));
      }

    } catch (error) {
      if (error.response) {
        const msg = !error.response.data.message ? 'Erro desconhecido' : 'Erro ao criar coleta' + error.response.data.message;
        dispatch(setNotification({ message: msg, severity: 'error' }));
        dispatch(setLoading(false));
      } else if (error.request) {
        dispatch(setNotification({ message: 'Erro: Nenhuma resposta recebida do servidor', severity: 'error' }));
        dispatch(setLoading(false));
      } else {
        dispatch(setNotification({ message: 'Erro ao configurar a requisição: ' + error.message, severity: 'error' }));
      }
    } finally {
      dispatch(setUpdating(false));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="cadastro-coleta-form">
        {isLoading && (
          <LoadingOverlay>
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </LoadingOverlay>
        )}
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
                    <SelectRest label="Endereço"
                      first route='edress'
                      id='idEdress'
                      name='edress'
                      onChange={(e) => handleChange(e, 0)}
                      form={formData} defaultValue=""
                      invalidFields={invalidFields} loading={loading}
                      disabled={isEditing} />
                  </F.InputLine>
                </Box>

                {items.map((item, index) => (
                  <Box key={index} mb={2} width={'100%'}>
                    <F.InputLine>
                      <F.MediumInputLine>
                        <SelectRestCollect
                          label="Tipo de Coleta"
                          first
                          route='collectType'
                          data-index={index}
                          id='idCollectType'
                          name='description'
                          onChange={(e) => handleChange(e, index)}
                          form={item}
                          defaultValue=""
                          invalidFields={invalidFields}
                          loading={loading}
                          disabled={isEditing}
                          index={index}
                        />
                      </F.MediumInputLine>
                    </F.InputLine>
                    <F.InputLine>
                      <F.MediumInputLine>
                        <Input
                          first label="Quantidade de itens"
                          fieldName="quantity"
                          formData={item}
                          setFormData={setFormData}
                          onChange={(e) => handleChange(e, index)}
                          invalidFields={invalidFields}
                          disabled={isEditing}
                        />
                      </F.MediumInputLine>
                    </F.InputLine>
                    <Box display="flex" justifyContent="flex-end">
                      <IconButton onClick={() => handleAddFields()}>
                        <AddIcon />
                      </IconButton>
                      {items.length > 1 && (
                        <IconButton onClick={() => handleRemoveFields(index)}>
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                ))}
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
            <FormButtons handleSubmit={handleSubmit} isLoading={isLoading} isUpdating={isUpdating} />
          </Box>
        </Box>

        <NotificationSnackbar />
      </form >
    </>
  );
};

export default CreateCollect;