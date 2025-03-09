import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Input from '../components/input.js';
import { setFormData } from '../redux/reducers/FormSlice';
import SelectRest from '../components/SelectRest.js';
import PasswordInput from '../components/PasswordInput.js';
import api from '../api/api.js';

const FormUsuarios = ({ submitted, newUser, isAdmin }) => {
    const formData = useSelector((state) => state.form.formData);
    const invalidFields = useSelector((state) => state.form.invalidFields) || [];
    const dispatch = useDispatch();

    const [coordinators, setCoordinators] = useState([]);
    const [coordinatorsLoading, setCoordinatorsLoading] = useState(false);
    const [coordinatorsError, setCoordinatorsError] = useState(null);

    useEffect(() => {
        const fetchCoordinators = async () => {
            if (!isAdmin) return;

            setCoordinatorsLoading(true);
            try {
                const response = await api.get('api/users/searchCoordinator');
                setCoordinators(response.data || []);
            } catch (error) {
                console.error('Erro ao carregar coordenadores:', error);
                setCoordinatorsError('Erro ao carregar coordenadores');
            } finally {
                setCoordinatorsLoading(false);
            }
        };

        fetchCoordinators();
    }, [isAdmin]);

    const handleChange = (e) => {
        const { name, value, type, checked, selectedOption } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        if (name === 'description' && selectedOption) {
            dispatch(setFormData({
                ...formData,
                description: selectedOption.name, // Ex.: "Motoboy"
                idUserType: parseInt(value) // Ex.: 3
            }));
        } else {
            dispatch(setFormData({ ...formData, [name]: newValue }));
        }
    };

    return (
        <>
            <CssBaseline />
            <Box mb={2} width={'50%'}>
                <Input
                    label="Nome"
                    fieldName="nome"
                    formData={formData}
                    onChange={handleChange}
                    required={true}
                    submitted={submitted}
                />
            </Box>
            <Box mb={2} width={'50%'}>
                <Input
                    label="Código do usuário"
                    fieldName="userKey"
                    formData={formData}
                    onChange={handleChange}
                    required={true}
                    submitted={submitted}
                />
            </Box>
            <Box mb={2} width={'50%'}>
                <Input
                    label="CPF"
                    fieldName="cpf"
                    formData={formData}
                    onChange={handleChange}
                    cpf
                    submitted={submitted}
                />
            </Box>
            <Box mb={2} width={'50%'}>
                <Input
                    label="E-mail"
                    fieldName="email"
                    formData={formData}
                    onChange={handleChange}
                    email
                    required={true}
                    submitted={submitted}
                />
            </Box>

            <Box mb={2} width={'50%'}>
                {isAdmin ? (
                    <SelectRest
                        label="Tipo de Usuário"
                        route="userType"
                        id="idUserType"
                        name="description"
                        onChange={handleChange}
                        form={formData}
                        defaultValue=""
                        invalidFields={invalidFields}
                        required={true}
                        submitted={submitted}
                    />
                ) : (

                    <Box mb={2} width={'50%'} ml={2} >
                        <FormControl fullWidth disabled>
                            <InputLabel>Tipo de Usuário</InputLabel>
                            <Select
                                name="description"
                                value="Motoboy"
                                label="Tipo de Usuário"
                                disabled
                            >
                                <MenuItem value="Motoboy">Motoboy</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )}
            </Box>

            {newUser && (
                <Box mb={2} width={'50%'}>
                    <PasswordInput
                        label="Senha"
                        fieldName="password"
                        confirmFieldName="confirmPassword"
                        formData={formData}
                        onChange={handleChange}
                        required={true}
                        submitted={submitted}
                    />
                </Box>
            )}
            {isAdmin && (
                <Box mb={2} width={'49%'} ml={2}>
                    <FormControl fullWidth error={submitted && formData.description === 'Motoboy' && !formData['users/searchCoordinator']}>
                        <InputLabel>Hierarquia</InputLabel>
                        <Select
                            name="users/searchCoordinator"
                            value={formData['users/searchCoordinator'] || ''}
                            onChange={handleChange}
                            label="Hierarquia"
                            disabled={coordinatorsLoading}
                            required={formData.description === 'Motoboy'}
                        >
                            <MenuItem value="">
                                <em>Selecione...</em>
                            </MenuItem>
                            {coordinators.map((coordinator) => (
                                <MenuItem key={coordinator.idUser} value={coordinator.idUser}>
                                    {coordinator.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {coordinatorsError && <span style={{ color: 'red' }}>{coordinatorsError}</span>}
                        {submitted && formData.description === 'Motoboy' && !formData['users/searchCoordinator'] && (
                            <span style={{ color: 'red' }}>Este campo é obrigatório para Motoboys.</span>
                        )}
                    </FormControl>
                </Box>
            )}
            {!newUser && (
                <Box mb={2} width={'50%'} sx={{ mx: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="status"
                                checked={formData.status || false}
                                onChange={handleChange}
                                color="primary"
                            />
                        }
                        label="Habilitado"
                    />
                </Box>
            )}
        </>
    );
};

export default FormUsuarios;