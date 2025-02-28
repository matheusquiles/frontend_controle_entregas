import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { setFormData, setLoading, resetForm, setEditing, setNotification, setUpdating } from '../redux/reducers/FormSlice.js';
import SelectRest from './SelectRest';

const SearchBar = () => {
    const dispatch = useDispatch();
    const formData = useSelector((state) => state.form.formData);
    const invalidFields = useSelector((state) => state.form.invalidFields) || [];
    const { motoboys, supervisors, collectTypes, addresses } = useSelector(state => state);

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
    };

    const handleDateChange = (name, date) => {
        setFilters({
            ...filters,
            [name]: date
        });
    };

    const handleSearch = () => {
        // Dispatch search action with filters
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
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

                <SelectRest
                    label="Motoboy"
                    route='users/searchMotoboy'
                    id='idUser'
                    name='name'
                    onChange={(e) => handleChange(e, 0)}
                    form={formData}
                    defaultValue=""
                    invalidFields={invalidFields}
                    required={true}
                />
                {/* <SelectRest
                    label="Supervisor"
                    route='user'
                    id='idUser'
                    name='name'
                    onChange={(e) => handleChange(e, 0)}
                    form={formData}
                    defaultValue=""
                    invalidFields={invalidFields}
                    required={true}
                /> */}


                <SelectRest
                    label="Endereço"
                    route='edress'
                    id='idEdress'
                    name='description'
                    onChange={(e) => handleChange(e, 0)}
                    form={formData}
                    defaultValue=""
                    invalidFields={invalidFields}
                    required={true}
                />
                <Button variant="contained" onClick={handleSearch}>
                    Pesquisar
                </Button>
            </Box>
        </LocalizationProvider>
    );
};

export default SearchBar;