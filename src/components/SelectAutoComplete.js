 import React, { useState, useEffect } from 'react';
 import { Autocomplete, TextField, CircularProgress } from '@mui/material';
 import api from '../api/api.js';
 import { useUser } from '../hooks/useUser';
 
 const SelectAutoComplete = ({
  label,
  route,
  idField = 'id',
  labelField = 'name',
  name,
  value,
  onChange,
  disabled,
  required,
  submitted,
  invalidFields,
  externalLoading,
  filterCoordinator = false 
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { user, role, loading: userLoading } = useUser(); 

  useEffect(() => {
    const fetchData = async () => {
      if (filterCoordinator && (!user || userLoading)) return; 

      setLoading(true);
      try {
        const response = await api.get(route);
        let data = response.data;

        if (filterCoordinator && user?.userType !== "ADMIN" && user?.name) {
          data = data.filter(item => item.coordinator === user.name);
        }

        const validOptions = data.map(item => ({
          id: item[idField],
          label: item[labelField]
        }));

        setOptions(validOptions);
      } catch (error) {
        console.error(`Erro ao carregar ${route}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [route, idField, labelField, filterCoordinator, user, userLoading]);

  const isInvalid = submitted && required && !value && invalidFields?.includes(name);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label || ''}
      loading={loading || externalLoading || userLoading}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      onChange={(event, newValue) => onChange({
        target: {
          name,
          value: newValue ? newValue.id : '',
          selectedOption: newValue,
        }
      })}
      disabled={disabled}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
          margin="normal"
          error={isInvalid}
          helperText={isInvalid ? 'Campo obrigatório' : ''}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {(loading || externalLoading || userLoading) && <CircularProgress color="inherit" size={20} />}
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
 