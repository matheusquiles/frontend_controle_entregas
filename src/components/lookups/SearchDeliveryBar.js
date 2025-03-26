import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 
import { setFormData, setLoading, resetForm, setNotification } from '../../redux/reducers/FormSlice.js';
import api from '../../api/api.js';
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../../styles/Colors.jsx';
import { API_SEARCH_DELIVERY_REGION, API_SEARCH_DELIVERIES_DTO, API_SEARCH_MOTOBOY } from '../../helper/Constants.js';
import SelectAutoComplete from '../SelectAutoComplete.js';

const SearchDeliveryBar = ({ onSearchComplete }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form.formData);
  const loading = useSelector((state) => state.form.isLoading);
  const invalidFields = useSelector((state) => state.form.invalidFields) || [];

  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);

  const [filters, setFilters] = useState({
    startDate: ontem,
    endDate: hoje,
    idMotoboy: '',
    deliveryRegion: '',
    status: 'todos',
  });

  const todosOption = useMemo(() => [{ id: '', label: 'Todos' }], []);

  useEffect(() => {
    if (!loading) {
      dispatch(setNotification({ message: '', severity: 'info' }));
      dispatch(resetForm());
    }
    const ontemFormatado = ontem.toISOString().split('T')[0];
    const hojeFormatado = hoje.toISOString().split('T')[0];
    dispatch(
      setFormData({
        dataInicial: ontemFormatado,
        dataFinal: hojeFormatado,
        status: 'todos',
      })
    );
  }, [dispatch], [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ ...formData, [name]: value }));
    setFilters((prev) => ({
      ...prev,
      [name === 'userKey' ? 'idMotoboy' : name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFilters({
      ...filters,
      [name]: date,
    });
    const dataFormatada = date ? date.toISOString().split('T')[0] : '';
    dispatch(
      setFormData({
        ...formData,
        [name === 'startDate' ? 'dataInicial' : 'dataFinal']: dataFormatada,
      })
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(resetForm());
    const formatDate = (date) => {
      if (!date) return '';
      return date.toISOString().split('T')[0];
    };

    const updatedFormData = {
      dataInicial: formatDate(filters.startDate),
      dataFinal: formatDate(filters.endDate),
      idMotoboy: filters.idMotoboy || '',
      idDeliveryRegion: filters.deliveryRegion || '',
      status: filters.status,
    };
    dispatch(setFormData(updatedFormData));

    try {
      const dataToSend = {
        idMotoboy: filters.idMotoboy || '',
        initialDate: formatDate(filters.startDate),
        finalDate: formatDate(filters.endDate),
        idDeliveryRegion: filters.deliveryRegion ? parseInt(filters.deliveryRegion) : null,
        deliveryStatus: filters.status === 'todos' ? null : filters.status,
      };

      const response = await api.post(`${API_SEARCH_DELIVERIES_DTO}`, dataToSend);
      onSearchComplete(response.data);
    } catch (error) {
      console.error('Erro na busca:', error);
      dispatch(setNotification({ message: 'Erro ao realizar a pesquisa', severity: 'error' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl sx={{ width: '258px' }}>
            <SelectAutoComplete
              label="Motoboy"
              route={`${API_SEARCH_MOTOBOY}`}
              idField="idUser"
              labelField="name"
              name="userKey"
              value={formData.userKey || ''}
              onChange={handleChange}
              optionsPrefix={todosOption}
              externalLoading={false}
            />
          </FormControl>
          <FormControl sx={{ width: '180px' }}>
            <SelectAutoComplete
              label="Região"
              route={`${API_SEARCH_DELIVERY_REGION}`}
              idField="idDeliveryRegion"
              labelField="deliveryRegion"
              name="deliveryRegion"
              value={formData.deliveryRegion || ''}
              onChange={handleChange}
              optionsPrefix={todosOption}
              externalLoading={false}
            />
          </FormControl>
          <FormControl sx={{ width: '200px' }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={filters.status}
              label="Status"
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="Aprovado">Aprovados</MenuItem>
              <MenuItem value="Pendente">Pendentes</MenuItem>
              <MenuItem value="Reprovado">Reprovados</MenuItem>
            </Select>
          </FormControl>

          {/* <DatePicker
            label="Data Inicial"
            value={filters.startDate}
            onChange={(date) => handleDateChange('startDate', date)}
            sx={{ width: '150px' }}
            renderInput={(params) => (
              <TextField {...params} size="small" sx={{ width: '200px' }} />
            )}
          />
          <DatePicker
            label="Data Final"
            value={filters.endDate}
            onChange={(date) => handleDateChange('endDate', date)}
            sx={{ width: '150px' }}
            renderInput={(params) => (
              <TextField {...params} size="small" sx={{ width: '200px' }} />
            )}
          /> */}

          <DatePicker
            selected={filters.startDate}
            onChange={(date) => handleDateChange('startDate', date)}
            dateFormat="dd/MM/yyyy"
            customInput={<TextField label="Data Inicial" size="small" sx={{ width: '200px' }} />}
          />
          <DatePicker
            selected={filters.endDate}
            onChange={(date) => handleDateChange('endDate', date)}
            dateFormat="dd/MM/yyyy"
            customInput={<TextField label="Data Final" size="small" sx={{ width: '200px' }} />}
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{
              bgcolor: MAIN_YELLOW,
              color: MAIN_FONT_COLLOR,
              height: '40px',
              minWidth: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: MAIN_FONT_COLLOR }} /> : 'Pesquisar'}
          </Button>
        </Box>
      </Box>
  );
};

export default SearchDeliveryBar;