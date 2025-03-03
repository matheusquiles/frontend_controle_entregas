import React, { useEffect, useState } from 'react';
import { setFormData, setLoading, resetForm, setEditing, setNotification, setUpdating } from '../redux/reducers/FormSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../styles/globalStyles.jsx';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Box, Toolbar } from '@mui/material';
import NotificationSnackbar from '../components/NotificacaoSnackbar.js';
import { useUser } from '../hooks/useUser';
import FormButtons from '../components/FormButtons.js';
import AppAppBar from '../components/AppAppBar.js';
import CollectTable from '../components/CollectTable.js';
import SearchBar from '../components/SearchBar.js';

const Deliveries = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.form.isLoading);
    const loading = useSelector((state) => state.form.loading);
    const formData = useSelector((state) => state.form.formData);
    const invalidFields = useSelector((state) => state.form.invalidFields);
    const isUpdating = useSelector((state) => state.form.isUpdating);
    const isEditing = useSelector((state) => state.form.isEditing);
    const { user } = useUser();

    const [sampleData, setSampleData] = useState([]);

    const handleSubmit = async (e) => { 

    };

    const handleSearchComplete = (data) => {
        setSampleData(data);
    };


    useEffect(() => {
        dispatch(setNotification({ message: '', severity: 'info' }));
        dispatch(resetForm());
    }, [dispatch]);


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
                    maxWidth: 'xl',
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

                            <SearchBar onSearchComplete={handleSearchComplete}/>
                            <CollectTable data={sampleData} />


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
                        <FormButtons handleSubmit={handleSubmit} isLoading={isLoading} isUpdating={isUpdating} btEnviar="Salvar"/>
                    </Box>
                </form>
                <NotificationSnackbar />
            </Box>
        </>
    );
};

export default Deliveries;