import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { setFormData } from '../redux/reducers/FormSlice';
import SelectAutoComplete from '../components/SelectAutoComplete.js';
import PasswordInput from '../components/PasswordInput.js';
import api from '../api/api.js';
import { API_USER_TYPE } from '../helper/Constants.js';

const FormUsuarios = ({ submitted, newUser, isAdmin }) => {
    const formData = useSelector((state) => state.form.formData) || {};
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
                const response = await api.get('api/users/searchCordinator');
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

    const generateUserKey = (name) => {
        console.log('generateUserKey chamado com name:', name);

        if (!name || typeof name !== 'string') {
            console.log('Nome inválido ou vazio, retornando vazio');
            return '';
        }
        const nameParts = name.trim().split(/\s+/);
        console.log('Partes do nome:', nameParts);

        if (nameParts.length < 2) {
            console.log('Menos de 2 partes no nome, retornando vazio');
            return '';
        }

        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        console.log('Primeiro nome:', firstName, 'Último nome:', lastName);

        const normalizeString = (str) => {
            return str
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]/g, '');
        };

        const normalizedFirstName = normalizeString(firstName);
        const normalizedLastName = normalizeString(lastName);
        console.log('Primeiro nome normalizado:', normalizedFirstName, 'Último nome normalizado:', normalizedLastName);

        const userKey = `${normalizedFirstName}.${normalizedLastName}`;
        console.log('Nome de usuário gerado:', userKey);
        return userKey;
    };

    const formatCPF = (value) => {
        if (!value) return '';
        const onlyNumbers = value.replace(/\D/g, '');
        return onlyNumbers
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            .slice(0, 14);
    };

    const handleChange = (e) => {
        const { name, value, type, checked, selectedOption } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        console.log('handleChange chamado - name:', name, 'value:', newValue, 'selectedOption:', selectedOption);

        if (name === 'cpf') {
            newValue = formatCPF(newValue);
            console.log('CPF formatado:', newValue);
        }

        if (name === 'description' && selectedOption) {
            console.log('Atualizando description e idUserType:', selectedOption.label, value);
            dispatch(setFormData({
                ...formData,
                description: selectedOption.label,
                idUserType: value
            }));
        } else {
            dispatch(setFormData({ ...formData, [name]: newValue }));
        }
    };

    const handleNameBlur = (e) => {
        console.log('handleNameBlur chamado');
        const nameValue = e.target.value;
        console.log('Valor do campo nome:', nameValue);

        const generatedUserKey = generateUserKey(nameValue);
        console.log('formData antes de atualizar userKey:', formData);

        if (generatedUserKey) {
            dispatch(setFormData({
                ...formData,
                userKey: generatedUserKey
            }));
            console.log('formData depois de atualizar userKey:', { ...formData, userKey: generatedUserKey });
        } else {
            console.log('Nenhum userKey gerado, não atualizando formData');
        }
    };

    return (
        <>
            <CssBaseline />
            <Box mb={2} width={'50%'}>
                <TextField
                    fullWidth
                    label="Nome"
                    name="nome"
                    value={formData.nome || ''}
                    onChange={handleChange}
                    onBlur={handleNameBlur}
                    required
                    error={submitted && !formData.nome}
                    helperText={submitted && !formData.nome ? 'Nome é obrigatório' : ''}
                    variant="outlined"
                    size="small"
                />
            </Box>
            <Box mb={2} width={'50%'}>
                <TextField
                    fullWidth
                    label="Código do usuário"
                    name="userKey"
                    value={formData.userKey || ''}
                    onChange={handleChange}
                    required
                    error={submitted && !formData.userKey}
                    helperText={submitted && !formData.userKey ? 'Código do usuário é obrigatório' : ''}
                    variant="outlined"
                    size="small"
                    disabled
                />
            </Box>
            <Box mb={2} width={'50%'}>
                <TextField
                    fullWidth
                    label="CPF"
                    name="cpf"
                    value={formData.cpf || ''}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    inputProps={{
                        maxLength: 14
                    }}
                    error={submitted && formData.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)}
                    helperText={
                        submitted && formData.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)
                            ? 'CPF inválido (formato: 123.456.789-01)'
                            : ''
                    }
                />
            </Box>
            <Box mb={2} width={'50%'}>
                <TextField
                    fullWidth
                    label="E-mail"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    required
                    error={submitted && !formData.email}
                    helperText={submitted && !formData.email ? 'E-mail é obrigatório' : ''}
                    variant="outlined"
                    size="small"
                />
            </Box>

            <Box mb={2} width={'50%'}>
                {isAdmin ? (
                    <SelectAutoComplete
                        label="Tipo de Usuário"
                        route={API_USER_TYPE}
                        idField="idUserType"
                        labelField="description"
                        name="description"
                        value={formData.idUserType || ''}
                        onChange={handleChange}
                        required
                        submitted={submitted}
                        invalidFields={invalidFields}
                    />
                ) : (
                    <Box mb={2} width={'50%'} ml={2}>
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
                    <FormControl fullWidth error={submitted && formData.description === 'Motoboy' && !formData['users/searchCordinator']}>
                        <InputLabel>Hierarquia</InputLabel>
                        <Select
                            name="users/searchCordinator"
                            value={formData['users/searchCordinator'] || ''}
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
                        {submitted && formData.description === 'Motoboy' && !formData['users/searchCordinator'] && (
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