// SelectRestCollect.js
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData, setOptions, setLoading } from '../redux/reducers/FormSlice';
import { InputLabel, StyledSelect, GenericP } from '../styles/globalStyles';
import { API_BASE } from '../helper/Constants';
import api from '../api/api';

export default function SelectRestCollect({ 
  label, 
  first, 
  medium, 
  topless, 
  small, 
  route, 
  id, 
  name, 
  defaultValue = '', 
  invalidFields = [], 
  disabled = false, 
  onChange, 
  index, 
  required = false, 
  submitted = false 
}) {
  const dispatch = useDispatch();
  const selected = useSelector((state) => state.form.formData[`${route}_${index}`] || defaultValue);
  const options = useSelector((state) => state.form.options[`${route}_${index}`] || []);
  const isInvalid = required && !selected && submitted; 
  const [loadingDelay, setLoadingDelay] = useState(false);

  const handleSelect = (event) => {
    const { value, name } = event.target;
    const selectedOption = options.find(option => option.id === parseInt(value));

    if (typeof onChange === 'function') {
      onChange({ target: { name, value, selectedOption } });
    }

    dispatch(setFormData({ [`${route}_${index}`]: value }));
  };

  const getData = useCallback(async () => {
    dispatch(setLoading(true));
    setLoadingDelay(true);
    try {
      const thisOptions = [];
      const { data } = await api.get(`${API_BASE}/${route}`);
      data.forEach((obj) => {
        thisOptions.push({ id: obj[id], name: obj[name] });
      });

      dispatch(setOptions({ route: `${route}_${index}`, options: thisOptions }));
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log('Erro na requisição:', error);
    } finally {
      dispatch(setLoading(false));
      setLoadingDelay(false);
    }
  }, [route, id, name, dispatch, index]);

  useEffect(() => {
    if (!options.length) getData();
  }, [getData, options.length]);

  const isLoading = useSelector((state) => state.form.isLoading);

  return (
    <InputLabel 
      first={first} 
      medium={medium} 
      topless={topless} 
      small={small} 
      style={{ borderColor: isInvalid ? 'red' : 'inherit' }}
    >
      <GenericP>{label}{required && ' *'}:</GenericP>
      <StyledSelect
        value={selected || ''}
        onChange={handleSelect}
        disabled={disabled || isLoading}
        name={name}
      >
        <option value="" disabled>Selecione...</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </StyledSelect>
      {isInvalid && <span style={{ color: 'red' }}>Este campo é obrigatório.</span>}
    </InputLabel>
  );
}