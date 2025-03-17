import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { setFormData, setLoading, resetForm, setNotification } from '../redux/reducers/FormSlice.js';
import api from '../api/api.js';
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../styles/Colors';
import { API_BASE_URL, API_SEARCH_COLLECTS_DTO } from '../helper/Contants.js';

const SearchBar = ({ onSearchComplete }) => {
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
    status: 'todos'
  });
  const [motoboyOptions, setMotoboyOptions] = useState([]);
  const [edressOptions, setEdressOptions] = useState([]);
  const [loadingMotoboys, setLoadingMotoboys] = useState(false);
  const [loadingEdress, setLoadingEdress] = useState(false);

  useEffect(() => {
    const fetchMotoboys = async () => {
      setLoadingMotoboys(true);
      try {
        const { data } = await api.get(`${API_BASE_URL}/users/searchMotoboy`);
        setMotoboyOptions(data);
      } catch (error) {
        console.error('Erro ao carregar motoboys:', error);
        dispatch(setNotification({ message: 'Erro ao carregar motoboys', severity: 'error' }));
      } finally {
        setLoadingMotoboys(false);
      }
    };

    const fetchEdress = async () => {
      setLoadingEdress(true);
      try {
        const { data } = await api.get(`${API_BASE_URL}/edress`);
        setEdressOptions(data);
      } catch (error) {
        console.error('Erro ao carregar endereços:', error);
        dispatch(setNotification({ message: 'Erro ao carregar endereços', severity: 'error' }));
      } finally {
        setLoadingEdress(false);
      }
    };

    fetchMotoboys();
    fetchEdress();

    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());
    const ontemFormatado = ontem.toISOString().split('T')[0];
    const hojeFormatado = hoje.toISOString().split('T')[0];
    dispatch(setFormData({
      dataInicial: ontemFormatado,
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
        idUser: formData.userKey || '',
        initialDate: formatDate(filters.startDate),
        finalDate: formatDate(filters.endDate),
        idEdress: formData.edress ? parseInt(formData.edress) : null,
        deliveryStatus: formData.status
      };
      console.log("Dados de pesquisa:", dataToSend);
      const response = await api.post(`${API_SEARCH_COLLECTS_DTO}`, dataToSend);
      onSearchComplete(response.data);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl sx={{ width: '258px' }}>
            <InputLabel id="motoboy-label">Motoboy</InputLabel>
            <Select
              labelId="motoboy-label"
              name="userKey" 
              value={filters.userKey}
              onChange={handleChange}
              label="Motoboy"
              variant="outlined"
              size="small"
              disabled={loadingMotoboys}
            >
              <MenuItem value="">Todos</MenuItem>
              {motoboyOptions.map((option) => (
                <MenuItem key={option.idUser} value={String(option.idUser)}> 
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '390px' }}>
            <InputLabel id="edress-label">Endereço</InputLabel>
            <Select
              labelId="edress-label"
              name="edress"
              value={filters.edress}
              onChange={handleChange}
              label="Endereço"
              variant="outlined"
              size="small"
              disabled={loadingEdress}
            >
              <MenuItem value="">Todos</MenuItem>
              {edressOptions.map((option) => (
                <MenuItem key={option.idEdress} value={option.idEdress}>
                  {option.description}
                </MenuItem>
              ))}
            </Select>
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
              <MenuItem value="Recusado">Recusados</MenuItem>
            </Select>
          </FormControl>

          <DatePicker
            label="Data Inicial"
            value={filters.startDate}
            onChange={(date) => handleDateChange('startDate', date)}
            sx={{ width: '150px', height: '40px' }}
            renderInput={(params) => <TextField {...params} size="small" sx={{ width: '200px', height: '40px' }} />}
          />
          <DatePicker
            label="Data Final"
            value={filters.endDate}
            onChange={(date) => handleDateChange('endDate', date)}
            sx={{ width: '150px', height: '40px' }}
            renderInput={(params) => <TextField {...params} size="small" sx={{ width: '200px', height: '40px' }} />}
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
    </LocalizationProvider>
  );
};

export default SearchBar;