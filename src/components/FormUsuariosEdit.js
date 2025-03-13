import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification, setLoading } from '../redux/reducers/FormSlice.js';
import { CssBaseline, Box, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, Button, Modal, Typography } from '@mui/material';
import Input from '../components/input.js';
import PasswordInput from '../components/PasswordInput.js';
import { setFormData } from '../redux/reducers/FormSlice';
import NotificationSnackbar from '../components/NotificacaoSnackbar.js';
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../styles/Colors';
import api from '../api/api';
import { FaSpinner } from 'react-icons/fa';
import { LoadingOverlay } from '../styles/globalStyles.jsx';

const FormUsuariosEdit = ({ submitted, isAdmin, hierarchies, initialHierarchyId }) => {
  const formData = useSelector((state) => state.form.formData);
  const invalidFields = useSelector((state) => state.form.invalidFields) || [];
  const isLoading = useSelector((state) => state.form.isLoading);
  const dispatch = useDispatch();

  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({ password: '', confirmPassword: '' });
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
  
    // Isso ta feio demais, mas vai ser ajustado (um dia)
    const userTypeToIdMap = {
      'Administrador': 1,
      'Coordenador': 2,
      'Motoboy': 3,
    };
  
    if (name === 'userType') {
      const idUserType = userTypeToIdMap[value] || null;
      dispatch(setFormData({ ...formData, [name]: value, idUserType }));
    } else {
      dispatch(setFormData({ ...formData, [name]: newValue }));
    }
  };

  const initialValue = initialHierarchyId || '';

  const handleOpenPasswordModal = () => setOpenPasswordModal(true);
  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
    setNewPasswordData({ password: '', confirmPassword: '' });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setNewPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePassword = async () => {
    if (!newPasswordData.password || !newPasswordData.confirmPassword) {
      dispatch(setNotification({ message: 'Preencha os dois campos com a nova senha', severity: 'info' }));
      return;
    }
    if (newPasswordData.password !== newPasswordData.confirmPassword) {
      dispatch(setNotification({ message: 'As senhas não correspondem!', severity: 'error' }));
      return;
    }

    try {
      const dataToSend = {
        idUser: formData.idUser,
        password: newPasswordData.password,
      };
      setIsModalLoading(true);
      await api.post(`/api/users/changePassword`, dataToSend);
      dispatch(setNotification({ message: 'Senha alterada com sucesso!', severity: 'success' }));
      handleClosePasswordModal();
    } catch (error) {
      dispatch(setNotification({ message: 'Erro ao alterar senha', severity: 'error' }));
    } finally {
      setIsModalLoading(false);
    }
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
          disabled={true}
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

      <Box mb={2} width={'49%'} ml={2}>
        {isAdmin ? (
          <FormControl fullWidth>
            <InputLabel>Tipo de Usuário</InputLabel>
            <Select
              name="userType"
              value={formData.userType || ''}
              onChange={handleChange}
              label="Tipo de Usuário"
              required
            >
              <MenuItem value="">
                <em>Selecione...</em>
              </MenuItem>
              <MenuItem value="Motoboy">Motoboy</MenuItem>
              <MenuItem value="Coordenador">Coordenador</MenuItem>
              <MenuItem value="Administrador">Administrador</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <Box mb={2} width={'50%'} ml={2}>
            <FormControl fullWidth disabled>
              <InputLabel>Tipo de Usuário</InputLabel>
              <Select
                name="userType"
                value={formData.description || ''}
                label="Tipo de Usuário"
                disabled
              >
                <MenuItem value={formData.description}>{formData.description}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>
      <Box mb={2} width={'49%'} ml={2}>
        <FormControl fullWidth error={submitted && formData.description === 'Motoboy' && !formData.hierarchy}>
          <InputLabel>Hierarquia</InputLabel>
          <Select
            name="hierarchy"
            value={formData.hierarchy || initialValue}
            onChange={handleChange}
            label="Hierarquia"
          >
            <MenuItem value="">
              <em>Selecione...</em>
            </MenuItem>
            {hierarchies.map((hierarchy) => (
              <MenuItem key={hierarchy.id} value={hierarchy.id}>
                {hierarchy.name}
              </MenuItem>
            ))}
          </Select>
          {submitted && formData.description === 'Motoboy' && !formData.hierarchy && (
            <span style={{ color: 'red' }}>Este campo é obrigatório para Motoboys.</span>
          )}
        </FormControl>
      </Box>

      <Box mb={2} width={'49%'} ml={2}>
        <Button variant="contained" sx={{ bgcolor: MAIN_YELLOW, color: MAIN_FONT_COLLOR }}
          onClick={handleOpenPasswordModal}>
          Alterar Senha
        </Button>
      </Box>

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

      <Modal
        open={openPasswordModal}
        onClose={handleClosePasswordModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Alterar Senha
          </Typography>
          <PasswordInput
            label="Nova Senha"
            fieldName="password"
            confirmFieldName="confirmPassword"
            formData={newPasswordData}
            onChange={handlePasswordChange}
            required={true}
            submitted={false}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
            <Button variant="outlined" onClick={handleClosePasswordModal} sx={{ color: MAIN_YELLOW, borderColor: MAIN_YELLOW }}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSavePassword} sx={{ bgcolor: MAIN_YELLOW, color: MAIN_FONT_COLLOR }}>
              Salvar
            </Button>
          </Box>
          {isModalLoading && (
            <LoadingOverlay>
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </LoadingOverlay>
          )}
        </Box>
      </Modal>
      <NotificationSnackbar />
    </>
  );
};

export default FormUsuariosEdit;