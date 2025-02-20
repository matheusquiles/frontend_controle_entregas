import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData, setOptions, setLoading } from '../redux/reducers/FormSlice';

import { InputLabel, StyledSelect } from '../styles/globalStyles';

import { API_BASE_URL } from './helper/Contants';

export default function SelectRest({ label, first, medium, topless, small, route, id, name, defaultValue, invalidFields, disabled = false }) {
    const dispatch = useDispatch();
    const selected = useSelector((state) => state.form.formData[route] || defaultValue);
    const options = useSelector((state) => state.form.options[route] || []);
    const isInvalid = invalidFields.includes(route);
    const [loadingDelay, setLoadingDelay] = useState(false);
  
    const handleSelect = (event) => {
      const { value } = event.target;
      dispatch(setFormData({ [route]: value }));
    };
    
    const getData = useCallback(async () => {
      dispatch(setLoading(true));
      setLoadingDelay(true);
      try {
        const thisOptions = [];
        const { data } = await axios.get(`${API_BASE_URL}/${route}`);
  
        data.forEach((obj) => {
          thisOptions.push({ id: obj[id], name: obj[name] });
        });
  
        dispatch(setOptions({ route, options: thisOptions }));
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.log('Erro na requisição:', error);
      } finally {
        dispatch(setLoading(false));
        setLoadingDelay(false);
      }
    }, [route, id, name, dispatch]);
  
    useEffect(() => {
      if (!options.length) getData();
    }, [getData, options.length]);
    
  
    const isLoading = useSelector((state) => state.form.isLoading);
  
    return (
      <InputLabel first={first} medium={medium} topless={topless} small={small} style={{ borderColor: isInvalid ? 'red' : 'inherit' }}>
  
        <StyledSelect
          onChange={handleSelect}
          value={isLoading ? '' : (selected || '')}
          disabled={disabled || isLoading}>
          <option value="">{isLoading ? 'Carregando...' : 'Selecione'}</option>
          {options.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </StyledSelect>
        {isInvalid && <span style={{ color: 'red' }}>Este campo é obrigatório.</span>}
      </InputLabel>
        );
    }