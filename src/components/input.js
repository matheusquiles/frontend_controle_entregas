import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFormData } from '../redux/reducers/FormSlice';
import { InputLabel, Input, GenericP } from '../styles/globalStyles';
import InputMask from 'react-input-mask';
import { IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function TextInput({ 
  label, 
  fieldName, 
  first, 
  small, 
  medium, 
  topless, 
  formData, 
  onChange, 
  invalidFields = [], 
  disabled = false, 
  cpf = false, 
  email = false, 
  password = false, 
  required = false, 
  submitted = false 
}) {
  const dispatch = useDispatch();
  const value = formData[fieldName] || '';
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const isInvalid = required && !value && submitted;
  const isEmailInvalid = email && touched && value && !validateEmail(value) && submitted;

  const handleChange = (e) => {
    if (e && e.target && e.target.name && e.target.value !== undefined) {
      const { name, value } = e.target;
      dispatch(setFormData({ [name]: value }));
      if (onChange) {
        onChange(e);
      }
    } else {
      console.error('Event target is missing name or value:', e ? e.target : 'Event is undefined');
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const inputType = password ? (showPassword ? 'text' : 'password') : 'text';

  return (
    <InputLabel 
      first={first} 
      small={small} 
      medium={medium} 
      topless={topless} 
      style={{ borderColor: isInvalid || isEmailInvalid ? 'red' : 'inherit' }}
    >
      <GenericP>{label}{required && ' *'}:</GenericP>
      {cpf ? (
        <InputMask
          mask="999.999.999-99"
          value={value}
          onChange={(e) => handleChange({ target: { name: fieldName, value: e.target.value } })}
          onBlur={handleBlur}
          disabled={disabled}
        >
          {(inputProps) => <Input {...inputProps} style={{ borderColor: isInvalid ? 'red' : 'initial' }} />}
        </InputMask>
      ) : (
        <Input
          id={label}
          name={fieldName}
          type={inputType}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ borderColor: isInvalid || isEmailInvalid ? 'red' : 'initial' }}
          disabled={disabled}
          endAdornment={
            password ? (
              <InputAdornment position="end">
                <IconButton onClick={toggleShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : null
          }
        />
      )}
      {isInvalid && <span style={{ color: 'red' }}>Este campo é obrigatório</span>}
      {isEmailInvalid && <span style={{ color: 'red' }}>Email inválido</span>}
    </InputLabel>
  );
}