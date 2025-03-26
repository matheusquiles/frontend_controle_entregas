import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DatePicker from 'react-datepicker'; // Import do react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Estilo padrão
import { setFormData, setLoading, resetForm, setNotification } from '../../redux/reducers/FormSlice.js';
import api from '../../api/api.js';
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../../styles/Colors.jsx';
import { API_ADDRESS, API_SEARCH_MOTOBOY, API_SEARCH_COLLECTS_DTO } from '../../helper/Constants.js';
import SelectAutoComplete from '../SelectAutoComplete.js';

// Opcional: se quiser localização em português, instale date-fns e importe
// import { ptBR } from 'date-fns/locale';

const SearchCollectBar = ({ onSearchComplete }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form.formData);
  const invalidFields = useSelector((state) => state.form.invalidFields) || [];

  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);

  const [filters, setFilters] = useState({
    startDate: ontem,
    endDate: hoje,
    userKey: '',
    edress: '',
    status: 'todos',
  });

  const todosOption = useMemo(() => [{ id: '', label: 'Todos' }], []);

  useEffect(() => {
    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());
    const ontemFormatado = ontem.toISOString().split('T')[0];
    const hojeFormatado = hoje.toISOString().split('T')[0];
    dispatch(
      setFormData({
        dataInicial: ontemFormatado,
        dataFinal: hojeFormatado,
        status: 'todos',
      })
    );
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ ...formData, [name]: value }));
    setFilters((prev) => ({
      ...prev,
      [name]: value,
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
      userKey: filters.userKey || '',
      edress: filters.edress || '',
      status: filters.status,
    };
    dispatch(setFormData(updatedFormData));

    try {
      const dataToSend = {
        idUser: filters.userKey || '',
        initialDate: formatDate(filters.startDate),
        finalDate: formatDate(filters.endDate),
        idEdress: filters.edress ? parseInt(filters.edress) : null,
        deliveryStatus: filters.status === 'todos' ? null : filters.status,
      };
      const response = await api.post(`${API_SEARCH_COLLECTS_DTO}`, dataToSend);
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
        <FormControl sx={{ width: '390px' }}>
          <SelectAutoComplete
            label="Endereço"
            route={`${API_ADDRESS}`}
            idField="idEdress"
            labelField="description"
            name="edress"
            value={formData.edress || ''}
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
          sx={{
            bgcolor: MAIN_YELLOW,
            color: MAIN_FONT_COLLOR,
            height: '40px',
            padding: '0 16px',
            minWidth: '100px',
          }}
        >
          Pesquisar
        </Button>
      </Box>
    </Box>
  );
};

export default SearchCollectBar;