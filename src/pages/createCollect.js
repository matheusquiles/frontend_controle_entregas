import React, { useEffect, useState } from 'react';
import { setFormData, setLoading, resetForm, setEditing, setNotification } from '../redux/reducers/FormSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api.js';
import * as F from '../styles/globalStyles.jsx';
import { LoadingOverlay } from '../styles/globalStyles.jsx';
import { FaSpinner } from 'react-icons/fa';
import { CssBaseline, Box, IconButton, Toolbar, Button } from '@mui/material';
import NotificationSnackbar from '../components/NotificacaoSnackbar.js';
import SelectRestCollect from '../components/SelectRestCollect.js';
import Input from '../components/input.js';
import SelectAutoComplete from '../components/SelectAutoComplete.js';
import { API_SAVE_URL, API_ADDRESS, API_SEARCH_MOTOBOY } from '../helper/Constants.js';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FormButtons from '../components/FormButtons.js';
import AppAppBar from '../components/AppAppBar.js';
import { useUser } from '../hooks/useUser';
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../styles/Colors.jsx';

const CreateCollect = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.form.isLoading);
  const formData = useSelector((state) => state.form.formData) || { motoboy: '', edress: '' };
  const invalidFields = useSelector((state) => state.form.invalidFields) || [];
  const isEditing = useSelector((state) => state.form.isEditing);

  const [items, setItems] = useState([{ collectType: '', quantity: '' }]);
  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());
    dispatch(setEditing(true));
  }, [dispatch]);

  const handleChange = (e, index) => {
    const { name, value, selectedOption } = e.target;

    if (index !== undefined) {
      const newItems = [...items];
      if (name === 'description') {
        newItems[index]['collectType'] = selectedOption ? selectedOption.id : value;
      } else {
        newItems[index][name] = value;
      }
      setItems(newItems);
    } else {
      dispatch(setFormData({ ...formData, [name]: value }));
    }
  };

  const handleAddFields = () => {
    setItems([...items, { collectType: '', quantity: '' }]);
  };

  const handleRemoveFields = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleResetForm = () => {
    setItems([{ collectType: '', quantity: '' }]);
    setSubmitted(false);
    setIsSuccess(false);
    dispatch(resetForm());
    dispatch(setEditing(true));
    dispatch(setNotification({ message: '', severity: 'info' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!formData?.edress) {
      dispatch(setNotification({ message: 'Preencha todos os campos obrigatórios!', severity: 'error' }));
      return;
    }

    if (!user) {
      dispatch(setNotification({ message: 'Nenhum usuário logado encontrado!', severity: 'error' }));
      return;
    }

    dispatch(setEditing(false));
    dispatch(setLoading(true));

    try {
      const dataToSend = {
        date: new Date().toISOString().split('T')[0],
        status: true,
        userId: { idUser: parseInt(formData?.motoboy) },
        edress: { idEdress: parseInt(formData?.edress) },
        createdBy: { idUser: user.idUser },
        itens: items.map((item) => ({
          collectType: { idCollectType: parseInt(item.collectType) },
          quantity: parseInt(item.quantity),
          deliveryStatus: false,
        })),
      };

      const response = await api.post(`${API_SAVE_URL}`, dataToSend);

      console.log('Resposta da API:', response);
      console.log('Status:', response.status);
      console.log('Data:', response.data);

      if (response.status === 200) {
        dispatch(setNotification({ message: 'Coleta criada com sucesso!', severity: 'success' }));
        dispatch(setEditing(false));
        setIsSuccess(true);
      } else {
        dispatch(setNotification({ message: 'Erro ao criar coleta: resposta inesperada da API', severity: 'error' }));
        dispatch(setEditing(true));
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      dispatch(setNotification({ message: 'Erro ao criar coleta: ' + error.message, severity: 'error' }));
      dispatch(setEditing(true));
      setIsSuccess(false);
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
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          color: 'black',
          p: { xs: 2, md: 3 },
          maxWidth: 'lg',
          mx: 'auto',
        }}
      >
        <form onSubmit={handleSubmit} className="cadastro-coleta-form" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
            <F.InputLine column>
              <Box mb={2} width={'100%'}>
                <F.InputLine>
                  <SelectAutoComplete
                    label="Motoboy"
                    route={`${API_SEARCH_MOTOBOY}`}
                    idField="idUser"
                    labelField="name"
                    name="motoboy"
                    value={formData.motoboy || ''}
                    onChange={handleChange}
                    required
                    submitted={submitted}
                    invalidFields={invalidFields}
                    filterCoordinator={true}
                  />
                </F.InputLine>
                <F.InputLine>
                  <SelectAutoComplete
                    label="Endereço"
                    route={`${API_ADDRESS}`}
                    idField="idEdress"
                    labelField="edress"
                    name="edress"
                    value={formData.edress || ''}
                    onChange={handleChange}
                    required
                    submitted={submitted}
                    invalidFields={invalidFields}
                  />
                </F.InputLine>
              </Box>

              {items.map((item, index) => (
                <Box key={index} mb={2} width={'100%'}>
                  <F.InputLine>
                    <F.MediumInputLine>
                      <SelectRestCollect
                        label="Tipo de Coleta"
                        first
                        route="collectType"
                        data-index={index}
                        id="idCollectType"
                        name="description"
                        onChange={(e) => handleChange(e, index)}
                        form={item}
                        defaultValue={item.collectType || ''}
                        invalidFields={invalidFields}
                        loading={isLoading}
                        disabled={!isEditing}
                        index={index}
                        required={true}
                        submitted={submitted}
                      />
                    </F.MediumInputLine>
                  </F.InputLine>
                  <F.InputLine>
                    <F.MediumInputLine>
                      <Input
                        first
                        label="Quantidade de itens"
                        fieldName="quantity"
                        formData={item}
                        onChange={(e) => handleChange(e, index)}
                        invalidFields={invalidFields}
                        disabled={!isEditing}
                        required={true}
                        submitted={submitted}
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
            <FormButtons handleSubmit={handleSubmit} isLoading={isLoading} />
            {isSuccess && !isEditing && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleResetForm}
                sx={{ bgcolor: MAIN_YELLOW, color: MAIN_FONT_COLLOR }}
                startIcon={<AddIcon />}
              >
                Nova Coleta
              </Button>
            )}
          </Box>
        </form>
      </Box>
      <NotificationSnackbar />
    </>
  );
};

export default CreateCollect;