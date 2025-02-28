import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { setFormData, setLoading, resetForm, setEditing, setNotification, setUpdating } from '../redux/reducers/FormSlice.js';
import SelectRest from './SelectRest';
import api from '../api/api.js';
import { API_SEARCH_COLLECTS_DTO } from '../helper/Contants.js';

const SearchBar = ({onSearchComplete}) => {
    const dispatch = useDispatch();
    const formData = useSelector((state) => state.form.formData);
    const invalidFields = useSelector((state) => state.form.invalidFields) || [];

    React.useEffect(() => {
        dispatch(setNotification({ message: '', severity: 'info' }));
        dispatch(resetForm());
    }, [dispatch]);

    const [filters, setFilters] = React.useState({
        startDate: null,
        endDate: null,
        motoboy: '',
        supervisor: '',
        collectType: '',
        address: ''
    });


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
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));

        try {
            const formatDate = (date) => {
                if (!date) return "";
                return date.toISOString().split('T')[0];
            };

            const dataToSend = {
                idUser: formData.userKey,
                initialDate: formatDate(filters.startDate),
                finalDate: formatDate(filters.endDate),
                idEdress: formData.edress ? parseInt(formData.edress) : null
            };
            console.log("Dados a serem enviados:", JSON.stringify(dataToSend, null, 2));

            const response = await api.post(`${API_SEARCH_COLLECTS_DTO}`, dataToSend);

            console.log("Dados recebidos:", JSON.stringify(response.data, null, 2));
            onSearchComplete(response.data);

        } catch (error) {

        }
        dispatch(setLoading(false));

        // Aqui você pode dispatch uma ação Redux ou fazer uma requisição API com dataToSend, se necessário
        // Exemplo: dispatch(searchAction(dataToSend));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <SelectRest
                        label="Motoboy"
                        first
                        route='users/searchMotoboy'
                        id='idUser'
                        name='userKey'
                        onChange={(e) => handleChange(e)}
                        form={formData}
                        defaultValue=""
                        invalidFields={invalidFields}
                        required={true}
                    />
                    <SelectRest
                        label="Endereço"
                        route='edress'
                        id='idEdress'
                        name='description'
                        onChange={(e) => handleChange(e)}
                        form={formData}
                        defaultValue=""
                        invalidFields={invalidFields}
                        required={true}
                    />
                    <Button variant="contained" onClick={handleSearch}>
                        Pesquisar
                    </Button>
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
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default SearchBar;