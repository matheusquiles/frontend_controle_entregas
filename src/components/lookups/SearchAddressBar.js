import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { setFormData, setLoading, resetForm, setNotification } from '../../redux/reducers/FormSlice.js';
import api from '../../api/api.js';
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../../styles/Colors.jsx';
import { API_SEARCH_ADRESS_DTO } from '../../helper/Constants.js';

const SearchAddressBar = ({ onSearchComplete }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form.formData);
  const invalidFields = useSelector((state) => state.form.invalidFields) || [];

  const [filters, setFilters] = useState({
    description: '',
    edress: '',
    status: true,
  });

  useEffect(() => {
    dispatch(setNotification({ message: '', severity: 'info' }));
    dispatch(resetForm());
    dispatch(setFormData({
      status: true,
    }));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    dispatch(setFormData({ ...formData, [name]: newValue }));
    setFilters((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {

      const dataToSend = {
        description: formData.description || null,
        edress: formData.edress || null,
        status: formData.status,
      };

      const response = await api.post(`${API_SEARCH_ADRESS_DTO}`, dataToSend);

      onSearchComplete(response.data);
    } catch (error) {
      console.error('Erro na busca:', error);
      dispatch(setNotification({ message: 'Erro na busca de Endereços', severity: 'error' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Descrição"
          name="description"
          value={filters.description}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ width: '200px' }}
        />
        <TextField
          label="Endereço"
          name="edress"
          value={filters.edress}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ width: '200px' }}
        />
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

export default SearchAddressBar;