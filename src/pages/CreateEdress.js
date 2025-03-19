import React, { useEffect, useState } from 'react';
import { setFormData, setLoading, setEditing, setNotification, resetForm } from '../redux/reducers/FormSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../styles/globalStyles.jsx';
import { FaSpinner } from 'react-icons/fa';
import { CssBaseline, Box, Toolbar, TextField, Grid } from '@mui/material';
import NotificationSnackbar from '../components/NotificacaoSnackbar.js';
import FormButtons from '../components/FormButtons.js';
import AppAppBar from '../components/AppAppBar.js';
import api from '../api/api.js';
import { useUser } from '../hooks/useUser.js';

const CreateEdress = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.form.isLoading);
    const formData = useSelector((state) => state.form.formData);
    const isEditing = useSelector((state) => state.form.isEditing);

    const { loading: userLoading } = useUser();
    const [submitted, setSubmitted] = useState(false);
    const [collectTypes, setCollectTypes] = useState([]);

    useEffect(() => {
        dispatch(setEditing(true));
        // Fetch collect types on component mount
        const fetchCollectTypes = async () => {
            try {
                const response = await api.get('api/collectType');
                setCollectTypes(response.data);
                // Initialize collectTypesData in formData
                dispatch(setFormData({
                    ...formData,
                    collectTypesData: response.data.map(type => ({
                        idCollectType: type.idCollectType,
                        description: type.description,
                        preValue: ''
                    }))
                }));
            } catch (error) {
                dispatch(setNotification({ 
                    message: 'Erro ao carregar tipos de coleta', 
                    severity: 'error' 
                }));
            }
        };
        fetchCollectTypes();
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        dispatch(setEditing(false));
        dispatch(setLoading(true));

        try {
            const dataToSend = { 
                ...formData,
                status: true,
                collectPreValue: formData.collectTypesData.map(type => ({
                    collectType: type.idCollectType,
                    preValue: type.preValue
                }))
            };
            console.log(dataToSend);

            const response = await api.post('api/edress/save', dataToSend);

            if (response.data === true) {
                dispatch(setNotification({ message: 'Endereço criado com sucesso!', severity: 'success' }));
                dispatch(setLoading(false));
                dispatch(setEditing(true));
            } else {
                dispatch(setNotification({ message: 'Erro ao criar endereço', severity: 'error' }));
                dispatch(setEditing(true));
            }
        } catch (error) {
            if (error.response) {
                const msg = !error.response.data.message ? 'Erro desconhecido' : 'Erro ao criar endereço: ' + error.response.data.message;
                dispatch(setNotification({ message: msg, severity: 'error' }));
            } else if (error.request) {
                dispatch(setNotification({ message: 'Erro: Nenhuma resposta recebida do servidor', severity: 'error' }));
            } else {
                dispatch(setNotification({ message: 'Erro ao configurar a requisição: ' + error.message, severity: 'error' }));
            }
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        dispatch(setFormData({ ...formData, [id]: value }));
    };

    const handlePreValueChange = (index) => (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            const newCollectTypesData = formData.collectTypesData.map((type, i) => 
                i === index 
                    ? { ...type, preValue: value }
                    : type
            );
            dispatch(setFormData({ 
                ...formData, 
                collectTypesData: newCollectTypesData 
            }));
        }
    };

    if (userLoading) {
        return (
            <LoadingOverlay>
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </LoadingOverlay>
        );
    }

    return (
        <>
            <CssBaseline />
            <AppAppBar />
            <Toolbar />
            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    color: 'black',
                    p: { xs: 2, md: 3 },
                    maxWidth: 'lg',
                    mx: 'auto',
                }}
            >
                <form onSubmit={handleSubmit} className="cadastro-usuario-form">
                    {isLoading && (
                        <LoadingOverlay>
                            <FaSpinner className="animate-spin text-4xl text-blue-500" />
                        </LoadingOverlay>
                    )}
                    <Box sx={{ flexGrow: 1, display: 'flex', minHeight: '100dvh' }}>
                        <Box
                            component="main"
                            className="MainContent"
                            sx={{
                                px: { xs: 2, md: 6 },
                                pt: {
                                    xs: 'calc(12px + var(--Header-height))',
                                    sm: 'calc(12px + var(--Header-height))',
                                    md: 3,
                                },
                                pb: { xs: 2, sm: 2, md: 3 },
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: 0,
                                gap: 1,
                                color: 'black',
                            }}
                        >
                            <TextField
                                id="description"
                                label="Descrição Endereço"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                size="small"
                                margin="normal"
                                error={submitted && !formData.description}
                                helperText={submitted && !formData.description ? 'Campo obrigatório' : ''}
                                disabled={!isEditing}
                            />
                            <TextField
                                id="edress"
                                label="Endereço"
                                value={formData.edress || ''}
                                onChange={handleInputChange}
                                size="small"
                                margin="normal"
                                error={submitted && !formData.edress}
                                helperText={submitted && !formData.edress ? 'Campo obrigatório' : ''}
                                disabled={!isEditing}
                            />
                            
                            {/* Collect Types Section */}
                            {formData.collectTypesData?.map((type, index) => (
                                <Grid container spacing={2} key={type.idCollectType} sx={{ mt: 2 }}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Tipo de Coleta"
                                            value={type.description}
                                            size="small"
                                            margin="normal"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Valor Prévio"
                                            value={type.preValue}
                                            onChange={handlePreValueChange(index)}
                                            size="small"
                                            margin="normal"
                                            placeholder="Digite um número"
                                            inputProps={{
                                                inputMode: 'decimal',
                                                pattern: '[0-9]*\.?[0-9]*'
                                            }}
                                            disabled={!isEditing}
                                        />
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        width: '100%',
                        p: 2,
                        borderTop: '1px solid #e0e0e0',
                        backgroundColor: '#fff',
                        justifyContent: 'flex-end',
                        position: 'sticky',
                        bottom: 0,
                        color: 'black',
                    }}>
                        <FormButtons handleSubmit={handleSubmit} isLoading={isLoading} />
                    </Box>
                </form>
                <NotificationSnackbar />
            </Box>
        </>
    );
};

export default CreateEdress;