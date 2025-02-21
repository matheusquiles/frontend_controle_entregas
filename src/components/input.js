import React, { useState } from 'react';
import { InputLabel, Input } from '../styles/globalStyles';
import { GenericP } from '../styles/globalStyles';

export default function TextInput({ label, fieldName, first, small, medium, topless, formData, setFormData, onChange, invalidFields = [], disabled = false }) {
  const [error, setError] = useState(false);

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

  const isInvalid = invalidFields.includes(fieldName);

  return (
    <InputLabel first={first} small={small} medium={medium} topless={topless} style={{ borderColor: isInvalid ? 'red' : 'inherit' }}>
      <GenericP>{label}:</GenericP>
      <Input
        id={label}
        name={fieldName}
        type="text"
        value={formData?.[fieldName] || ''}
        onChange={handleChange} 
        style={{ borderColor: isInvalid ? 'red' : 'initial' }}
        disabled={disabled}
      />
      {isInvalid && <span style={{ color: 'red' }}>Este campo é obrigatório</span>} 
    </InputLabel>
  );
}
