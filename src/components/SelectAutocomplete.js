import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import api from '../api/api.js';

const SelectAutoComplete = ({
  label,
  route,
  id,
  name,
  onChange,
  form,
  defaultValue,
  disabled,
  required,
  submitted,
  invalidFields,
  loading: externalLoading,
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(form[name] ? '' : defaultValue || '');

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const response = await api.get(route);
        const validOptions = response.data
          .filter(item => item[name] && typeof item[name] === 'string')
          .map(item => ({
            id: item[id],
            label: item[name],
          }));
        setOptions(validOptions);

        // Sincroniza com o valor inicial do form[name], se existir
        if (form[name]) {
          const initialOption = validOptions.find(opt => opt.id === form[name]);
          setInputValue(initialOption ? initialOption.label : '');
        }
      } catch (error) {
        console.error(`Erro ao carregar ${route}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [route, id, name, form[name]]);

  const filterText = String(inputValue || '').toLowerCase();
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(filterText)
  );

  const isInvalid = submitted && required && !form[name] && invalidFields?.includes(name);

  return (
    <Autocomplete
      freeSolo
      options={filteredOptions}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
      loading={loading || externalLoading}
      inputValue={inputValue} // Controla o texto exibido
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue || ''); // Atualiza o texto ao digitar
      }}
      onChange={(event, newValue) => {
        // newValue é a opção selecionada ou null (se limpo)
        const newSelectedOption = newValue && typeof newValue !== 'string' ? newValue : null;
        const stringValue = newSelectedOption ? newSelectedOption.label : inputValue || '';
        setInputValue(stringValue);

        onChange({
          target: {
            name,
            value: newSelectedOption ? newSelectedOption.id : stringValue,
            selectedOption: newSelectedOption,
          },
        });
      }}
      disabled={disabled}
      sx={{ width: '100%' }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
          margin="normal"
          fullWidth
          error={isInvalid}
          helperText={isInvalid ? 'Campo obrigatório' : ''}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {(loading || externalLoading) ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default SelectAutoComplete;