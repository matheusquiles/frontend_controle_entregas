import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Checkbox, FormControlLabel, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { setFormData, setLoading, resetForm, setNotification } from '../redux/reducers/FormSlice.js';
import api from '../api/api.js';
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../styles/Colors';
import { API_BASE_URL, API_SEARCH_COLLECTS_DTO } from '../helper/Contants.js';

const SearchUserBar = ({ onSearchComplete }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form.formData);
  const invalidFields = useSelector((state) => state.form.invalidFields) || [];

  const [filters, setFilters] = useState({
    name: '',
    userKey: '',
    cpf: '',
    description: 'todos', 
    status: true
  });
  const [userTypeOptions, setUserTypeOptions] = useState([]); 
  const [loadingUserTypes, setLoadingUserTypes] = useState(false); 

  useEffect(() => {
    const fetchUserTypes = async () => {
      setLoadingUserTypes(true);
      try {
        const { data } = await api.get(`${API_BASE_URL}/userType`);
        setUserTypeOptions(data);
      } catch (error) {
        console.error('Erro ao carregar tipos de usuário:', error);
        dispatch(setNotification({ message: 'Erro ao carregar tipos de usuário', severity: 'error' }));
      } finally {
        setLoadingUserTypes(false);
      }
    };

    fetchUserTypes();
    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());
    dispatch(setFormData({
      description: 'todos',
      status: true
    }));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    dispatch(setFormData({ ...formData, [name]: newValue }));
    setFilters((prev) => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const dataToSend = {
        name: formData.name || null,
        userKey: formData.userKey || null,
        cpf: formData.cpf || null,
        userType: formData.description === 'todos' ? null : formData.description, 
        status: formData.status
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Nome"
          name="name"
          value={filters.name}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ width: '200px' }}
        />
        <TextField
          label="Código do usuário"
          name="userKey"
          value={filters.userKey}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ width: '200px' }}
        />
        <TextField
          label="CPF"
          name="cpf"
          value={filters.cpf}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ width: '200px' }}
        />
        <FormControl sx={{ width: '200px' }}>
          <InputLabel id="user-type-label">Tipo de usuário</InputLabel>
          <Select
            labelId="user-type-label"
            name="description"
            value={filters.description}
            onChange={handleChange}
            label="Tipo de usuário"
            variant="outlined"
            size="small"
            disabled={loadingUserTypes} 
          >
            <MenuItem value="todos">Todos</MenuItem>
            {userTypeOptions.map((option) => (
              <MenuItem key={option.idUserType} value={option.description}>
                {option.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              name="status"
              checked={filters.status}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Habilitado"
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          onClick={handleSearch} 
          sx={{ bgcolor: MAIN_YELLOW, color: MAIN_FONT_COLLOR }}
        >
          Pesquisar
        </Button>
      </Box>
    </Box>
  );
};

export default SearchUserBar;