import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Input from '../components/input.js';
import { setFormData, setLoading, resetForm, setEditing, setNotification, setUpdating } from '../redux/reducers/FormSlice.js';
import SelectRest from '../components/SelectRest.js';



const FormUsuarios = (props) => {
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
                    setFormData={setFormData}
                    onChange={handleChange}
                    required={true}
                />
            </Box>
            <Box mb={2} width={'50%'}>
                <Input
                    label="Código do usuário"
                    fieldName="userKey"
                    formData={formData}
                    setFormData={setFormData}
                    onChange={handleChange}
                    required={true}
                />
            </Box>
            <Box mb={2} width={'50%'}>
                <Input
                    label="CPF"
                    fieldName="cpf"
                    formData={formData}
                    setFormData={setFormData}
                    onChange={handleChange}
                    cpf
                />
            </Box>
            <Box mb={2} width={'50%'}>
                <Input
                    label="E-mail"
                    fieldName="email"
                    formData={formData}
                    setFormData={setFormData}
                    onChange={handleChange}
                    email
                    required={true}
                />
            </Box>
            <Box mb={2} width={'50%'}>
                <Input
                    label="Senha"
                    fieldName="password"
                    formData={formData}
                    setFormData={setFormData}
                    onChange={handleChange}
                    password
                />
            </Box>
            <Box mb={2} width={'50%'}>
                <SelectRest
                    label="Tipo de Usuário"
                    route='userType'
                    id='idUserType'
                    name='description'
                    onChange={(e) => handleChange(e, 0)}
                    form={formData}
                    defaultValue=""
                    invalidFields={invalidFields}
                    required={true}
                />
            </Box>
        </>
    );
};

export default FormUsuarios;