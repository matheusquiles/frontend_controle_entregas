import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFormData } from '../redux/reducers/FormSlice';
import { Input, InputLabel, GenericP } from '../styles/globalStyles';
import { IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PasswordInput = ({ 
  label, 
  fieldName, 
  confirmFieldName = 'confirmPassword', 
  formData, 
  onChange, 
  required = false, 
  submitted = false 
}) => {
  const dispatch = useDispatch();
  const password = formData[fieldName] || '';
  const confirmPassword = formData[confirmFieldName] || '';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isInvalid = required && (!password || !confirmPassword) && submitted;
  const passwordsMismatch = password && confirmPassword && password !== confirmPassword && submitted;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (typeof onChange === 'function') {
      onChange(e);
    }
    dispatch(setFormData({ [name]: value }));
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div>
      <InputLabel style={{ borderColor: isInvalid || passwordsMismatch ? 'red' : 'inherit' }}>
        <GenericP>{label}{required && ' *'}:</GenericP>
        <Input
          type={showPassword ? 'text' : 'password'}
          name={fieldName}
          value={password}
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={toggleShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {isInvalid && !password && <span style={{ color: 'red' }}>Este campo é obrigatório.</span>}
      </InputLabel>

      <InputLabel style={{ borderColor: isInvalid || passwordsMismatch ? 'red' : 'inherit', marginTop: '16px' }}>
        <GenericP>Confirmar Senha{required && ' *'}:</GenericP>
        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          name={confirmFieldName}
          value={confirmPassword}
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={toggleShowConfirmPassword} edge="end">
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {isInvalid && !confirmPassword && <span style={{ color: 'red' }}>Este campo é obrigatório.</span>}
        {passwordsMismatch && <span style={{ color: 'red' }}>As senhas não correspondem.</span>}
      </InputLabel>
    </div>
  );
};

export default PasswordInput;