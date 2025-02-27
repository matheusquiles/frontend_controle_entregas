import React, { useState } from 'react';
import { InputLabel, Input } from '../styles/globalStyles';
import { GenericP } from '../styles/globalStyles';
import InputMask from 'react-input-mask';

export default function TextInput({ label, fieldName, first, small, medium, topless, formData, setFormData, onChange, invalidFields = [], disabled = false, cpf = false, email = false, password = false }) {
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    if (e && e.target && e.target.name && e.target.value !== undefined) {
      const { name, value } = e.target;
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
      }));
      if (onChange) {
        onChange(e);
      }

      if (value.trim() !== '') {
        setError(false);
      }
    } else {
      console.error('Event target is missing name or value:', e ? e.target : 'Event is undefined');
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const isInvalid = invalidFields.includes(fieldName);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const inputType = password ? 'password' : 'text';

  return (
    <InputLabel first={first} small={small} medium={medium} topless={topless} style={{ borderColor: isInvalid ? 'red' : 'inherit' }}>
      <GenericP>{label}:</GenericP>
      {cpf ? (
        <InputMask
          mask="999.999.999-99"
          value={formData?.[fieldName] || ''}
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
          value={formData?.[fieldName] || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ borderColor: isInvalid ? 'red' : 'initial' }}
          disabled={disabled}
        />
      )}
      {isInvalid && <span style={{ color: 'red' }}>Este campo é obrigatório</span>}
      {email && touched && !validateEmail(formData?.[fieldName] || '') && <span style={{ color: 'red' }}>Email inválido</span>}
    </InputLabel>
  );
}