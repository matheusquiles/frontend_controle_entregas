import React, { useEffect, useState } from 'react';
import { setFormData, setLoading, resetForm, setEditing, setNotification } from '../redux/reducers/FormSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api.js';
import { LoadingOverlay } from '../styles/globalStyles.jsx';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Box, Toolbar, TextField, Button } from '@mui/material';
import NotificationSnackbar from '../components/NotificacaoSnackbar.js';
import SelectAutoComplete from '../components/SelectAutoComplete.js';
import FormButtons from '../components/FormButtons.js';
import AppAppBar from '../components/AppAppBar.js';
import { useUser } from '../hooks/useUser';
import { API_SEARCH_MOTOBOY, API_SEARCH_DELIVERY_REGION, API_SAVE_DELIVERY } from '../helper/Constants.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddIcon from '@mui/icons-material/Add'; 
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../styles/Colors.jsx';

const CreateDelivery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUser();
  const isLoading = useSelector((state) => state.form.isLoading);
  const formData = useSelector((state) => state.form.formData) || { motoboy: '', deliveryRegion: '', value: '', date: null };
  const invalidFields = useSelector((state) => state.form.invalidFields) || [];
  const isEditing = useSelector((state) => state.form.isEditing);

  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 

  useEffect(() => {
    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());
    dispatch(setEditing(true));
    dispatch(setFormData({ date: new Date() }));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({
      ...formData,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    dispatch(setFormData({
      ...formData,
      date: date
    }));
  };

  const handleResetForm = () => {
    dispatch(resetForm());
    dispatch(setFormData({ date: new Date() })); 
    setSubmitted(false);
    setIsSuccess(false);
    dispatch(setEditing(true));
    dispatch(setNotification({ message: '', severity: 'info' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!formData.motoboy || !formData.value || !formData.deliveryRegion || !formData.date) {
      dispatch(setNotification({ message: 'Preencha todos os campos obrigatórios!', severity: 'error' }));
      return;
    }

    const payload = {
      value: formData.value,
      motoboy: { idUser: formData.motoboy },
      deliveryRegion: { idDeliveryRegion: formData.deliveryRegion },
      date: formData.date.toISOString().split('T')[0],
      status: true,
      createdBy: { idUser: user?.idUser }
    };

    try {
      dispatch(setLoading(true));
      const response = await api.post(API_SAVE_DELIVERY, payload);

      console.log('Resposta da API:', response);
      console.log('Status:', response.status);
      console.log('Data:', response.data);

      if (response.status === 200) {
        dispatch(setNotification({
          message: 'Entrega criada com sucesso!',
          severity: 'success'
        }));
        dispatch(setEditing(false));
        setIsSuccess(true);
      } else {
        dispatch(setNotification({
          message: 'Erro ao criar entrega: resposta inesperada da API',
          severity: 'error'
        }));
        dispatch(setEditing(true));
        setIsSuccess(false);
      }
    } catch (error) {
      dispatch(setNotification({
        message: 'Erro ao criar entrega: ' + error.message,
        severity: 'error'
      }));
      console.error('Error submitting delivery:', error);
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
        <form onSubmit={handleSubmit} className="cadastro-delivery-form" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
            <Box mb={2} width={'50%'}>
              <SelectAutoComplete
                label="Motoboy"
                route={API_SEARCH_MOTOBOY}
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
            </Box>
            <Box mb={2} width={'50%'}>
              <SelectAutoComplete
                label="Região"
                route={API_SEARCH_DELIVERY_REGION}
                idField="idDeliveryRegion"
                labelField="deliveryRegion"
                name="deliveryRegion"
                value={formData.deliveryRegion || ''}
                onChange={handleChange}
                required
                submitted={submitted}
                invalidFields={invalidFields}
              />
            </Box>
            <Box mb={2} width={'25%'}>
              <TextField
                fullWidth
                label="Valor da Entrega"
                name="value"
                type="number"
                step="0.01"
                value={formData.value || ''}
                onChange={handleChange}
                size="small"
                margin="normal"
                inputProps={{ inputMode: 'decimal', pattern: '[0-9]*\.?[0-9]*', min: 0 }}
                error={submitted && !formData.value}
                helperText={submitted && !formData.value ? 'Valor é obrigatório' : ''}
              />
            </Box>
            <Box mb={2} width={'50%'}>
              <DatePicker
                selected={formData.date || null}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                customInput={
                  <TextField
                    fullWidth
                    label="Data"
                    size="small"
                    margin="normal"
                    error={submitted && !formData.date}
                    helperText={submitted && !formData.date ? 'Data é obrigatória' : ''}
                  />
                }
              />
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
                Nova Entrega
              </Button>
            )}
          </Box>
        </form>
      </Box>
      <NotificationSnackbar />
    </>
  );
};

export default CreateDelivery;