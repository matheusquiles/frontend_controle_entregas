import React, { useEffect, useState } from 'react';
import { setFormData, setLoading, resetForm, setEditing, setNotification } from '../redux/reducers/FormSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api.js';
import { LoadingOverlay } from '../styles/globalStyles.jsx';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Box, Toolbar, TextField } from '@mui/material';
import NotificationSnackbar from '../components/NotificacaoSnackbar.js';
import SelectAutoComplete from '../components/SelectAutoComplete.js';
import FormButtons from '../components/FormButtons.js';
import AppAppBar from '../components/AppAppBar.js';
import { useUser } from '../hooks/useUser';
import { API_SEARCH_MOTOBOY, API_SEARCH_DELIVERY_REGION, API_SEARCH_DELIVERY } from '../helper/Contants.js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

const CreateDelivery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUser();
  const isLoading = useSelector((state) => state.form.isLoading);
  const formData = useSelector((state) => state.form.formData);
  const invalidFields = useSelector((state) => state.form.invalidFields);
  const isEditing = useSelector((state) => state.form.isEditing);

  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!formData.motoboy || !formData.value || !formData.deliveryRegion || !formData.date) {
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
      await api.post(API_SEARCH_DELIVERY, payload);
      dispatch(setNotification({
        message: 'Entrega criada com sucesso!',
        severity: 'success'
      }));
    } catch (error) {
      dispatch(setNotification({
        message: 'Erro ao criar entrega',
        severity: 'error'
      }));
      console.error('Error submitting delivery:', error);
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
                value={formData.motoboy}
                onChange={handleChange}
                required
                submitted={submitted}
                invalidFields={invalidFields}
              />
            </Box>
            <Box mb={2} width={'50%'}>
              <SelectAutoComplete
                label="Região"
                route={API_SEARCH_DELIVERY_REGION}
                idField="idDeliveryRegion"
                labelField="deliveryRegion"
                name="deliveryRegion"
                value={formData.deliveryRegion}
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
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data"
                  value={formData.date || null}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      margin="normal"
                      error={submitted && !formData.date}
                      helperText={submitted && !formData.date ? 'Data é obrigatória' : ''}
                    />
                  )}
                />
              </LocalizationProvider>
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
          </Box>
        </form>
      </Box>
      <NotificationSnackbar />
    </>
  );
};

export default CreateDelivery;