import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { setFormData, setLoading, resetForm, setNotification } from '../redux/reducers/FormSlice.js';
import SelectRest from './SelectRest';
import api from '../api/api.js';
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../styles/Colors';
import { API_SEARCH_COLLECTS_DTO } from '../helper/Contants.js';

const SearchBar = ({ onSearchComplete }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form.formData);
  const invalidFields = useSelector((state) => state.form.invalidFields) || [];

  const hoje = new Date();
  const ontem = new Date(hoje); 
  ontem.setDate(hoje.getDate() - 1); 

  const [filters, setFilters] = React.useState({
    startDate: ontem, 
    endDate: hoje,
    motoboy: '',
    supervisor: '',
    collectType: '',
    address: '',
    status: 'todos' 
  });

  React.useEffect(() => {
    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());
    const ontemFormatado = ontem.toISOString().split('T')[0];
    const hojeFormatado = hoje.toISOString().split('T')[0];
    dispatch(setFormData({
      dataInicial: ontemFormatado, // D-1
      dataFinal: hojeFormatado,
      status: 'todos'
    }));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ ...formData, [name]: value }));
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, date) => {
    setFilters({
      ...filters,
      [name]: date
    });
    const dataFormatada = date ? date.toISOString().split('T')[0] : '';
    dispatch(setFormData({
      ...formData,
      [name === 'startDate' ? 'dataInicial' : 'dataFinal']: dataFormatada
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const formatDate = (date) => {
        if (!date) return '';
        return date.toISOString().split('T')[0];
      };

      const dataToSend = {
        idUser: formData.userKey,
        initialDate: formatDate(filters.startDate),
        finalDate: formatDate(filters.endDate),
        idEdress: formData.edress ? parseInt(formData.edress) : null,
        deliveryStatus: formData.status
      };
      const response = await api.post(`${API_SEARCH_COLLECTS_DTO}`, dataToSend);
      onSearchComplete(response.data);
    } catch (error) {
      console.error('Erro na busca:', error);
    }
    dispatch(setLoading(false));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <SelectRest
            label="Motoboy"
            first
            route="users/searchMotoboy"
            id="idUser"
            name="userKey"
            onChange={(e) => handleChange(e)}
            form={formData}
            defaultValue=""
            invalidFields={invalidFields}
            search
          />
          <SelectRest
            label="Endereço"
            route="edress"
            id="idEdress"
            name="description"
            onChange={(e) => handleChange(e)}
            form={formData}
            defaultValue=""
            invalidFields={invalidFields}
            search
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <DatePicker
            label="Data Inicial"
            value={filters.startDate}
            onChange={(date) => handleDateChange('startDate', date)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="Data Final"
            value={filters.endDate}
            onChange={(date) => handleDateChange('endDate', date)}
            renderInput={(params) => <TextField {...params} />}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={filters.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="Aprovado">Aprovados</MenuItem>
              <MenuItem value="Pendente">Pendentes</MenuItem>
              <MenuItem value="Recusado">Recusados</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSearch} sx={{ bgcolor: MAIN_YELLOW, color: MAIN_FONT_COLLOR }}>
            Pesquisar
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default SearchBar;