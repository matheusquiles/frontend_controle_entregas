// FormUsuarios.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Input from '../components/input.js'; // Ajustado para TextInput
import { setFormData } from '../redux/reducers/FormSlice';
import SelectRest from '../components/SelectRest.js';
import PasswordInput from '../components/PasswordInput.js';

const FormUsuarios = ({ submitted }) => {
    const formData = useSelector((state) => state.form.formData);
    const invalidFields = useSelector((state) => state.form.invalidFields) || [];
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(setFormData({ ...formData, [name]: value }));
    };

    return (
        <>
            <CssBaseline />
            <Box mb={2} width={'50%'}>
                <Input
                    label="Nome"
                    fieldName="name"
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
            <Box mb={2} width={'50%'}>
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
            </Box>
        </>
    );
};

export default FormUsuarios;